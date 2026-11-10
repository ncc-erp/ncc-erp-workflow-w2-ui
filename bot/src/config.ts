import "dotenv/config";

function required(name: string): string {
  const value = process.env[name];
  if (!value || !value.trim()) {
    throw new Error(`Thiếu biến môi trường ${name}`);
  }
  return value.trim();
}

const trimSlash = (s: string) => s.replace(/\/+$/, "");

export const config = {
  mezon: {
    botId: required("MEZON_BOT_ID"),
    token: required("MEZON_BOT_TOKEN"),
  },
  w2: {
    baseUrl: trimSlash(required("W2_API_BASE_URL")),
    webUrl: trimSlash(process.env.W2_WEB_URL || ""),
    apiKey: required("W2_API_KEY"),
    apiKeyHeader: process.env.W2_API_KEY_HEADER || "x-secret-key",
    timeoutMs: Number(process.env.W2_TIMEOUT_MS || 15000),
  },
  http: {
    port: Number(process.env.PORT || 3000),
    inboundSecret: required("INBOUND_SECRET"),
    /** Secret cho API admin (import liên kết). Mặc định dùng INBOUND_SECRET. */
    adminSecret: process.env.ADMIN_SECRET || required("INBOUND_SECRET"),
  },
  emailDomain: process.env.EMAIL_DOMAIN || "ncc.asia",
  trustUsernameAsEmail: (process.env.TRUST_MEZON_USERNAME_AS_EMAIL ?? "false") === "true",
  /** Liên kết tài khoản qua Mezon OAuth (bật khi đủ 3 biến MEZON_OAUTH_CLIENT_ID/SECRET, BOT_PUBLIC_URL). */
  linking:
    process.env.MEZON_OAUTH_CLIENT_ID && process.env.MEZON_OAUTH_CLIENT_SECRET && process.env.BOT_PUBLIC_URL
      ? {
          clientId: process.env.MEZON_OAUTH_CLIENT_ID,
          clientSecret: process.env.MEZON_OAUTH_CLIENT_SECRET,
          oauthDomain: trimSlash(process.env.MEZON_OAUTH_DOMAIN || "https://oauth2.mezon.ai"),
          publicUrl: trimSlash(process.env.BOT_PUBLIC_URL),
        }
      : null,
  commandPrefix: process.env.COMMAND_PREFIX || "*w2",
  dataDir: process.env.DATA_DIR || "./data",
};

export type AppConfig = typeof config;
