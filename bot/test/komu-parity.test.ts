import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { test } from "node:test";
import { W2Bot } from "../src/bot";
import { buildDataInputs, type RequestTemplateField } from "../src/forms";
import { toMezonText } from "../src/markdown";
import { JsonStore } from "../src/store";
import { buildTaskInfo, resolveActionTemplate, resolveRequestKeyword } from "../src/workflows";

/* ---------------- Form duyệt mặc định ---------------- */

test("probation: W2 không gửi template -> form StrengthPoints + WeaknessPoints", () => {
  for (const raw of [null, "", "[]"]) {
    const r = resolveActionTemplate("Probationary Confirmation Request", raw, {});
    assert.equal(r.fallback, true);
    assert.deepEqual(
      JSON.parse(r.template!).map((f: any) => [f.name, f.type, f.isRequired]),
      [
        ["StrengthPoints", "RichText", true],
        ["WeaknessPoints", "RichText", true],
      ],
    );
  }
});

test("W2 có template thì luôn dùng template của W2", () => {
  const raw = JSON.stringify([{ name: "Custom", type: "RichText", isRequired: true }]);
  assert.deepEqual(resolveActionTemplate("Probationary Confirmation Request", raw, {}), {
    template: raw,
    fallback: false,
  });
  assert.deepEqual(resolveActionTemplate("WFH Request", null, {}), { template: null, fallback: false });
});

test("resignation: điền sẵn LastWorkingDay từ DesiredLastWorkingDay", () => {
  const r = resolveActionTemplate("Resignation Request", null, { Request: { DesiredLastWorkingDay: "5/12/2026" } });
  const fields = JSON.parse(r.template!);
  assert.equal(fields[0].name, "LastWorkingDay");
  assert.equal(fields[0].type, "dateTime");
  assert.equal(fields[0].data, "05/12/2026");
  assert.equal(fields[1].name, "Note");
});

/* ---------------- Nội dung card ---------------- */

test("card: field theo loại request + người tạo + email assignment + thời gian", () => {
  const info = buildTaskInfo({
    Tasks: { Name: "WFH Request", CreationTime: "2026-11-04T02:00:00Z" },
    EmailTo: ["pm@ncc.asia", "hr@ncc.asia"],
    Input: {
      Request: { Dates: "05/11/2026", Reason: "ốm", Project: "w2", CurrentOffice: "ĐN", Extra: "x" },
      RequestUser: { Name: "Nguyễn Văn C", Email: "nguyenvanc@ncc.asia", BranchName: "Đà Nẵng" },
    },
  });
  assert.deepEqual(
    info.map((f) => f.name),
    ["Project", "Current Office", "Reason", "Dates", "👤 Người tạo request", "📨 Email assignment", "🕒 Thời gian tạo"],
  );
  assert.equal(info[4].value, "Nguyễn Văn C · nguyenvanc@ncc.asia · Đà Nẵng");
  assert.equal(info[5].value, "pm@ncc.asia, hr@ncc.asia");
  assert.match(info[6].value, /09:00:00.*4\/11\/2026|4\/11\/2026.*09:00:00/);
});

test("card: loại request chưa biết vẫn hiện field (không throw như KOMU)", () => {
  const info = buildTaskInfo({ Tasks: { Name: "New Thing" }, Input: { Request: { SomeField: "a", Obj: { x: 1 } } } });
  assert.deepEqual(info, [{ name: "Some Field", value: "a", inline: true }]);
});

/* ---------------- Lệnh & validate ---------------- */

test("alias *w2request giống KOMU", () => {
  assert.equal(resolveRequestKeyword("wfh"), "wfhrequest");
  assert.equal(resolveRequestKeyword("ProbationaryConfirmation"), "probationaryconfirmationrequest");
  assert.equal(resolveRequestKeyword("Đăng ký nghỉ"), "Đăng ký nghỉ");
});

const dateFields: RequestTemplateField[] = [
  { name: "Start Date", inputs: { id: "StartDate", type: 3, component: { id: "StartDate", required: true } } },
  { name: "End Date", inputs: { id: "EndDate", type: 3, component: { id: "EndDate", required: true } } },
];

test("validate: ngày trước hôm nay bị chặn, hôm nay thì được", () => {
  const today = "04/11/2026";
  const past = buildDataInputs(dateFields, { StartDate: "03/11/2026", EndDate: "05/11/2026" }, {}, { today });
  assert.equal(past.ok, false);
  if (!past.ok) assert.match(past.errors[0], /trước hôm nay/);
  const ok = buildDataInputs(dateFields, { StartDate: "4/11/2026", EndDate: "05/11/2026" }, {}, { today });
  assert.deepEqual(ok, { ok: true, dataInputs: { StartDate: "04/11/2026", EndDate: "05/11/2026" } });
});

