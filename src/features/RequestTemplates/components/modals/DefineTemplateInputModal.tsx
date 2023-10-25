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
import DefineInputForm from '../forms/DefineInputForm';
import styles from '../style.module.scss';
interface DefineTemplateInputModalProps {
  isOpen: boolean;
  onClose: () => void;
  inputDefinition?: InputDefinition;
}

export const DefineTemplateInputModal = ({
  isOpen,
  onClose,
  inputDefinition,
}: DefineTemplateInputModalProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} closeOnOverlayClick={true}>
      <ModalOverlay />
      <ModalContent className={styles.customModal}>
        <ModalHeader fontSize="md">Define Workflow Input</ModalHeader>
        <Divider></Divider>
        <ModalCloseButton />
        <ModalBody>
          <DefineInputForm
            inputDefinition={inputDefinition}
            onCloseModal={onClose}
          />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
