import type { RequestTemplate } from "./forms";
import { logger } from "./logger";

export class W2ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly code?: string,
  ) {
    super(message);
  }

  /** W2 ném UserFriendlyException với code "409" khi task đã được approve/reject. */
  get isConflict() {
    return this.status === 409 || this.code === "409";
  }
}

export interface W2ClientOptions {
  baseUrl: string;
  apiKey: string;
  apiKeyHeader: string;
  timeoutMs: number;
}

/**
 * Gọi các API [ApiKeyAuth] trong W2 MezonAppService.
 * Route do ABP auto-API sinh: /api/app/mezon/<tên method kebab-case, bỏ tiền tố Create và hậu tố Async>.
 */
export class W2Client {
  constructor(private readonly opts: W2ClientOptions) {}

  private async post<T>(path: string, body: unknown): Promise<T> {
    const url = `${this.opts.baseUrl}/api/app/mezon/${path}`;
    let res: Response;
    try {
      res = await fetch(url, {
        method: "POST",
        headers: { "content-type": "application/json", [this.opts.apiKeyHeader]: this.opts.apiKey },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(this.opts.timeoutMs),
      });
    } catch (err) {
      throw new W2ApiError(`Không kết nối được W2 (${(err as Error).message})`, 0);
    }

    const text = await res.text();
    let json: any;
    try {
      json = text ? JSON.parse(text) : undefined;
    } catch {
      json = text;
    }
    if (!res.ok) {
      const message = json?.error?.message || (typeof json === "string" && json) || res.statusText || "Lỗi W2";
      logger.warn(`W2 ${path} -> ${res.status}: ${message}`);
      throw new W2ApiError(message, res.status, json?.error?.code ?? undefined);
    }
    return json as T;
  }

  getRequestTemplate(keyword: string, email: string) {
    return this.post<RequestTemplate>("list-property-definitions-by-command", { keyword, email });
  }

  createInstance(workflowDefinitionId: string, dataInputs: Record<string, string>, email: string) {
    return this.post<unknown>("new-instance", { workflowDefinitionId, dataInputs, email });
  }

  approveTask(id: string, email: string, dynamicActionData?: string) {
    return this.post<string>("approve-w2task", { id, email, dynamicActionData });
  }

  rejectTask(id: string, email: string, reason: string) {
    return this.post<string>("reject-w2task", { id, email, reason });
  }
}
