import { ButtonBuilder, EButtonMessageStyle, InteractiveBuilder } from "mezon-sdk";
import type { ChannelMessageContent } from "mezon-sdk";
import {
  REASON_FIELD_ID,
  W2_SELECT,
  dynamicFieldId,
  isDateField,
  parseDynamicTemplate,
  truncate,
  type DynamicField,
  type RequestTemplateField,
} from "./forms";
import type { TaskCard } from "./store";

/** button_id có dạng `<namespace>:<action>:<ref>` */
export const TASK_NS = "w2task";
export const REQ_NS = "w2req";

/** Nhãn tiếng Việt cho field đánh giá quen thuộc (giống email W2: "Điểm mạnh", "Điểm yếu"). */
const FIELD_LABELS: Record<string, string> = {
  StrengthPoints: "Điểm mạnh",
  WeaknessPoints: "Điểm yếu",
  LastWorkingDay: "Ngày làm việc cuối (dd/MM/yyyy)",
  Note: "Ghi chú",
};

/** "StrengthPoints" -> "Strength Points" */
const humanize = (key: string) => key.replace(/([a-z0-9])([A-Z])/g, "$1 $2").replace(/_/g, " ");

const actionRow = (buttons: ButtonBuilder) => [{ components: buttons.build() }];

function link(webUrl: string, page: string) {
  return webUrl ? `\n🔗 ${webUrl}/${page}` : "";
}

export function taskCard(card: TaskCard, webUrl: string): ChannelMessageContent {
  const b = new InteractiveBuilder(truncate(`📋 ${card.name || "W2 Task"}`, 200));
  b.setDescription(
    truncate(card.description || "Bạn có một task mới cần xử lý trên W2.", 1500) + link(webUrl, "tasks"),
  );
  for (const f of card.infoFields) b.addField(f.name, f.value, f.inline ?? true);

  const tpl = parseDynamicTemplate(card.template);
  if (tpl.kind === "form") {
    tpl.fields.forEach((field: DynamicField, i: number) => {
      const required = field.isRequired === true || field.isRequired === "true";
      const prefilled = String(field.data || field.defaultValue || "");
      const label = FIELD_LABELS[field.name] ?? humanize(field.name);
      b.addInputField(
        dynamicFieldId(i),
        `${label}${required ? " *" : ""}`,
        isDateField(field) ? "dd/MM/yyyy" : label,
        { defaultValue: prefilled, textarea: !isDateField(field) },
      );
    });
  } else if (tpl.kind === "invalid") {
    b.addField(
      "⚠️ Không hiển thị được form",
      "Dữ liệu form của task này không đúng định dạng. Vui lòng xử lý trên web W2 để không mất dữ liệu.",
    );
  }

  b.addInputField(REASON_FIELD_ID, "Lý do (bắt buộc khi Reject)", "Nhập lý do...", { textarea: true });

  const buttons = new ButtonBuilder();
  if (tpl.kind !== "invalid") buttons.addButton(`${TASK_NS}:approve:${card.taskId}`, "Approve", EButtonMessageStyle.SUCCESS);
  buttons.addButton(`${TASK_NS}:reject:${card.taskId}`, "Reject", EButtonMessageStyle.DANGER);

  return { embed: [b.build()], components: actionRow(buttons) };
}

export function taskResultCard(
  card: TaskCard,
  outcome: { title: string; detail?: string; submitted?: DynamicField[]; reason?: string },
  webUrl: string,
): ChannelMessageContent {
  const b = new InteractiveBuilder(truncate(`${outcome.title} · ${card.name || "W2 Task"}`, 200));
  b.setDescription(truncate(`${outcome.detail || ""}${link(webUrl, "tasks")}`.trim() || "-", 1500));
  for (const f of outcome.submitted || []) {
    const v = String(f.data ?? "").trim();
    if (v) b.addField(FIELD_LABELS[f.name] ?? humanize(f.name), truncate(v, 1000));
  }
  if (outcome.reason) b.addField("Lý do", truncate(outcome.reason, 1000));
  return { embed: [b.build()], components: [] };
}

export function requestFormCard(keyword: string, fields: RequestTemplateField[], formRef: string): ChannelMessageContent {
  const b = new InteractiveBuilder(truncate(`📝 Tạo request: ${keyword}`, 200));
  b.setDescription("Điền thông tin rồi bấm **Gửi request**. Trường có dấu * là bắt buộc.");
  for (const f of fields) {
    const comp = f.inputs.component;
    const label = `${f.name}${comp.required ? " *" : ""}`;
    if (f.inputs.type === W2_SELECT && comp.options?.length) {
      b.addSelectField(f.inputs.id, label, comp.options.map((o) => ({ label: o.label, value: o.value })));
    } else {
      b.addInputField(f.inputs.id, label, comp.placeholder || f.name, {
        defaultValue: f.value || "",
        textarea: !!comp.textarea,
      });
    }
  }
  const buttons = new ButtonBuilder()
    .addButton(`${REQ_NS}:submit:${formRef}`, "Gửi request", EButtonMessageStyle.PRIMARY)
    .addButton(`${REQ_NS}:cancel:${formRef}`, "Huỷ", EButtonMessageStyle.SECONDARY);
  return { embed: [b.build()], components: actionRow(buttons) };
}

export function simpleCard(title: string, description: string): ChannelMessageContent {
  const b = new InteractiveBuilder(truncate(title, 200)).setDescription(truncate(description, 1500));
  return { embed: [b.build()], components: [] };
}

export function helpText(prefix: string, aliases: Record<string, { title: string }> = {}): string {
  const legacy = Object.entries(aliases).map(([alias, a]) => `   ${a.title}: ${prefix}request ${alias}`);
  return [
    "🤖 W2 Bot — các lệnh:",
    `• ${prefix}request <loại>  — mở form tạo request (giống KOMU):`,
    ...legacy,
    `• ${prefix} <tên workflow>  — mở form theo tên workflow bất kỳ trên W2 (vd: ${prefix} WFH Request)`,
    `• ${prefix} link  — liên kết tài khoản Mezon với W2 (làm một lần)`,
    `• ${prefix} whoami  — xem email W2 đang liên kết`,
    `• ${prefix} help  — xem hướng dẫn`,
    "Task cần bạn duyệt sẽ được gửi qua DM, có nút Approve/Reject ngay trong tin nhắn.",
  ].join("\n");
}
