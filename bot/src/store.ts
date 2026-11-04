import fs from "node:fs";
import path from "node:path";
import { logger } from "./logger";

export interface UserRecord {
  mezonUserId: string;
  /** Username Mezon thấy trong chat. KHÔNG dùng để suy ra email (có thể khác email, vd: mezonusera123). */
  username?: string;
  /** Email W2 đã xác minh (Mezon OAuth hoặc admin import). Không bao giờ đoán. */
  email?: string;
  /** Thời điểm xác minh (ms). */
  emailCheckedAt?: number;
  /** Nguồn xác minh */
  emailSource?: "oauth" | "import" | "w2";
  updatedAt: number;
}

export type CardStatus = "pending" | "approved" | "rejected" | "closed";

export interface TaskCard {
  taskId: string;
  messageId: string;
  channelId: string;
  recipientMezonId: string;
  email: string;
  name: string;
  description: string;
  /** DynamicActionData gốc từ W2 (template form), null nếu task không có form. */
  template: string | null;
  /** true nếu W2 không gửi template và bot dùng form mặc định (Probation/Resignation). */
  fallbackTemplate?: boolean;
  infoFields: Array<{ name: string; value: string; inline?: boolean }>;
  status: CardStatus;
  createdAt: number;
}

export interface RequestFormState {
  messageId: string;
  channelId: string;
  ownerMezonId: string;
  email: string;
  keyword: string;
  workflowDefinitionId: string;
  /** Template W2 trả về (RequestTemplate.embed) dạng JSON. */
  embedJson: string;
  selections: Record<string, string>;
  createdAt: number;
}

interface StoreData {
  version: 1;
  users: Record<string, UserRecord>;
  /** phần trước @ của email W2 (tin cậy) -> mezonUserId */
  emailPrefixes: Record<string, string>;
  /** username Mezon thấy trong chat -> mezonUserId (chỉ dùng ở chế độ TRUST_MEZON_USERNAME_AS_EMAIL) */
  usernames: Record<string, string>;
  taskCards: Record<string, TaskCard>;
  /** `${taskId}|${mezonUserId}` -> messageId, để không gửi trùng một task cho cùng một người. */
  taskIndex: Record<string, string>;
  requestForms: Record<string, RequestFormState>;
}

const RETENTION_MS = 90 * 24 * 3600 * 1000;

/**
 * Lưu trạng thái bền vững ra file JSON để bot restart xong các nút Approve/Reject cũ vẫn hoạt động.
 * Ghi theo kiểu tmp + rename để không bị hỏng file khi crash.
 */
export class JsonStore {
  private data: StoreData;
  private readonly file: string;
  private timer: NodeJS.Timeout | null = null;

  constructor(dataDir: string) {
    fs.mkdirSync(dataDir, { recursive: true });
    this.file = path.join(dataDir, "store.json");
    this.data = this.load();
    this.prune();
  }

  private load(): StoreData {
    const empty: StoreData = { version: 1, users: {}, emailPrefixes: {}, usernames: {}, taskCards: {}, taskIndex: {}, requestForms: {} };
    try {
      if (!fs.existsSync(this.file)) return empty;
      const data: StoreData = { ...empty, ...JSON.parse(fs.readFileSync(this.file, "utf8")) };
      // Store cũ có thể chứa email đoán từ username: chỉ giữ email đã xác minh với W2.
      data.emailPrefixes = {};
      for (const u of Object.values(data.users)) {
        if (u.email && !u.emailCheckedAt) delete u.email;
        if (u.email) data.emailPrefixes[u.email.split("@")[0]] = u.mezonUserId;
      }
      return data;
    } catch (err) {
      logger.error(`Không đọc được ${this.file}, dùng store rỗng`, err);
      return empty;
    }
  }

  private prune() {
    const cutoff = Date.now() - RETENTION_MS;
    for (const [id, card] of Object.entries(this.data.taskCards)) {
      if (card.createdAt < cutoff) delete this.data.taskCards[id];
    }
    for (const [key, messageId] of Object.entries(this.data.taskIndex)) {
      if (!this.data.taskCards[messageId]) delete this.data.taskIndex[key];
    }
    for (const [id, form] of Object.entries(this.data.requestForms)) {
      if (form.createdAt < Date.now() - 7 * 24 * 3600 * 1000) delete this.data.requestForms[id];
    }
  }

