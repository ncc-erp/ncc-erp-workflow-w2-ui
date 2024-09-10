import {
  Divider,
  Grid,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';
import { InputDefinition, Settings } from 'models/request';
import DefineInputForm from '../forms/DefineInputForm';
import styles from '../style.module.scss';
import { ColorSettingForm } from '../forms/ColorSettingForm';
import { useState } from 'react';
import ExportImportJson from '../ExportImportJson';
interface DefineTemplateInputModalProps {
  isOpen: boolean;
  requestId: string;
  onClose: () => void;
  inputDefinition?: InputDefinition;
  workflowName: string;
}

export const DefineTemplateInputModal = ({
  isOpen,
  onClose,
  inputDefinition,
  requestId,
  workflowName,
}: DefineTemplateInputModalProps) => {
  const colorCode = '#FFF';
  const [colorSettings, setColorSettings] = useState<Settings>({
    color: '#ffffff',
  });
  const onColorSubmit = (color: string) => {
    setColorSettings({ color: color ?? colorCode });
  };
  return (
    <Modal isOpen={isOpen} onClose={onClose} closeOnOverlayClick={true}>
      <ModalOverlay />
      <ModalContent className={styles.customModal}>
        <Grid
          templateColumns="1fr auto"
          alignItems="center"
          gap={4}
          paddingRight={32}
          marginTop={2}
          marginBottom={2}
        >
          <ModalHeader fontSize="md">Define Workflow Input</ModalHeader>
          <ExportImportJson
            workflowName={workflowName}
            requestId={requestId}
            inputDefinition={inputDefinition}
            onClose={onClose}
          />
          <ColorSettingForm
            inputDefinition={inputDefinition}
            OnColorSubmit={onColorSubmit}
          />
        </Grid>
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
