import crypto from "node:crypto";
import express, { type NextFunction, type Request, type Response } from "express";
import { BotHttpError, type W2Bot } from "./bot";
import { LinkError, type MezonLinker } from "./linking";
import { logger } from "./logger";

function safeEqual(a: string, b: string) {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  return ab.length === bb.length && crypto.timingSafeEqual(ab, bb);
}

/**
 * HTTP API tương thích KOMU: W2 gọi `{Komu:ApiUrl}sendMessageToUser` và `{Komu:ApiUrl}sendW2TaskToUser`
 * với header X-Secret-Key. Khác KOMU: trả status code đúng để W2 log được lỗi thật.
 */
export function createHttpServer(
  bot: W2Bot,
  secrets: { inbound: string; admin: string },
  linker: MezonLinker | null = null,
) {
  const app = express();
  app.use(express.json({ limit: "2mb" }));

  app.get("/health", (_req, res) => {
    res.status(bot.isReady ? 200 : 503).json({ ok: bot.isReady });
  });

  const requireSecret = (secret: string) => (req: Request, res: Response, next: NextFunction) => {
    if (!safeEqual(req.header("x-secret-key") || "", secret)) {
      res.status(401).json({ ok: false, error: "unauthorized" });
      return;
    }
    next();
  };
  const auth = requireSecret(secrets.inbound);

  const handle =
    (name: string, fn: (body: any) => Promise<unknown>) => async (req: Request, res: Response) => {
      try {
        res.json(await fn(req.body ?? {}));
      } catch (err) {
        const status = err instanceof BotHttpError ? err.status : 502;
        logger.error(`${name} thất bại (${status})`, err instanceof BotHttpError ? err.message : err);
        res.status(status).json({ ok: false, error: (err as Error).message });
      }
    };

  app.post("/sendMessageToUser", auth, handle("sendMessageToUser", (b) => bot.sendMessageToUser(b)));
  app.post("/sendW2TaskToUser", auth, handle("sendW2TaskToUser", (b) => bot.sendW2TaskToUser(b)));

  /* ---- Admin: import liên kết email <-> Mezon user id ---- */
  app.post(
    "/admin/import-links",
    requireSecret(secrets.admin),
    handle("importLinks", async (b) => {
      const rows = Array.isArray(b) ? b : b.rows;
      if (!Array.isArray(rows)) throw new BotHttpError(400, "Body phải là mảng [{ email, mezonUserId }]");
      return bot.importLinks(rows);
    }),
  );

  /* ---- Liên kết tài khoản qua Mezon OAuth ---- */
  app.get("/link/start", (req, res) => {
    if (!linker) return void res.status(404).send(page("Chưa bật liên kết", "Bot chưa cấu hình Mezon OAuth."));
    try {
      res.redirect(linker.authorizeUrl(String(req.query.s || "")));
    } catch (err) {
      res.status(400).send(page("Không liên kết được", (err as Error).message));
    }
  });

  app.get("/link/callback", async (req, res) => {
    if (!linker) return void res.status(404).send(page("Chưa bật liên kết", "Bot chưa cấu hình Mezon OAuth."));
    if (req.query.error) {
      return void res.status(400).send(page("Không liên kết được", `Mezon trả lỗi: ${String(req.query.error)}`));
    }
    try {
      const identity = await linker.completeLink(String(req.query.code || ""), String(req.query.state || ""));
      await bot.completeLink(identity);
      res.send(page("✅ Đã liên kết", `Tài khoản Mezon của bạn đã liên kết với W2: ${identity.email}. Bạn có thể đóng trang này.`));
    } catch (err) {
      const msg = err instanceof LinkError ? err.message : "Có lỗi xảy ra, vui lòng thử lại.";
      if (!(err instanceof LinkError)) logger.error("Liên kết thất bại", err);
      res.status(400).send(page("Không liên kết được", msg));
    }
  });

  return app;
}

const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

function page(title: string, message: string) {
  return `<!doctype html><html lang="vi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>W2 Bot</title><style>body{font-family:system-ui,sans-serif;max-width:480px;margin:15vh auto;padding:0 16px;color:#222}
@media(prefers-color-scheme:dark){body{background:#111;color:#eee}}</style></head>
<body><h2>${esc(title)}</h2><p>${esc(message)}</p></body></html>`;
}
