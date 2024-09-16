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
import { IJsonObject, InputDefinition, Settings } from 'models/request';
import DefineInputForm from '../forms/DefineInputForm';
import styles from '../style.module.scss';
import { SettingForm } from '../forms/SettingForm';
import { useCallback, useEffect, useState } from 'react';
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
  const [updatedInputDefinition, setUpdatedInputDefinition] = useState<
    InputDefinition | undefined
  >(inputDefinition);

  const onSettingsSubmit = (color: string, title: string) => {
    const settings: Settings = { color, titleTemplate: title };

    setUpdatedInputDefinition((prevDefinition) => {
      if (!prevDefinition) return undefined;
      console.log('prevDefinition', prevDefinition);

      return {
        ...prevDefinition,
        settings,
      };
    });
  };

  useEffect(() => {
    setUpdatedInputDefinition(inputDefinition);
  }, [inputDefinition]);

  const handleChangeData = useCallback((jsonObject: IJsonObject) => {
    setUpdatedInputDefinition((prevDefinition) => {
      const updatedData = {
        ...prevDefinition,
        ...jsonObject,
        workflowDefinitionId: prevDefinition?.workflowDefinitionId ?? '',
        id: prevDefinition?.id ?? '',
        propertyDefinitions: jsonObject?.propertyDefinitions,
      };
      if (JSON.stringify(prevDefinition) !== JSON.stringify(updatedData)) {
        return updatedData;
      }
      return prevDefinition;
    });
  }, []);

  return (
    <Modal isOpen={isOpen} onClose={onClose} closeOnOverlayClick={true}>
      <ModalOverlay />
      <ModalContent className={styles.customModal} style={{ maxHeight: '80%' }}>
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
            inputDefinition={updatedInputDefinition}
            onChangeData={handleChangeData}
          />
        </Grid>
        <Divider></Divider>
        <SettingForm
          inputDefinition={updatedInputDefinition}
          OnSettingsSubmit={onSettingsSubmit}
        />
        <Divider></Divider>
        <ModalCloseButton />
        <ModalBody className={styles.customModalBody}>
          <DefineInputForm
            requestId={requestId}
            inputDefinition={updatedInputDefinition}
            onCloseModal={onClose}
          />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
