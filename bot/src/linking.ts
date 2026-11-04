import crypto from "node:crypto";

/**
 * Liên kết Mezon user id <-> email W2 bằng Mezon OAuth, do bot tự xử lý (không cần sửa W2).
 *
 * Luồng: bot DM cho user link `/link/start?s=<state>` -> chuyển sang Mezon OAuth -> Mezon gọi lại
 * `/link/callback?code&state` -> bot đổi code lấy token, gọi /userinfo để lấy user_id + email đã xác thực.
 * state được ký HMAC và gắn với Mezon user id người nhận link: chỉ đúng người đó mới liên kết được.
 */

export interface LinkingConfig {
  clientId: string;
  clientSecret: string;
  /** vd: https://oauth2.mezon.ai (giống W2 Authentication:Mezon:Domain) */
  oauthDomain: string;
  /** URL public của bot, vd: https://w2-bot.example.com */
  publicUrl: string;
  secret: string;
  emailDomain: string;
  ttlMs?: number;
}

export interface LinkedIdentity {
  mezonUserId: string;
  email: string;
}

export class LinkError extends Error {}

const b64url = (buf: Buffer) => buf.toString("base64url");

export class MezonLinker {
  private readonly ttlMs: number;

  constructor(
    private readonly cfg: LinkingConfig,
    private readonly fetchImpl: typeof fetch = fetch,
  ) {
    this.ttlMs = cfg.ttlMs ?? 15 * 60 * 1000;
  }

  get redirectUri() {
    return `${this.cfg.publicUrl}/link/callback`;
  }

  private sign(payload: string) {
    return b64url(crypto.createHmac("sha256", this.cfg.secret).update(payload).digest());
  }

  createState(mezonUserId: string, now = Date.now()): string {
    const payload = b64url(
      Buffer.from(JSON.stringify({ u: mezonUserId, e: now + this.ttlMs, n: b64url(crypto.randomBytes(8)) })),
    );
    return `${payload}.${this.sign(payload)}`;
  }

  verifyState(state: string, now = Date.now()): string {
    const [payload, sig] = (state || "").split(".");
    if (!payload || !sig) throw new LinkError("Link không hợp lệ");
    const expected = this.sign(payload);
    if (sig.length !== expected.length || !crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) {
      throw new LinkError("Link không hợp lệ");
    }
    let data: { u?: string; e?: number };
    try {
      data = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    } catch {
      throw new LinkError("Link không hợp lệ");
    }
    if (!data.u || !data.e) throw new LinkError("Link không hợp lệ");
    if (now > data.e) throw new LinkError("Link đã hết hạn, vui lòng gõ lại lệnh liên kết");
    return data.u;
  }

  /** Link ngắn bot gửi cho user. */
  linkUrl(mezonUserId: string) {
    return `${this.cfg.publicUrl}/link/start?s=${encodeURIComponent(this.createState(mezonUserId))}`;
  }

  /** URL Mezon OAuth (giống cách W2 dựng ở ExternalResourceAppService). */
  authorizeUrl(state: string) {
    this.verifyState(state);
    const q = new URLSearchParams({
      client_id: this.cfg.clientId,
      redirect_uri: this.redirectUri,
      response_type: "code",
      scope: "openid offline",
      state,
    });
    return `${this.cfg.oauthDomain}/oauth2/auth?${q.toString()}`;
  }

  async completeLink(code: string, state: string): Promise<LinkedIdentity> {
    const expectedUserId = this.verifyState(state);
    if (!code) throw new LinkError("Thiếu mã xác thực từ Mezon");

    const tokenRes = await this.fetchImpl(`${this.cfg.oauthDomain}/oauth2/token`, {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        state,
        grant_type: "authorization_code",
        redirect_uri: this.redirectUri,
        scope: "openid offline",
        client_id: this.cfg.clientId,
        client_secret: this.cfg.clientSecret,
      }).toString(),
      signal: AbortSignal.timeout(15000),
    });
    if (!tokenRes.ok) throw new LinkError(`Mezon từ chối xác thực (${tokenRes.status})`);
    const token = (await tokenRes.json()) as { access_token?: string };
    if (!token.access_token) throw new LinkError("Mezon không trả access token");

    const infoRes = await this.fetchImpl(`${this.cfg.oauthDomain}/userinfo`, {
      headers: { authorization: `Bearer ${token.access_token}` },
      signal: AbortSignal.timeout(15000),
    });
    if (!infoRes.ok) throw new LinkError(`Không lấy được thông tin Mezon (${infoRes.status})`);
    const info = (await infoRes.json()) as { user_id?: string; email?: string; sub?: string };

    const mezonUserId = String(info.user_id ?? "");
    const email = String(info.email || info.sub || "").trim().toLowerCase();
    if (!mezonUserId || mezonUserId !== expectedUserId) {
      throw new LinkError("Tài khoản Mezon đăng nhập không khớp với người nhận link. Hãy mở link bằng chính tài khoản của bạn.");
    }
    if (!email.endsWith(`@${this.cfg.emailDomain.toLowerCase()}`)) {
      throw new LinkError(`Tài khoản Mezon phải dùng email @${this.cfg.emailDomain}`);
    }
    return { mezonUserId, email };
  }
}
