import {
  Button,
  FormControl,
  FormLabel,
  ModalBody,
  ModalFooter,
  Textarea,
  Select,
  FormErrorMessage,
} from '@chakra-ui/react';
import { useState } from 'react';
import { Webhook } from 'models/webhook';

interface EditWebhookModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (webhookUrl: string, eventName: string) => void;
  eventName: string;
  url: string;
  webhook?: Webhook;
}

const EditWebhookForm: React.FC<EditWebhookModalProps> = ({
  onClose,
  onSubmit,
  eventName,
  url,
}) => {
  const [event, setEvent] = useState(eventName);
  const [webhookUrl, setWebhookUrl] = useState(url);
  const [errors, setErrors] = useState<{
    webhookUrl: string | null;
    eventName: string | null;
  }>({
    webhookUrl: null,
    eventName: null,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = {
      webhookUrl: webhookUrl.trim() ? null : 'Webhook URL is required',
      eventName: event.trim() ? null : 'Event Name is required',
    };
    setErrors(newErrors);
    if (newErrors.webhookUrl || newErrors.eventName) return;
    if (webhookUrl && event) {
      onSubmit(webhookUrl, event);
      onClose();
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <ModalBody>
        <FormControl mb={4} isInvalid={!!errors.eventName}>
          <FormLabel htmlFor="eventName">Event Name</FormLabel>
          <Select
            id="eventName"
            value={event}
            onChange={(e) => setEvent(e.target.value)}
            placeholder="Select an event"
          >
            <option value="Request Created">Request Created</option>
            <option value="Request Finished">Request Finished</option>
            <option value="Request Assigned">Request Assigned</option>
          </Select>
          <FormErrorMessage>{errors.eventName}</FormErrorMessage>
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
