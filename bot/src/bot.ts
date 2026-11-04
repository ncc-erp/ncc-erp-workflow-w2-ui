import { MezonClient } from "mezon-sdk";
import type { ChannelMessage, ChannelMessageContent, DropdownBoxSelected } from "mezon-sdk";
import type { AppConfig } from "./config";
import {
  REASON_FIELD_ID,
  buildDataInputs,
  fillDynamicTemplate,
  parseDynamicTemplate,
  parseExtraData,
  pick,
  type RequestTemplateField,
} from "./forms";
import { toMezonText } from "./markdown";
import { REQUEST_ALIASES, allowsPastDates, buildTaskInfo, requestTitle, resolveActionTemplate, resolveRequestKeyword } from "./workflows";
import { REQ_NS, TASK_NS, helpText, requestFormCard, simpleCard, taskCard, taskResultCard } from "./cards";
import { logger } from "./logger";
import type { JsonStore, TaskCard } from "./store";
import { W2ApiError, type W2Client } from "./w2Client";
import type { MezonLinker } from "./linking";

/** Lỗi có HTTP status để trả về cho W2. */
export class BotHttpError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
  }
}

interface ButtonEvent {
  message_id: string;
  channel_id: string;
  button_id: string;
  sender_id: string;
  user_id: string;
  extra_data: string;
}

/** Phần của mezon-sdk Message mà bot dùng (class Message không được export từ package). */
interface SentMessage {
  id: string;
  channel_id: string;
  update(content: ChannelMessageContent): Promise<unknown>;
}

export class W2Bot {
  readonly client: MezonClient;
  private ready = false;
  /** message object còn sống trong phiên này, để update nhanh không cần fetch lại. */
  private readonly liveMessages = new Map<string, SentMessage>();
  /** chặn double click: messageId đang xử lý */
  private readonly inflight = new Set<string>();

  constructor(
    private readonly cfg: AppConfig,
    private readonly w2: W2Client,
    private readonly store: JsonStore,
    client?: MezonClient,
    private readonly linker: MezonLinker | null = null,
  ) {
    this.client = client ?? new MezonClient({ botId: cfg.mezon.botId, token: cfg.mezon.token });
  }

  get isReady() {
    return this.ready;
  }

  async start() {
    this.client.on("ready", () => {
      this.ready = true;
      logger.info(`Mezon bot sẵn sàng, clientId=${this.client.clientId}`);
    });
    this.client.onChannelMessage((e) => this.safe("channelMessage", () => this.onMessage(e)));
    this.client.onMessageButtonClicked((e) => this.safe("buttonClicked", () => this.onButton(e as ButtonEvent)));
    this.client.onDropdownBoxSelected((e) => this.safe("dropdown", () => this.onDropdown(e)));
    await this.client.login();
    this.ready = true;
  }

  stop() {
    this.ready = false;
    try {
      this.client.closeSocket();
    } catch {
      /* ignore */
    }
  }

  private async safe(name: string, fn: () => Promise<void>) {
    try {
      await fn();
    } catch (err) {
      logger.error(`Lỗi xử lý ${name}`, err);
    }
  }

  /* ======================= Định danh user ======================= */

  /**
   * Email W2 của người nhận trong request từ W2.
   * `username` W2 gửi là phần trước @ của email W2 (không phải username Mezon), nên ghép lại là đáng tin.
   */
  private recipientEmail(body: { username?: string; email?: string }): string | undefined {
    if (body.email?.trim()) return body.email.trim().toLowerCase();
    const username = body.username?.trim();
    return username ? `${username}@${this.cfg.emailDomain}`.toLowerCase() : undefined;
  }

