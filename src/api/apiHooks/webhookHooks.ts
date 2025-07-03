import { Webhook, WebhookResponse } from "models/webhook";
import { useCreate, useDelete, useGetList, useUpdateWebhooks } from ".";
import { QueryKeys } from "common/constants";

export const useGetAllWebhooks = () => {
    return useGetList<WebhookResponse>([QueryKeys.GET_WEBHOOKS], "/app/webhooks");
}

export const useUpdateWebhook = () => {
    return useUpdateWebhooks("/app/webhooks");
}

export const useCreateWebhook = () => {
    return useCreate<Webhook, WebhookResponse>("/app/webhooks");
}

export const useDeleteWebhook = () => {
    return useDelete("/app/webhooks");
}
