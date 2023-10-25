import {
  Divider,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';
import styles from '../style.module.scss';
import CreateForm from '../forms/CreateForm';
interface RequestTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateTemplateModal = ({
  isOpen,
  onClose,
}: RequestTemplateModalProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} closeOnOverlayClick={true}>
      <ModalOverlay />
      <ModalContent className={styles.customModal}>
        <ModalHeader fontSize="md">Create Workflow Definition</ModalHeader>
        <Divider></Divider>
        <ModalCloseButton />
        <ModalBody>
          <CreateForm onCloseModal={onClose} />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