test("validate: EndDate < StartDate bị chặn; probation cho phép ngày quá khứ", () => {
  const today = "04/11/2026";
  const r = buildDataInputs(dateFields, { StartDate: "10/11/2026", EndDate: "05/11/2026" }, {}, { today });
  assert.equal(r.ok, false);
  if (!r.ok) assert.match(r.errors[0], /EndDate/);
  const probation = buildDataInputs(dateFields, { StartDate: "01/08/2026", EndDate: "01/10/2026" }, {}, { today, allowPast: true });
  assert.equal(probation.ok, true);
});

/* ---------------- Markdown sendMessageToUser ---------------- */

test("markdown: **đậm**, ```code```, link với offset đúng", () => {
  const msg = toMezonText("Xin chào **Nguyễn Văn C**, xem ```abc``` tại https://w2.ncc.asia/tasks.");
  assert.equal(msg.t, "Xin chào Nguyễn Văn C, xem abc tại https://w2.ncc.asia/tasks.");
  const at = (m: any) => msg.t!.slice(m.s, m.e);
  assert.deepEqual(
    msg.mk!.map((m: any) => [m.type, at(m)]),
    [
      ["b", "Nguyễn Văn C"],
      ["pre", "abc"],
      ["lk", "https://w2.ncc.asia/tasks"],
    ],
  );
  assert.deepEqual(toMezonText("plain"), { t: "plain" });
});

/* ---------------- Luồng đầy đủ: đánh giá thử việc (lỗi KOMU làm mất nội dung đánh giá) ---------------- */

function setupBot() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "w2bot-"));
  const store = new JsonStore(dir);
  const sent: any[] = [];
  const updates: any[] = [];
  const msg = (content: any) => ({
    id: `m${sent.length}`,
    channel_id: "dm1",
    update: async (c: any) => void updates.push(c),
  });
  const client: any = {
    clientId: "bot",
    users: { fetch: async () => ({ sendDM: async (c: any) => (sent.push(c), msg(c)) }) },
    channels: { fetch: async () => ({ send: async (c: any) => void sent.push(c) }) },
  };
  const calls: any[] = [];
  const w2: any = {
    approveTask: async (...a: any[]) => void calls.push(["approve", ...a]),
    rejectTask: async (...a: any[]) => void calls.push(["reject", ...a]),
    getRequestTemplate: async (...a: any[]) => (calls.push(["template", ...a]), { workflowDefinitionId: "wf", embed: [] }),
  };
  const cfg: any = { w2: { webUrl: "" }, emailDomain: "ncc.asia", trustUsernameAsEmail: false, commandPrefix: "*w2" };
  const bot: any = new W2Bot(cfg, w2, store, client, null);
  bot.ready = true;
  store.setVerifiedEmail("userB", "nguyenvanb@ncc.asia", "import");
  return { bot, sent, updates, calls };
}

test("probation qua bot: gửi đủ cả StrengthPoints và WeaknessPoints lên W2", async () => {
  const { bot, sent, updates, calls } = setupBot();
  const res = await bot.sendW2TaskToUser({
    username: "nguyenvanb",
    task: {
      Tasks: { Id: "t1", Name: "Probationary Confirmation Request", DynamicActionData: "" },
      Input: { Request: { Staff: "nguyenvana@ncc.asia" } },
    },
  });
  assert.equal(res.ok, true);
  const inputs = JSON.stringify(sent[0]);
  assert.match(inputs, /Điểm mạnh/);
  assert.match(inputs, /Điểm yếu/);

  // thiếu điểm yếu -> không approve
  await bot.onButton({ message_id: res.messageId, channel_id: "dm1", button_id: "w2task:approve:t1", user_id: "userB", extra_data: '{"dyn_0":"Chăm chỉ"}' });
  assert.equal(calls.length, 0);

  await bot.onButton({
    message_id: res.messageId,
    channel_id: "dm1",
    button_id: "w2task:approve:t1",
    user_id: "userB",
    extra_data: '{"dyn_0-component":"Chăm chỉ","dyn_1":"Cần chủ động hơn"}',
  });
  assert.equal(calls.length, 1);
  const [kind, id, email, data] = calls[0];
  assert.deepEqual([kind, id, email], ["approve", "t1", "nguyenvanb@ncc.asia"]);
  assert.deepEqual(
    JSON.parse(data).map((f: any) => [f.name, f.data]),
    [
      ["StrengthPoints", "Chăm chỉ"],
      ["WeaknessPoints", "Cần chủ động hơn"],
    ],
  );
  assert.match(JSON.stringify(updates[0]), /Đã approve/);
});

test("*w2request wfh mở form WFH; alias sai thì báo lỗi", async () => {
  const { bot, sent, calls } = setupBot();
  await bot.onMessage({ sender_id: "userB", channel_id: "c1", content: { t: "*w2request wfh" } });
  assert.deepEqual(calls[0], ["template", "wfhrequest", "nguyenvanb@ncc.asia"]);
  assert.match(JSON.stringify(sent), /WFH Request/);

  await bot.onMessage({ sender_id: "userB", channel_id: "c1", content: { t: "*w2request abc" } });
  assert.equal(calls.length, 1);
  assert.match(sent.at(-1).t, /Không có loại request "abc"/);
});
