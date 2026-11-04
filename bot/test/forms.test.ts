import assert from "node:assert/strict";
import { test } from "node:test";
import {
  buildDataInputs,
  fillDynamicTemplate,
  normalizeDate,
  parseDynamicTemplate,
  parseExtraData,
  pick,
  type RequestTemplateField,
} from "../src/forms";

const probationTemplate = JSON.stringify([
  { name: "Nhận xét", type: "text", isRequired: true, data: "" },
  { name: "Ngày kết thúc thử việc", type: "dateTime", isRequired: false, defaultValue: "01/12/2026" },
  { name: "Ghi chú", type: "text", isRequired: false },
]);

test("parseDynamicTemplate: none / form / invalid", () => {
  assert.equal(parseDynamicTemplate(null).kind, "none");
  assert.equal(parseDynamicTemplate("  ").kind, "none");
  assert.equal(parseDynamicTemplate("[]").kind, "none");
  assert.equal(parseDynamicTemplate(probationTemplate).kind, "form");
  assert.equal(parseDynamicTemplate("{bad json").kind, "invalid");
  assert.equal(parseDynamicTemplate('{"a":1}').kind, "invalid");
});

test("fillDynamicTemplate: điền đúng shape web W2 đọc được ([{name, data}])", () => {
  const tpl = parseDynamicTemplate(probationTemplate);
  assert.equal(tpl.kind, "form");
  if (tpl.kind !== "form") return;
  const res = fillDynamicTemplate(tpl.fields, { dyn_0: "  Làm tốt  ", dyn_1: "5/1/2027" });
  assert.equal(res.ok, true);
  if (!res.ok) return;
  const out = JSON.parse(res.json);
  assert.equal(out.length, 3);
  assert.deepEqual(out[0], { name: "Nhận xét", type: "text", isRequired: true, data: "Làm tốt" });
  assert.equal(out[1].data, "05/01/2027");
  assert.equal(out[2].data, "");
  // web dùng item.name + item.data
  for (const item of out) assert.ok("name" in item && "data" in item);
});

test("fillDynamicTemplate: field không được sửa thì giữ defaultValue", () => {
  const tpl = parseDynamicTemplate(probationTemplate);
  if (tpl.kind !== "form") throw new Error();
  const res = fillDynamicTemplate(tpl.fields, { dyn_0: "OK" });
  assert.equal(res.ok, true);
  if (res.ok) assert.equal(JSON.parse(res.json)[1].data, "01/12/2026");
});

test("fillDynamicTemplate: báo lỗi thiếu field bắt buộc và ngày sai", () => {
  const tpl = parseDynamicTemplate(probationTemplate);
  if (tpl.kind !== "form") throw new Error();
  const res = fillDynamicTemplate(tpl.fields, { dyn_1: "31/02/2026" });
  assert.equal(res.ok, false);
  if (!res.ok) assert.equal(res.errors.length, 2);
});

test("parseExtraData: object, chuỗi lồng, mảng, sai format", () => {
  assert.deepEqual(parseExtraData('{"a":"x","b":["1","2"],"c":3,"d":{"value":"v"}}'), {
    a: "x",
    b: "1, 2",
    c: "3",
    d: "v",
  });
  assert.deepEqual(parseExtraData(JSON.stringify(JSON.stringify({ a: "x" }))), { a: "x" });
  assert.deepEqual(parseExtraData('{"dyn_0-component":"hay","reason":""}'), { dyn_0: "hay", reason: "" });
  assert.deepEqual(parseExtraData(""), {});
  assert.deepEqual(parseExtraData("not json"), {});
  assert.deepEqual(parseExtraData("[1,2]"), {});
});

test("normalizeDate", () => {
  assert.equal(normalizeDate("1/2/2026"), "01/02/2026");
  assert.equal(normalizeDate("29/02/2025"), null);
  assert.equal(normalizeDate("2026-01-01"), null);
});

const requestFields: RequestTemplateField[] = [
  { name: "Project", inputs: { id: "Project", type: 2, component: { id: "Project", required: true, options: [{ label: "W2", value: "w2" }] } } },
  { name: "Dates (dd/MM/yyyy)", inputs: { id: "Dates", type: 3, component: { id: "Dates", required: true } } },
  { name: "Reason", inputs: { id: "Reason", type: 3, component: { id: "Reason", required: false } } },
];

test("buildDataInputs: select lấy từ dropdown state, nhiều ngày", () => {
  const res = buildDataInputs(requestFields, { Dates: "1/11/2026, 2/11/2026" }, { Project: "w2" }, { today: "01/11/2026" });
  assert.deepEqual(res, { ok: true, dataInputs: { Project: "w2", Dates: "01/11/2026, 02/11/2026" } });
});

test("buildDataInputs: lỗi option và thiếu field", () => {
  const res = buildDataInputs(requestFields, { Project: "khác" });
  assert.equal(res.ok, false);
  if (!res.ok) assert.equal(res.errors.length, 2);
});

test("pick không phân biệt hoa thường", () => {
  const task = { Tasks: { Id: "abc", DynamicActionData: null } };
  assert.equal(pick(pick(task, "tasks"), "id"), "abc");
});