  /**
   * Tìm Mezon user id của người nhận W2. W2 chỉ gửi `username` (= phần trước @ của email W2). Thứ tự:
   * 1. mezonUserId nếu payload có (W2 hiện không gửi, giữ để tương thích)
   * 2. liên kết đã xác minh (Mezon OAuth hoặc admin import): email W2 -> mezonUserId
   * 3. (chỉ khi TRUST_MEZON_USERNAME_AS_EMAIL=true) username Mezon trùng phần trước @ của email
   * Không tìm được thì báo lỗi, KHÔNG đoán bừa để tránh gửi nhầm người.
   */
  private resolveRecipient(body: { username?: string; mezonUserId?: string; email?: string }): string {
    const email = this.recipientEmail(body);
    const prefix = email?.split("@")[0];
    if (body.mezonUserId) {
      if (email) this.store.setVerifiedEmail(body.mezonUserId, email, "w2");
      return body.mezonUserId;
    }
    const verified = prefix ? this.store.findIdByEmailPrefix(prefix) : undefined;
    if (verified) return verified;
    if (this.cfg.trustUsernameAsEmail && prefix) {
      const guessed = this.store.findIdByMezonUsername(prefix);
      if (guessed) return guessed;
    }
    throw new BotHttpError(
      404,
      `Chưa liên kết Mezon cho "${email ?? body.username ?? "?"}" ` +
        `(user cần gõ "${this.cfg.commandPrefix} link" với bot, hoặc admin import danh sách).`,
    );
  }

  /**
   * Email W2 của người đang chat với bot: chỉ dùng liên kết đã xác minh.
   * Username Mezon có thể khác email (vd: mezonusera123) nên chỉ dùng để đoán khi bật chế độ cũ.
   */
  private resolveSenderEmail(mezonUserId: string, mezonUsername?: string): string | undefined {
    const rec = this.store.getUser(mezonUserId);
    if (rec?.email) return rec.email;
    const username = mezonUsername || rec?.username;
    if (this.cfg.trustUsernameAsEmail && username) return `${username}@${this.cfg.emailDomain}`.toLowerCase();
    return undefined;
  }

  private notLinkedText() {
    return this.linker
      ? `🔗 Tài khoản Mezon của bạn chưa được liên kết với W2. Gõ \`${this.cfg.commandPrefix} link\` để liên kết (đăng nhập Mezon một lần).`
      : "🔗 Tài khoản Mezon của bạn chưa được liên kết với W2. Vui lòng liên hệ admin W2 để được liên kết.";
  }

  /** Gọi khi Mezon OAuth trả về thành công. */
  async completeLink(identity: { mezonUserId: string; email: string }) {
    this.store.setVerifiedEmail(identity.mezonUserId, identity.email, "oauth");
    logger.info(`Đã liên kết Mezon ${identity.mezonUserId} <-> ${identity.email}`);
    try {
      await this.sendDM(identity.mezonUserId, { t: `✅ Đã liên kết tài khoản Mezon với W2: ${identity.email}` });
    } catch (err) {
      logger.warn("Không gửi được tin xác nhận liên kết", (err as Error).message);
    }
  }

  /** Admin import liên kết hàng loạt (vd: export từ cột AbpUsers.MezonUserId của W2). */
  importLinks(rows: Array<{ email?: string; mezonUserId?: string }>) {
    let imported = 0;
    const skipped: string[] = [];
    const domain = `@${this.cfg.emailDomain.toLowerCase()}`;
    for (const row of rows) {
      const email = String(row.email ?? "").trim().toLowerCase();
      const id = String(row.mezonUserId ?? "").trim();
      if (!email.endsWith(domain) || !/^\d+$/.test(id)) {
        skipped.push(`${email || "?"},${id || "?"}`);
        continue;
      }
      this.store.setVerifiedEmail(id, email, "import");
      imported++;
    }
    return { ok: true, imported, skipped };
  }

  /* ======================= Gửi tin nhắn ======================= */

  private ensureReady() {
    if (!this.ready) throw new BotHttpError(503, "Bot chưa kết nối Mezon");
  }

  private async sendDM(mezonUserId: string, content: ChannelMessageContent) {
    this.ensureReady();
    const user = await this.client.users.fetch(mezonUserId);
    const msg = (await user.sendDM(content)) as unknown as SentMessage;
    if (msg?.id) this.liveMessages.set(msg.id, msg);
    return msg;
  }

  private async sendToChannel(channelId: string, content: ChannelMessageContent) {
    const channel = await this.client.channels.fetch(channelId);
    return channel.send(content);
  }

