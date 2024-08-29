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
import { ColorSettingForm } from '../forms/ColorSettingForm';
import { useState } from 'react';
interface DefineTemplateInputModalProps {
  isOpen: boolean;
  requestId: string;
  onClose: () => void;
  inputDefinition?: InputDefinition;
}

export const DefineTemplateInputModal = ({
  isOpen,
  onClose,
  inputDefinition,
  requestId,
}: DefineTemplateInputModalProps) => {
  const colorCode = '#FFF';
  const [colorSettings, setColorSettings] =
    useState<string>('{"color":"#FFF"}');
  const onColorSubmit = (color: string) => {
    if (color) {
      setColorSettings(`{"color":"${color}"}`);
    } else setColorSettings(`{"color":"${colorCode}"}`);
  };
  return (
    <Modal isOpen={isOpen} onClose={onClose} closeOnOverlayClick={true}>
      <ModalOverlay />
      <ModalContent className={styles.customModal}>
        <ModalHeader paddingBottom={2} fontSize="md">
          Define Workflow Input
        </ModalHeader>
        <ColorSettingForm
          inputDefinition={inputDefinition}
          OnColorSubmit={onColorSubmit}
        />
        <Divider></Divider>
        <ModalCloseButton />
        <ModalBody className={styles.customModalBody}>
          <DefineInputForm
            requestId={requestId}
            inputDefinition={inputDefinition}
            onCloseModal={onClose}
            settings={colorSettings}
          />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
