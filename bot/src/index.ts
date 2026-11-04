import { config } from "./config";
import { W2Bot } from "./bot";
import { createHttpServer } from "./httpServer";
import { logger } from "./logger";
import { MezonLinker } from "./linking";
import { JsonStore } from "./store";
import { W2Client } from "./w2Client";

async function main() {
  const store = new JsonStore(config.dataDir);
  const w2 = new W2Client(config.w2);
  const linker = config.linking
    ? new MezonLinker({
        ...config.linking,
        secret: `link:${config.http.inboundSecret}`,
        emailDomain: config.emailDomain,
      })
    : null;
  if (!linker) logger.warn("Chưa cấu hình MEZON_OAUTH_* / BOT_PUBLIC_URL: tắt liên kết qua Mezon, chỉ dùng admin import");
  if (config.trustUsernameAsEmail) logger.warn("TRUST_MEZON_USERNAME_AS_EMAIL=true: đang đoán email từ username Mezon (không an toàn)");

  const bot = new W2Bot(config, w2, store, undefined, linker);

  const server = createHttpServer(
    bot,
    { inbound: config.http.inboundSecret, admin: config.http.adminSecret },
    linker,
  ).listen(config.http.port, () => logger.info(`HTTP server lắng nghe cổng ${config.http.port}`));

  await bot.start();

  const shutdown = (signal: string) => {
    logger.info(`Nhận ${signal}, đang dừng...`);
    store.flush();
    bot.stop();
    server.close(() => process.exit(0));
    setTimeout(() => process.exit(0), 5000).unref();
  };
  process.on("SIGINT", () => shutdown("SIGINT"));
  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("unhandledRejection", (err) => logger.error("unhandledRejection", err));
}

main().catch((err) => {
  logger.error("Khởi động thất bại", err);
  process.exit(1);
});