  save() {
    if (this.timer) return;
    this.timer = setTimeout(() => {
      this.timer = null;
      this.flush();
    }, 200);
  }

  flush() {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    const tmp = `${this.file}.tmp`;
    try {
      fs.writeFileSync(tmp, JSON.stringify(this.data));
      fs.renameSync(tmp, this.file);
    } catch (err) {
      logger.error("Ghi store thất bại", err);
    }
  }

  /* users */
  getUser(mezonUserId: string) {
    return this.data.users[mezonUserId];
  }
  /** Ghi nhận username Mezon thấy trong chat (không tin cậy cho việc suy ra email). */
  rememberMezonUsername(mezonUserId: string, username: string) {
    const prev = this.data.users[mezonUserId];
    if (prev?.username === username) return;
    this.data.users[mezonUserId] = { ...prev, mezonUserId, username, updatedAt: Date.now() };
    this.data.usernames[username.toLowerCase()] = mezonUserId;
    this.save();
  }

  /** Ghi nhận email W2 đã xác minh cho một Mezon user. */
  setVerifiedEmail(mezonUserId: string, email: string, source: NonNullable<UserRecord["emailSource"]>) {
    const prev = this.data.users[mezonUserId];
    const normalized = email.trim().toLowerCase();
    const prefix = normalized.split("@")[0];
    if (prev?.email && prev.email !== normalized) {
      const oldPrefix = prev.email.split("@")[0];
      if (this.data.emailPrefixes[oldPrefix] === mezonUserId) delete this.data.emailPrefixes[oldPrefix];
    }
    // một email chỉ gắn với một Mezon user: gỡ liên kết cũ nếu email này đang thuộc người khác
    const owner = this.data.emailPrefixes[prefix];
    if (owner && owner !== mezonUserId && this.data.users[owner]) {
      this.data.users[owner] = { ...this.data.users[owner], email: undefined, emailCheckedAt: undefined, emailSource: undefined };
    }
    this.data.users[mezonUserId] = {
      ...prev,
      mezonUserId,
      email: normalized,
      emailCheckedAt: Date.now(),
      emailSource: source,
      updatedAt: Date.now(),
    };
    this.data.emailPrefixes[prefix] = mezonUserId;
    this.save();
  }

  clearVerifiedEmail(mezonUserId: string) {
    const prev = this.data.users[mezonUserId];
    if (!prev?.email) return;
    const prefix = prev.email.split("@")[0];
    if (this.data.emailPrefixes[prefix] === mezonUserId) delete this.data.emailPrefixes[prefix];
    this.data.users[mezonUserId] = { ...prev, email: undefined, emailCheckedAt: undefined, emailSource: undefined, updatedAt: Date.now() };
    this.save();
  }

  /** Tìm theo phần trước @ của email W2 (đã xác minh). */
  findIdByEmailPrefix(prefix: string) {
    return this.data.emailPrefixes[prefix.toLowerCase()];
  }

  /** Tìm theo username Mezon (chỉ đoán). */
  findIdByMezonUsername(username: string) {
    return this.data.usernames[username.toLowerCase()];
  }

  /* task cards */
  getTaskCard(messageId: string) {
    return this.data.taskCards[messageId];
  }
  findTaskCard(taskId: string, mezonUserId: string) {
    const id = this.data.taskIndex[`${taskId}|${mezonUserId}`];
    return id ? this.data.taskCards[id] : undefined;
  }
  putTaskCard(card: TaskCard) {
    this.data.taskCards[card.messageId] = card;
    this.data.taskIndex[`${card.taskId}|${card.recipientMezonId}`] = card.messageId;
    this.save();
  }

  /* request forms */
  getRequestForm(messageId: string) {
    return this.data.requestForms[messageId];
  }
  putRequestForm(form: RequestFormState) {
    this.data.requestForms[form.messageId] = form;
    this.save();
  }
  deleteRequestForm(messageId: string) {
    delete this.data.requestForms[messageId];
    this.save();
  }
}
