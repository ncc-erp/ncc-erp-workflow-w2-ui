import { ListResult } from "./report";

export interface Webhook {
    eventName: string;
    url: string;
    id?: string;
    IsActive: boolean;
    CreationTime?: string;
}

export type WebhookResponse = ListResult<Webhook>;