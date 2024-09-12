import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
} from '@chakra-ui/react';
import styles from '../style.module.scss';
import ImportJsonForm from '../forms/ImportJsonForm';
interface ImportJsonModalProps {
  isOpen: boolean;
  onClose: () => void;
  id: string | undefined;
  workflowDefinitionId: string;
}

export const ImportJsonModal = ({
  isOpen,
  onClose,
  id,
  workflowDefinitionId,
}: ImportJsonModalProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} closeOnOverlayClick={true}>
      <ModalOverlay />
      <ModalContent className={styles.customModal}>
        <ModalCloseButton />
        <ModalBody className={styles.customModalBody}>
          <ImportJsonForm
            id={id}
            workflowDefinitionId={workflowDefinitionId}
            onCloseModal={onClose}
          />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
