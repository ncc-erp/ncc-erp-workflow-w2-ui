import { ListResult } from "./report";

export interface Webhook {
    webhookName: string;
    eventNames: string[];
    url: string;
    id?: string;
    IsActive?: boolean;
    CreationTime?: string;
}

export type WebhookResponse = ListResult<Webhook>;