  /** Sửa tin nhắn của bot; nếu không sửa được (vd: sau restart) thì gửi tin mới. */
  private async updateMessage(channelId: string, messageId: string, content: ChannelMessageContent) {
    try {
      let msg = this.liveMessages.get(messageId);
      if (!msg) {
        const channel = await this.client.channels.fetch(channelId);
        msg = (await channel.messages.fetch(messageId)) as unknown as SentMessage;
      }
      await msg.update(content);
      return;
    } catch (err) {
      logger.warn(`Không update được message ${messageId}, gửi tin mới`, (err as Error).message);
    }
    await this.sendToChannel(channelId, content);
  }

  private async notify(channelId: string, text: string) {
    try {
      await this.sendToChannel(channelId, { t: text });
    } catch (err) {
      logger.error(`Không gửi được thông báo vào channel ${channelId}`, err);
    }
  }

  /* ======================= API cho W2 gọi ======================= */

  async sendMessageToUser(body: { username?: string; message?: string; mezonUserId?: string; email?: string }) {
    if (!body.message?.trim()) throw new BotHttpError(400, "message rỗng");
    const userId = this.resolveRecipient(body);
    await this.sendDM(userId, toMezonText(body.message));
    return { ok: true };
  }

  async sendW2TaskToUser(body: { username?: string; task?: unknown; mezonUserId?: string; email?: string }) {
    const tasks = pick<Record<string, unknown>>(body.task, "Tasks");
    const taskId = String(pick(tasks, "Id") ?? "");
    if (!tasks || !taskId) throw new BotHttpError(400, "Thiếu task.Tasks.Id");

    const email = this.recipientEmail(body);
    if (!email) throw new BotHttpError(400, "Thiếu username/email người nhận");
    const userId = this.resolveRecipient(body);

    const existing = this.store.findTaskCard(taskId, userId);
    if (existing && existing.status === "pending") {
      logger.info(`Task ${taskId} đã gửi cho ${email} (message ${existing.messageId}), bỏ qua bản trùng`);
      return { ok: true, duplicate: true, messageId: existing.messageId };
    }

    const authorName = String(pick(tasks, "AuthorName") ?? "");
    const title = String(pick(tasks, "Title") ?? "");
    const description = [
      title && `**${title}**`,
      authorName && `Người tạo: ${authorName}`,
      String(pick(tasks, "Description") ?? ""),
    ]
      .filter(Boolean)
      .join("\n");

    const name = String(pick(tasks, "Name") ?? "W2 Task");
    const resolved = resolveActionTemplate(
      name,
      (pick<string>(tasks, "DynamicActionData") as string | null) ?? null,
      pick(body.task, "Input"),
    );
    if (resolved.fallback) logger.info(`Task ${taskId} (${name}): W2 không gửi form, dùng form mặc định của bot`);

    const draft: TaskCard = {
      taskId,
      messageId: "",
      channelId: "",
      recipientMezonId: userId,
      email,
      name,
      description,
      template: resolved.template,
      fallbackTemplate: resolved.fallback,
      infoFields: buildTaskInfo(body.task),
      status: "pending",
      createdAt: Date.now(),
    };

    const msg = await this.sendDM(userId, taskCard(draft, this.cfg.w2.webUrl));
    if (!msg?.id) throw new BotHttpError(502, "Mezon không trả về message id");
    this.store.putTaskCard({ ...draft, messageId: msg.id, channelId: msg.channel_id });
    logger.info(`Đã gửi task ${taskId} cho ${email} (message ${msg.id})`);
    return { ok: true, messageId: msg.id };
  }

  /* ======================= Sự kiện chat ======================= */

