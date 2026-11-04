/**
 * Kiến thức riêng theo từng workflow W2 (tương đương các switch-case viết cứng trong KOMU),
 * tách riêng để dễ sửa khi W2 thêm/đổi workflow.
 */
import { normalizeDate, pick, truncate, type DynamicField } from "./forms";

/** "Probationary Confirmation Request" -> "probationaryconfirmationrequest" */
export const workflowKey = (name: string | undefined | null) => (name || "").toLowerCase().replace(/[^a-z0-9]/g, "");

/* ---------------- Lệnh *w2request <alias> (giống KOMU) ---------------- */

/** alias KOMU -> keyword W2 (`GetByNameWorkflowDefinitionsSpecification`) */
export const REQUEST_ALIASES: Record<string, { keyword: string; title: string }> = {
  changeoffice: { keyword: "changeofficerequest", title: "Change Office Request" },
  device: { keyword: "devicerequest", title: "Device Request" },
  officeequipment: { keyword: "officeequipmentrequest", title: "Office Equipment Request" },
  probationaryconfirmation: { keyword: "probationaryconfirmationrequest", title: "Probationary Confirmation Request" },
  wfh: { keyword: "wfhrequest", title: "WFH Request" },
};

/** Đổi alias (wfh, device...) sang keyword W2; tên khác giữ nguyên để W2 tự tìm theo tên workflow. */
export function resolveRequestKeyword(input: string): string {
  const alias = REQUEST_ALIASES[workflowKey(input)];
  return alias ? alias.keyword : input.trim();
}

/** Tên hiển thị của keyword (vd: wfhrequest -> WFH Request). */
export function requestTitle(keyword: string): string {
  const k = workflowKey(keyword);
  return Object.values(REQUEST_ALIASES).find((a) => a.keyword === k)?.title ?? keyword;
}

/** Workflow mà ngày trong request được phép ở quá khứ (vd: ngày bắt đầu thử việc). */
export function allowsPastDates(keyword: string) {
  return workflowKey(keyword).startsWith("probationaryconfirmation");
}

/* ---------------- Form duyệt mặc định khi W2 không gửi DynamicActionData ---------------- */

/**
 * Tên field phải khớp đúng web/email W2:
 * - Probation: `StrengthPoints`/`WeaknessPoints` (constants.ts DynamicData, template email `{StrengthPoints}`)
 * - Resignation: `LastWorkingDay` (dateTime) + `Note`, như KOMU đang gửi.
 */
const FALLBACK_ACTION_TEMPLATES: Record<string, (request: unknown) => DynamicField[]> = {
  probationaryconfirmationrequest: () => [
    { name: "StrengthPoints", type: "RichText", isRequired: true, data: "" },
    { name: "WeaknessPoints", type: "RichText", isRequired: true, data: "" },
  ],
  resignationrequest: (request) => {
    const desired = normalizeDate(String(pick(request, "DesiredLastWorkingDay") ?? "")) ?? "";
    return [
      { name: "LastWorkingDay", type: "dateTime", isRequired: true, data: desired, defaultValue: desired },
      { name: "Note", type: "RichText", isRequired: true, data: "" },
    ];
  },
};

function isEmptyTemplate(raw: string | null | undefined) {
  if (raw === null || raw === undefined || !raw.trim()) return true;
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length === 0;
  } catch {
    return false;
  }
}

/**
 * Template W2 gửi kèm luôn được ưu tiên. Chỉ khi W2 gửi rỗng mà workflow này
 * cần đánh giá (Probation/Resignation) thì mới dùng form mặc định.
 */
export function resolveActionTemplate(
  taskName: string,
  raw: string | null | undefined,
  input: unknown,
): { template: string | null; fallback: boolean } {
  const factory = FALLBACK_ACTION_TEMPLATES[workflowKey(taskName)];
  if (!factory || !isEmptyTemplate(raw)) return { template: raw ?? null, fallback: false };
  return { template: JSON.stringify(factory(pick(input, "Request"))), fallback: true };
}

/* ---------------- Nội dung card task ---------------- */

