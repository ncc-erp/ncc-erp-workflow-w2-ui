/**
 * Logic thuần (không phụ thuộc Mezon/W2) để dễ test:
 * - đọc giá trị form từ extra_data của sự kiện bấm nút
 * - điền template DynamicActionData của task (vd: form đánh giá thử việc)
 * - dựng DataInputs khi tạo request mới
 */

/** Một field trong DynamicActionData. Web W2 dùng đúng shape này (ModalBoard.tsx). */
export interface DynamicField {
  name: string;
  type?: string;
  isRequired?: boolean | string;
  defaultValue?: unknown;
  data?: unknown;
  [key: string]: unknown;
}

export type TemplateParseResult =
  | { kind: "none" }
  | { kind: "form"; fields: DynamicField[] }
  | { kind: "invalid"; raw: string };

export const dynamicFieldId = (index: number) => `dyn_${index}`;
export const REASON_FIELD_ID = "reason";

const isTrue = (v: unknown) => v === true || (typeof v === "string" && v.toLowerCase() === "true");

export const isDateField = (f: DynamicField) => (f.type || "").toLowerCase() === "datetime";

export function parseDynamicTemplate(raw: string | null | undefined): TemplateParseResult {
  if (raw === null || raw === undefined || !raw.trim()) return { kind: "none" };
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length === 0) return { kind: "none" };
    if (Array.isArray(parsed) && parsed.every((x) => x && typeof x === "object" && typeof x.name === "string")) {
      return { kind: "form", fields: parsed as DynamicField[] };
    }
  } catch {
    // rơi xuống invalid
  }
  return { kind: "invalid", raw };
}

/** Chuyển giá trị bất kỳ trong extra_data về string. */
function toText(value: unknown): string {
  if (value === null || value === undefined) return "";
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  if (Array.isArray(value)) return value.map(toText).filter(Boolean).join(", ");
  if (typeof value === "object") {
    const o = value as Record<string, unknown>;
    if ("value" in o) return toText(o.value);
    if ("label" in o) return toText(o.label);
  }
  return "";
}

/**
 * extra_data của MessageButtonClicked là chuỗi JSON chứa giá trị các input trong embed,
 * dạng { "<inputId>": <value> }. Tài liệu Mezon chưa mô tả rõ nên đọc phòng thủ.
 * Lưu ý: input user không sửa có thể không xuất hiện → caller phải fallback về defaultValue.
 */
export function parseExtraData(extraData: string | undefined | null): Record<string, string> {
  if (!extraData) return {};
  let parsed: unknown;
  try {
    parsed = JSON.parse(extraData);
  } catch {
    return {};
  }
  if (typeof parsed === "string") {
    try {
      parsed = JSON.parse(parsed);
    } catch {
      return {};
    }
  }
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return {};
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(parsed as Record<string, unknown>)) {
    // InteractiveBuilder đặt id component = `${inputId}-component`, extra_data có thể dùng một trong hai.
    const key = k.endsWith("-component") ? k.slice(0, -"-component".length) : k;
    const text = toText(v);
    if (text || !(key in out)) out[key] = text;
  }
  return out;
}

const DATE_RE = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/;

/** Chuẩn hoá về dd/MM/yyyy, trả về null nếu không phải ngày hợp lệ. */
export function normalizeDate(input: string): string | null {
  const m = DATE_RE.exec(input.trim());
  if (!m) return null;
  const [d, mo, y] = [Number(m[1]), Number(m[2]), Number(m[3])];
  const date = new Date(Date.UTC(y, mo - 1, d));
  if (date.getUTCFullYear() !== y || date.getUTCMonth() !== mo - 1 || date.getUTCDate() !== d) return null;
  return `${String(d).padStart(2, "0")}/${String(mo).padStart(2, "0")}/${y}`;
}

export type FillResult = { ok: true; json: string; fields: DynamicField[] } | { ok: false; errors: string[] };

/**
 * Điền giá trị user nhập vào template, giữ nguyên các thuộc tính khác của field
 * (giống web: chỉ thay `data`), rồi JSON.stringify cả mảng để gửi lên W2.
 */
export function fillDynamicTemplate(fields: DynamicField[], values: Record<string, string>): FillResult {
  const errors: string[] = [];
  const filled = fields.map((field, i) => {
    let value = (values[dynamicFieldId(i)] ?? "").trim();
    if (!value) value = toText(field.data).trim() || toText(field.defaultValue).trim();

    if (!value && isTrue(field.isRequired)) {
      errors.push(`"${field.name}" là bắt buộc`);
    } else if (value && isDateField(field)) {
      const normalized = normalizeDate(value);
      if (!normalized) errors.push(`"${field.name}" phải có dạng dd/MM/yyyy`);
      else value = normalized;
    }
    return { ...field, data: value };
  });
  return errors.length ? { ok: false, errors } : { ok: true, json: JSON.stringify(filled), fields: filled };
}

