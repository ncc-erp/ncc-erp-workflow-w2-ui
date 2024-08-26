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
}

export const ImportJsonModal = ({ isOpen, onClose }: ImportJsonModalProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} closeOnOverlayClick={true}>
      <ModalOverlay />
      <ModalContent className={styles.customModal}>
        <ModalCloseButton />
        <ModalBody className={styles.customModalBody}>
          <ImportJsonForm onCloseModal={onClose} />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
