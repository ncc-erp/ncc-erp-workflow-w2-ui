import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { test } from "node:test";
import { W2Bot } from "../src/bot";
import { LinkError, MezonLinker } from "../src/linking";
import { JsonStore } from "../src/store";

function setup(opts: { trust?: boolean; linker?: MezonLinker | null } = {}) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "w2bot-"));
  const store = new JsonStore(dir);
  const cfg: any = {
    mezon: { botId: "bot", token: "t" },
    w2: { webUrl: "http://w2" },
    emailDomain: "ncc.asia",
    trustUsernameAsEmail: !!opts.trust,
    commandPrefix: "*w2",
  };
  const fakeClient: any = { users: { fetch: async () => ({ sendDM: async () => ({ id: "m", channel_id: "c" }) }) } };
  const bot: any = new W2Bot(cfg, {} as any, store, fakeClient, opts.linker ?? null);
  bot.ready = true;
  return { bot, store };
}

/* ---------------- Case username Mezon khác email (nguyenvana) ---------------- */

test("chưa liên kết: không đoán email từ username Mezon", () => {
  const { bot } = setup();
  assert.equal(bot.resolveSenderEmail("111", "mezonusera123"), undefined);
});

test("sau khi liên kết (OAuth): dùng email đã xác minh, kể cả khi username Mezon khác hẳn", async () => {
  const { bot } = setup();
  await bot.completeLink({ mezonUserId: "111", email: "NguyenVanA@ncc.asia" });
  assert.equal(bot.resolveSenderEmail("111", "mezonusera123"), "nguyenvana@ncc.asia");
  // W2 gửi task cho username = phần trước @ của email -> tìm đúng Mezon id
  assert.equal(bot.resolveRecipient({ username: "nguyenvana" }), "111");
});

test("W2 gửi task: KHÔNG gửi nhầm cho người có username Mezon trùng", () => {
  const { bot, store } = setup();
  store.rememberMezonUsername("999", "nguyenvanb");
  assert.throws(() => bot.resolveRecipient({ username: "nguyenvanb" }), /Chưa liên kết Mezon/);
});

test("chế độ cũ (TRUST=true) mới đoán theo username", () => {
  const { bot, store } = setup({ trust: true });
  store.rememberMezonUsername("999", "nguyenvanb");
  assert.equal(bot.resolveRecipient({ username: "nguyenvanb" }), "999");
  assert.equal(bot.resolveSenderEmail("222", "nguyenvanc"), "nguyenvanc@ncc.asia");
});

test("một email chỉ gắn một Mezon user: liên kết mới thay liên kết cũ", async () => {
  const { bot, store } = setup();
  await bot.completeLink({ mezonUserId: "1", email: "a.b@ncc.asia" });
  await bot.completeLink({ mezonUserId: "2", email: "a.b@ncc.asia" });
  assert.equal(bot.resolveRecipient({ username: "a.b" }), "2");
  assert.equal(store.getUser("1")!.email, undefined);
});

test("admin import: nhận dòng hợp lệ, bỏ dòng sai domain/id", () => {
  const { bot } = setup();
  const res = bot.importLinks([
    { email: "nguyenvana@ncc.asia", mezonUserId: "111" },
    { email: "x@gmail.com", mezonUserId: "222" },
    { email: "y@ncc.asia", mezonUserId: "abc" },
  ]);
  assert.equal(res.imported, 1);
  assert.equal(res.skipped.length, 2);
  assert.equal(bot.resolveRecipient({ username: "nguyenvana" }), "111");
});

test("store cũ: bỏ email chưa xác minh khi load", () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "w2bot-"));
  fs.writeFileSync(
    path.join(dir, "store.json"),
    JSON.stringify({ version: 1, users: { "1": { mezonUserId: "1", email: "doan@ncc.asia", updatedAt: 1 } } }),
  );
  const store = new JsonStore(dir);
  assert.equal(store.getUser("1")!.email, undefined);
  assert.equal(store.findIdByEmailPrefix("doan"), undefined);
});

/* ---------------- Mezon OAuth linker ---------------- */

const linkCfg = {
  clientId: "cid",
  clientSecret: "csecret",
  oauthDomain: "https://oauth2.mezon.ai",
  publicUrl: "https://bot.example",
  secret: "s3cret",
  emailDomain: "ncc.asia",
};

function fakeMezon(info: Record<string, string>) {
  const calls: string[] = [];
  const impl: any = async (url: string, init: any) => {
    calls.push(url);
    if (url.endsWith("/oauth2/token")) {
      const body = new URLSearchParams(init.body);
      assert.equal(body.get("client_secret"), "csecret");
      assert.equal(body.get("redirect_uri"), "https://bot.example/link/callback");
      return new Response(JSON.stringify({ access_token: "tok" }), { status: 200 });
    }
    if (url.endsWith("/userinfo")) {
      assert.equal(init.headers.authorization, "Bearer tok");
      return new Response(JSON.stringify(info), { status: 200 });
    }
    return new Response("", { status: 404 });
  };
  return { impl, calls };
}

test("linker: state ký HMAC, hết hạn, bị sửa đều bị từ chối", () => {
  const linker = new MezonLinker(linkCfg);
  const state = linker.createState("111", 1_000);
  assert.equal(linker.verifyState(state, 2_000), "111");
  assert.throws(() => linker.verifyState(state, 1_000 + 16 * 60 * 1000), /hết hạn/);
  assert.throws(() => linker.verifyState(state.slice(0, -2) + "xx", 2_000), LinkError);
  assert.throws(() => new MezonLinker({ ...linkCfg, secret: "other" }).verifyState(state, 2_000), LinkError);
});

test("linker: authorizeUrl đúng tham số Mezon OAuth", () => {
  const linker = new MezonLinker(linkCfg);
  const url = new URL(linker.authorizeUrl(linker.createState("111")));
  assert.equal(url.origin + url.pathname, "https://oauth2.mezon.ai/oauth2/auth");
  assert.equal(url.searchParams.get("client_id"), "cid");
  assert.equal(url.searchParams.get("response_type"), "code");
  assert.equal(url.searchParams.get("redirect_uri"), "https://bot.example/link/callback");
});

test("linker: liên kết thành công khi user_id khớp người nhận link", async () => {
  const { impl } = fakeMezon({ user_id: "111", email: "NguyenVanA@ncc.asia" });
  const linker = new MezonLinker(linkCfg, impl);
  const res = await linker.completeLink("code", linker.createState("111"));
  assert.deepEqual(res, { mezonUserId: "111", email: "nguyenvana@ncc.asia" });
});

test("linker: người khác mở link -> từ chối", async () => {
  const { impl } = fakeMezon({ user_id: "999", email: "khac@ncc.asia" });
  const linker = new MezonLinker(linkCfg, impl);
  await assert.rejects(linker.completeLink("code", linker.createState("111")), /không khớp/);
});

test("linker: email ngoài domain công ty -> từ chối", async () => {
  const { impl } = fakeMezon({ user_id: "111", email: "abc@gmail.com" });
  const linker = new MezonLinker(linkCfg, impl);
  await assert.rejects(linker.completeLink("code", linker.createState("111")), /@ncc.asia/);
});
