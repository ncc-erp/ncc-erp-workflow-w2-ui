import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
} from '@chakra-ui/react';
import styles from '../style.module.scss';
import ImportJsonForm from '../forms/ImportJsonForm';
import { IJsonObject } from 'models/request';
interface ImportJsonModalProps {
  isOpen: boolean;
  onClose: () => void;
  id: string | undefined;
  onchangeData: (jsonObject: IJsonObject) => void;
}

export const ImportJsonModal = ({
  isOpen,
  onClose,
  id,
  onchangeData,
}: ImportJsonModalProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} closeOnOverlayClick={true}>
      <ModalOverlay />
      <ModalContent className={styles.customModal}>
        <ModalCloseButton />
        <ModalBody className={styles.customModalBody}>
          <ImportJsonForm
            id={id}
            onCloseModal={onClose}
            onChangeData={onchangeData}
          />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