/** Nhãn hiển thị cho các field của từng loại request (giống card KOMU). */
const REQUEST_FIELD_LABELS: Record<string, Array<[key: string, label: string]>> = {
  changeofficerequest: [
    ["CurrentOffice", "Current Office"],
    ["DestinationOffice", "Destination Office"],
    ["Content", "Content"],
    ["StartDate", "Start Date"],
    ["EndDate", "End Date"],
  ],
  advancepaymentrequest: [
    ["AmountOfMoney", "Amount Of Money"],
    ["Reason", "Reason"],
    ["StartDay", "Start Day"],
  ],
  officeequipmentrequest: [
    ["CurrentOffice", "Current Office"],
    ["Equipment", "Equipment"],
    ["Reason", "Reason"],
  ],
  devicerequest: [
    ["CurrentOffice", "Current Office"],
    ["Project", "Project"],
    ["Device", "Device"],
    ["Reason", "Reason"],
  ],
  probationaryconfirmationrequest: [
    ["Staff", "Staff"],
    ["CurrentOffice", "Current Office"],
    ["Project", "Project"],
    ["Content", "Content"],
    ["StartDate", "Start Date"],
    ["EndDate", "End Date"],
  ],
  resignationrequest: [
    ["DesiredLastWorkingDay", "Desired Last Working Day"],
    ["Reason", "Reason"],
  ],
  unlocktimesheetrequest: [
    ["TimeUnlock", "Time Unlock"],
    ["Reason", "Reason"],
  ],
  wfhrequest: [
    ["Project", "Project"],
    ["CurrentOffice", "Current Office"],
    ["Reason", "Reason"],
    ["Dates", "Dates"],
  ],
};

export interface InfoField {
  name: string;
  value: string;
  inline?: boolean;
}

function text(v: unknown): string {
  if (v === null || v === undefined) return "";
  if (Array.isArray(v)) return v.map(text).filter(Boolean).join(", ");
  if (typeof v === "object") return "";
  return String(v).trim();
}

/** "PascalCaseKey" -> "Pascal Case Key" */
const humanize = (key: string) => key.replace(/([a-z0-9])([A-Z])/g, "$1 $2").replace(/_/g, " ");

export function formatDateTime(value: unknown, timeZone = "Asia/Ho_Chi_Minh"): string {
  const raw = text(value);
  if (!raw) return "";
  const d = new Date(raw);
  if (Number.isNaN(d.getTime())) return raw;
  return d.toLocaleString("vi-VN", { timeZone, hour12: false });
}

/**
 * Các field hiển thị trên card task:
 * Request input (theo loại, các loại chưa biết thì lấy tối đa 10 field), Request user, Email assignment, ...
 */
export function buildTaskInfo(task: unknown, maxGeneric = 10): InfoField[] {
  const tasks = pick(task, "Tasks");
  const input = pick(task, "Input");
  const request = pick<Record<string, unknown>>(input, "Request");
  const out: InfoField[] = [];

  const labels = REQUEST_FIELD_LABELS[workflowKey(String(pick(tasks, "Name") ?? ""))];
  if (request && typeof request === "object") {
    if (labels) {
      for (const [key, label] of labels) {
        const v = text(pick(request, key));
        if (v) out.push({ name: label, value: truncate(v, 500), inline: true });
      }
    } else {
      for (const [key, v] of Object.entries(request)) {
        if (out.length >= maxGeneric) break;
        const t = text(v);
        if (t) out.push({ name: humanize(key), value: truncate(t, 500), inline: true });
      }
    }
  }

  const user = pick(input, "RequestUser");
  const userLine = [text(pick(user, "Name")), text(pick(user, "Email")), text(pick(user, "BranchName"))]
    .filter(Boolean)
    .join(" · ");
  if (userLine) out.push({ name: "👤 Người tạo request", value: truncate(userLine, 500) });

  const emailTo = text(pick(task, "EmailTo"));
  if (emailTo) out.push({ name: "📨 Email assignment", value: truncate(emailTo, 500) });

  const created = formatDateTime(pick(tasks, "CreationTime"));
  if (created) out.push({ name: "🕒 Thời gian tạo", value: created, inline: true });

  return out;
}
