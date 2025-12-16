import {
  Button,
  FormControl,
  FormLabel,
  ModalBody,
  ModalFooter,
  Textarea,
  FormErrorMessage,
  Input,
  Checkbox,
  Stack,
} from '@chakra-ui/react';
import { useState } from 'react';
import { Webhook } from 'models/webhook';
import { EVENT_OPTIONS } from 'common/constants';
import { useTranslation } from 'react-i18next';

interface EditWebhookModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (webhookUrl: string, webhookName: string, events: string[]) => void;
  webhookName: string;
  url: string;
  webhook?: Webhook;
  eventNames?: string[];
}

const EditWebhookForm: React.FC<EditWebhookModalProps> = ({
  onClose,
  onSubmit,
  webhookName,
  url,
  eventNames = [],
}) => {
  const { t } = useTranslation();
  const [name, setName] = useState(webhookName);
  const [webhookUrl, setWebhookUrl] = useState(url);
  const [selectedEvents, setSelectedEvents] = useState<string[]>(
    eventNames || []
  );
  const [errors, setErrors] = useState<{
    webhookUrl: string | null;
    webhookName: string | null;
    eventNames: string | null;
  }>({
    webhookUrl: null,
    webhookName: null,
    eventNames: null,
  });

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSelectedEvents((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = {
      webhookUrl: webhookUrl.trim()
        ? null
        : t('WEBHOOKS_PAGE.WEBHOOK_URL_REQUIRED'),
      webhookName: name.trim()
        ? null
        : t('WEBHOOKS_PAGE.WEBHOOK_NAME_REQUIRED'),
      eventNames:
        selectedEvents.length > 0
          ? null
          : t('WEBHOOKS_PAGE.SELECT_AT_LEAST_ONE_EVENT'),
    };
    setErrors(newErrors);
    if (newErrors.webhookUrl || newErrors.webhookName || newErrors.eventNames)
      return;

    onSubmit(webhookUrl, name, selectedEvents);
    onClose();
  };

  return (
    <form onSubmit={handleSubmit}>
      <ModalBody>
        <FormControl mb={4} isInvalid={!!errors.webhookName}>
          <FormLabel htmlFor="webhookName">
            {t('WEBHOOKS_PAGE.WEBHOOK_NAME')}
          </FormLabel>
          <Input
            id="webhookName"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t('WEBHOOKS_PAGE.WEBHOOK_NAME')}
          />
          <FormErrorMessage>{errors.webhookName}</FormErrorMessage>
        </FormControl>

        <FormControl mb={4} isInvalid={!!errors.eventNames}>
          <FormLabel>{t('WEBHOOKS_PAGE.EVENT_NAME')}</FormLabel>
          <Stack spacing={2}>
            {EVENT_OPTIONS.map((event) => (
              <Checkbox
                key={event}
                value={event}
                isChecked={selectedEvents.includes(event)}
                onChange={handleCheckboxChange}
              >
                {event}
              </Checkbox>
            ))}
          </Stack>
          <FormErrorMessage>{errors.eventNames}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.webhookUrl}>
          <FormLabel htmlFor="webhookUrl">
            {t('WEBHOOKS_PAGE.WEBHOOK_URL')}
          </FormLabel>
          <Textarea
            id="webhookUrl"
            value={webhookUrl}
            onChange={(e) => setWebhookUrl(e.target.value)}
            placeholder={t('WEBHOOKS_PAGE.ENTER_WEBHOOK_URL')}
            rows={6}
          />
          <FormErrorMessage>{errors.webhookUrl}</FormErrorMessage>
        </FormControl>
      </ModalBody>
      <ModalFooter>
        <Button colorScheme="blue" type="submit" mr={3}>
          {t('WEBHOOKS_PAGE.SAVE')}
        </Button>
        <Button variant="ghost" onClick={onClose}>
          {t('WEBHOOKS_PAGE.CANCEL')}
        </Button>
      </ModalFooter>
    </form>
  );
};

export default EditWebhookForm;
