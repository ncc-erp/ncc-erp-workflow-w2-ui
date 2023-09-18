import {
  Divider,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';
import { InputDefinition } from 'models/request';
import RequestForm from './forms/RequestForm';
interface RequestTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  displayName?: string;
  requestId: string;
  workflow: string;
  inputDefinition?: InputDefinition;
}

export const RequestTemplateModal = ({
  isOpen,
  onClose,
  displayName,
  inputDefinition,
}: RequestTemplateModalProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader fontSize="md">{displayName}</ModalHeader>
        <Divider></Divider>
        <ModalCloseButton />
        <ModalBody>
          <RequestForm
            inputDefinition={inputDefinition}
            onCloseModal={onClose}
          />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
