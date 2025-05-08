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
      webhookUrl: webhookUrl.trim() ? null : 'Webhook URL is required',
      webhookName: name.trim() ? null : 'Webhook Name is required',
      eventNames:
        selectedEvents.length > 0 ? null : 'Select at least one event',
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
          <FormLabel htmlFor="webhookName">Webhook Name</FormLabel>
          <Input
            id="webhookName"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Webhook Name"
          />
          <FormErrorMessage>{errors.webhookName}</FormErrorMessage>
        </FormControl>

        <FormControl mb={4} isInvalid={!!errors.eventNames}>
          <FormLabel>Event Name</FormLabel>
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
          <FormLabel htmlFor="webhookUrl">Webhook URL</FormLabel>
          <Textarea
            id="webhookUrl"
            value={webhookUrl}
            onChange={(e) => setWebhookUrl(e.target.value)}
            placeholder="Enter webhook URL"
            rows={6}
          />
          <FormErrorMessage>{errors.webhookUrl}</FormErrorMessage>
        </FormControl>
      </ModalBody>
      <ModalFooter>
        <Button colorScheme="blue" type="submit" mr={3}>
          Save
        </Button>
        <Button variant="ghost" onClick={onClose}>
          Cancel
        </Button>
      </ModalFooter>
    </form>
  );
};

export default EditWebhookForm;