/* ---------------- Tạo request mới ---------------- */

export interface RequestTemplateOption {
  label: string;
  value: string;
}
export interface RequestTemplateField {
  name: string;
  value?: string;
  inputs: {
    id: string;
    type: number; // 2 = SELECT, 3 = INPUT (MessageComponentTypeEnum bên W2)
    component: {
      id: string;
      placeholder?: string;
      required?: boolean;
      textarea?: boolean;
      options?: RequestTemplateOption[];
    };
  };
}
export interface RequestTemplate {
  workflowDefinitionId: string;
  embed: RequestTemplateField[];
}

export const W2_SELECT = 2;

export type DataInputsResult = { ok: true; dataInputs: Record<string, string> } | { ok: false; errors: string[] };

/** dd/MM/yyyy -> số yyyymmdd để so sánh */
const dateNum = (ddmmyyyy: string) => {
  const [d, m, y] = ddmmyyyy.split("/").map(Number);
  return y * 10000 + m * 100 + d;
};

/** Hôm nay theo giờ Việt Nam, dạng dd/MM/yyyy. */
export function todayVN(now = new Date()): string {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Ho_Chi_Minh",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(now);
  return parts; // en-GB: dd/MM/yyyy
}

/** Field ngày: nhãn có "(dd/MM/yyyy)" hoặc id quen thuộc mà KOMU kiểm tra (Dates, StartDate, EndDate). */
const isRequestDateField = (field: RequestTemplateField) =>
  field.name.includes("(dd/MM/yyyy)") || /^(dates|startdate|enddate)$/i.test(field.inputs.id);

export interface DataInputsOptions {
  /** cho phép ngày trước hôm nay (vd: xác nhận thử việc). Mặc định: không. */
  allowPast?: boolean;
  /** hôm nay dạng dd/MM/yyyy, để test */
  today?: string;
}

export function buildDataInputs(
  fields: RequestTemplateField[],
  values: Record<string, string>,
  selections: Record<string, string> = {},
  options: DataInputsOptions = {},
): DataInputsResult {
  const errors: string[] = [];
  const dataInputs: Record<string, string> = {};
  const today = dateNum(options.today ?? todayVN());
  for (const field of fields) {
    const id = field.inputs.id;
    const comp = field.inputs.component;
    let value = (values[id] ?? selections[id] ?? "").trim();
    const label = field.name;

    if (!value) {
      if (comp.required) errors.push(`"${label}" là bắt buộc`);
      continue;
    }
    if (field.inputs.type === W2_SELECT && comp.options?.length) {
      const opt = comp.options.find((o) => o.value === value || o.label === value);
      if (!opt) {
        errors.push(`"${label}" có giá trị không hợp lệ`);
        continue;
      }
      value = opt.value;
    }
    if (isRequestDateField(field)) {
      const parts = value.split(",").map((p) => p.trim()).filter(Boolean);
      const normalized = parts.map(normalizeDate);
      if (normalized.some((d) => d === null)) {
        errors.push(`"${label}" phải có dạng dd/MM/yyyy (nhiều ngày cách nhau bởi dấu phẩy)`);
        continue;
      }
      const dates = normalized as string[];
      if (!options.allowPast) {
        const past = dates.filter((d) => dateNum(d) < today);
        if (past.length) {
          errors.push(`"${label}" không được trước hôm nay: ${past.join(", ")}`);
          continue;
        }
      }
      value = [...new Set(dates)].join(", ");
    }
    dataInputs[id] = value;
  }

  const findId = (re: RegExp) => Object.keys(dataInputs).find((k) => re.test(k));
  const startId = findId(/^startdate$/i);
  const endId = findId(/^enddate$/i);
  if (startId && endId) {
    const [s, e] = [normalizeDate(dataInputs[startId]), normalizeDate(dataInputs[endId])];
    if (s && e && dateNum(e) < dateNum(s)) errors.push(`EndDate (${e}) không được trước StartDate (${s})`);
  }
  return errors.length ? { ok: false, errors } : { ok: true, dataInputs };
}

/* ---------------- Tiện ích đọc payload W2 ---------------- */

/** W2 serialize bằng Newtonsoft (PascalCase), đọc key không phân biệt hoa thường. */
export function pick<T = unknown>(obj: unknown, key: string): T | undefined {
  if (!obj || typeof obj !== "object") return undefined;
  const lower = key.toLowerCase();
  for (const [k, v] of Object.entries(obj as Record<string, unknown>)) {
    if (k.toLowerCase() === lower) return v as T;
  }
  return undefined;
}

export const truncate = (s: string, max: number) => (s.length > max ? `${s.slice(0, max - 1)}…` : s);