  private async onMessage(e: ChannelMessage) {
    if (!e?.sender_id || e.sender_id === this.client.clientId) return;
    if (e.username) this.store.rememberMezonUsername(e.sender_id, e.username);

    const text = e.content?.t?.trim();
    const prefix = this.cfg.commandPrefix;
    if (!text) return;
    const legacy = `${prefix}request`; // lệnh KOMU: *w2request <loại>
    const isCmd = (p: string) => text.toLowerCase() === p.toLowerCase() || text.toLowerCase().startsWith(`${p.toLowerCase()} `);
    let args: string;
    if (isCmd(legacy)) {
      args = text.slice(legacy.length).trim();
      if (args && args.toLowerCase() !== "help" && !REQUEST_ALIASES[args.toLowerCase()]) {
        await this.notify(
          e.channel_id,
          `❓ Không có loại request "${args}". Các loại: ${Object.keys(REQUEST_ALIASES).join(", ")}. Gõ ${legacy} help để xem hướng dẫn.`,
        );
        return;
      }
    } else if (isCmd(prefix)) {
      args = text.slice(prefix.length).trim();
    } else {
      return;
    }
    if (!args || args.toLowerCase() === "help") {
      await this.notify(e.channel_id, helpText(prefix, REQUEST_ALIASES));
      return;
    }
    const sub = args.toLowerCase();
    if (sub === "link") {
      await this.sendLinkInstructions(e);
      return;
    }
    if (sub === "whoami") {
      const rec = this.store.getUser(e.sender_id);
      await this.notify(
        e.channel_id,
        rec?.email ? `👤 Mezon của bạn đang liên kết với W2: ${rec.email}` : this.notLinkedText(),
      );
      return;
    }
    const keyword = resolveRequestKeyword(args.replace(/^request\s+/i, ""));

    const email = this.resolveSenderEmail(e.sender_id, e.username);
    if (!email) {
      await this.notify(e.channel_id, this.notLinkedText());
      return;
    }

    let template;
    try {
      template = await this.w2.getRequestTemplate(keyword, email);
    } catch (err) {
      await this.notify(e.channel_id, `❌ ${this.errorText(err)}`);
      return;
    }
    const fields: RequestTemplateField[] = template.embed || [];
    const formRef = `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
    const msg = await this.sendDM(e.sender_id, requestFormCard(requestTitle(keyword), fields, formRef));
    this.store.putRequestForm({
      messageId: msg.id,
      channelId: msg.channel_id,
      ownerMezonId: e.sender_id,
      email,
      keyword,
      workflowDefinitionId: template.workflowDefinitionId,
      embedJson: JSON.stringify(fields),
      selections: {},
      createdAt: Date.now(),
    });
    if (msg.channel_id !== e.channel_id) {
      await this.notify(e.channel_id, `📬 Đã gửi form "${requestTitle(keyword)}" vào DM của bạn.`);
    }
  }

  private async sendLinkInstructions(e: ChannelMessage) {
    if (!this.linker) {
      await this.notify(e.channel_id, "ℹ️ Bot chưa bật liên kết qua Mezon. Vui lòng liên hệ admin W2.");
      return;
    }
    const url = this.linker.linkUrl(e.sender_id);
    // gửi qua DM vì link gắn với tài khoản của người gõ lệnh
    await this.sendDM(e.sender_id, {
      t: `🔗 Bấm link sau và đăng nhập bằng tài khoản Mezon của bạn để liên kết với W2 (hết hạn sau 15 phút):\n${url}`,
    });
  }

  private async onDropdown(e: DropdownBoxSelected) {
    const form = this.store.getRequestForm(e.message_id);
    if (!form || e.user_id !== form.ownerMezonId) return;
    form.selections[e.selectbox_id] = (e.values || []).join(", ");
    this.store.putRequestForm(form);
  }

  private async onButton(e: ButtonEvent) {
    logger.debug("Button event", e);
    const [ns, action] = (e.button_id || "").split(":");
    if (ns !== TASK_NS && ns !== REQ_NS) return;

    if (this.inflight.has(e.message_id)) return;
    this.inflight.add(e.message_id);
    try {
      if (ns === TASK_NS) await this.handleTaskButton(e, action);
      else await this.handleRequestButton(e, action);
    } finally {
      this.inflight.delete(e.message_id);
    }
  }

  private async handleTaskButton(e: ButtonEvent, action: string) {
    const card = this.store.getTaskCard(e.message_id);
    if (!card) {
      await this.notify(e.channel_id, "⚠️ Không tìm thấy task của tin nhắn này. Vui lòng xử lý trên web W2.");
      return;
    }
    if (e.user_id !== card.recipientMezonId) return; // chỉ người được giao mới thao tác được
    if (card.status !== "pending") {
      await this.notify(e.channel_id, "ℹ️ Task này đã được xử lý.");
      return;
    }

    const values = parseExtraData(e.extra_data);
    const webUrl = this.cfg.w2.webUrl;

    try {
      if (action === "approve") {
        const tpl = parseDynamicTemplate(card.template);
        if (tpl.kind === "invalid") {
          await this.notify(e.channel_id, "⚠️ Form của task không hợp lệ, vui lòng approve trên web W2.");
          return;
        }
        let dynamicActionData: string | undefined;
        let submitted;
        if (tpl.kind === "form") {
          const filled = fillDynamicTemplate(tpl.fields, values);
          if (!filled.ok) {
            await this.notify(e.channel_id, `❌ Chưa approve được:\n• ${filled.errors.join("\n• ")}`);
            return;
          }
          dynamicActionData = filled.json;
          submitted = filled.fields;
        }
        await this.w2.approveTask(card.taskId, card.email, dynamicActionData);
        card.status = "approved";
        this.store.putTaskCard(card);
        await this.updateMessage(
          card.channelId,
          card.messageId,
          taskResultCard(card, { title: "✅ Đã approve", detail: `Bởi ${card.email}`, submitted }, webUrl),
        );
      } else if (action === "reject") {
        const reason = (values[REASON_FIELD_ID] || "").trim();
        if (!reason) {
          await this.notify(e.channel_id, "❌ Vui lòng nhập Lý do trước khi Reject.");
          return;
        }
        await this.w2.rejectTask(card.taskId, card.email, reason);
        card.status = "rejected";
        this.store.putTaskCard(card);
        await this.updateMessage(
          card.channelId,
          card.messageId,
          taskResultCard(card, { title: "⛔ Đã reject", detail: `Bởi ${card.email}`, reason }, webUrl),
        );
      }
    } catch (err) {
      if (err instanceof W2ApiError && err.isConflict) {
        card.status = "closed";
        this.store.putTaskCard(card);
        await this.updateMessage(
          card.channelId,
          card.messageId,
          taskResultCard(card, { title: "ℹ️ Task đã được xử lý trước đó", detail: err.message }, webUrl),
        );
        return;
      }
      await this.notify(e.channel_id, `❌ ${this.errorText(err)}`);
    }
  }

  private async handleRequestButton(e: ButtonEvent, action: string) {
    const form = this.store.getRequestForm(e.message_id);
    if (!form) {
      await this.notify(e.channel_id, "⚠️ Form đã hết hạn, vui lòng gõ lại lệnh.");
      return;
    }
    if (e.user_id !== form.ownerMezonId) return;

    if (action === "cancel") {
      this.store.deleteRequestForm(form.messageId);
      await this.updateMessage(form.channelId, form.messageId, simpleCard(`🚫 Đã huỷ: ${requestTitle(form.keyword)}`, "Form đã được huỷ."));
      return;
    }
    if (action !== "submit") return;

    const fields = JSON.parse(form.embedJson) as RequestTemplateField[];
    const result = buildDataInputs(fields, parseExtraData(e.extra_data), form.selections, {
      allowPast: allowsPastDates(form.keyword),
    });
    if (!result.ok) {
      await this.notify(e.channel_id, `❌ Chưa gửi được:\n• ${result.errors.join("\n• ")}`);
      return;
    }
    try {
      await this.w2.createInstance(form.workflowDefinitionId, result.dataInputs, form.email);
    } catch (err) {
      await this.notify(e.channel_id, `❌ ${this.errorText(err)}`);
      return;
    }
    this.store.deleteRequestForm(form.messageId);
    const webUrl = this.cfg.w2.webUrl;
    const summary = Object.entries(result.dataInputs)
      .map(([k, v]) => `• ${k}: ${v}`)
      .join("\n");
    await this.updateMessage(
      form.channelId,
      form.messageId,
      simpleCard(`✅ Đã tạo request: ${requestTitle(form.keyword)}`, `${summary}${webUrl ? `\n🔗 ${webUrl}/my-requests` : ""}`),
    );
  }

  private errorText(err: unknown) {
    if (err instanceof W2ApiError) return err.message;
    logger.error("Lỗi không mong đợi", err);
    return "Có lỗi xảy ra, vui lòng thử lại sau.";
  }
}
