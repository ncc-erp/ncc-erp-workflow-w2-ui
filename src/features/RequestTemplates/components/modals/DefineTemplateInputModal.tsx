import {
  Box,
  Divider,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';
import { IJsonObject, InputDefinition, Settings } from 'models/request';
import DefineInputForm from '../forms/DefineInputForm';
import { SettingForm } from '../forms/SettingForm';
import { useCallback, useEffect, useState } from 'react';
import ExportImportJson from '../ExportImportJson';
import { useTranslation } from 'react-i18next';
interface DefineTemplateInputModalProps {
  isOpen: boolean;
  requestId: string;
  onClose: () => void;
  inputDefinition?: InputDefinition;
  workflowName: string;
  isPublishWfStatus: boolean;
}

export const DefineTemplateInputModal = ({
  isOpen,
  onClose,
  inputDefinition,
  requestId,
  workflowName,
  isPublishWfStatus,
}: DefineTemplateInputModalProps) => {
  const { t } = useTranslation();
  const [updatedInputDefinition, setUpdatedInputDefinition] = useState<
    InputDefinition | undefined
  >(inputDefinition);
  const [settings, setSettings] = useState<Settings>({
    color: '#aabbcc',
    titleTemplate: '',
    isSendKomuMessage: false,
  });
  const [isChangedBySubmitSettings, setIsChangedBySubmitSettings] =
    useState<boolean>(false);

  const onSubmitSettings = (
    color: string,
    title: string,
    isSendKomuMessage: boolean
  ) => {
    const settings: Settings = {
      color,
      titleTemplate: title,
      isSendKomuMessage,
    };
    setSettings(settings);
    setIsChangedBySubmitSettings(true);
  };

  useEffect(() => {
    if (!isOpen) {
      setIsChangedBySubmitSettings(false);
    }
  }, [isOpen]);

  useEffect(() => {
    setUpdatedInputDefinition(inputDefinition);
  }, [inputDefinition]);

  const handleChangeData = useCallback((jsonObject: IJsonObject) => {
    setUpdatedInputDefinition((prevDefinition: InputDefinition | undefined) => {
      if (!prevDefinition) return undefined;
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
    setSettings(jsonObject?.settings);
  }, []);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      closeOnOverlayClick={false}
      size={['full', '2xl', '2xl', '4xl']}
      scrollBehavior="inside"
      motionPreset="slideInBottom"
    >
      <ModalOverlay />
      <ModalContent>
        <Flex
          alignItems="center"
          gap={['4px', '12px']}
          py={['16px', '24px']}
          px={['16px', '24px']}
        >
          <Box>
            <ModalHeader fontSize={['sm', 'md']} p={0}>
              {t('requestTemplates.modals.defineWorkflowInput')}
            </ModalHeader>
          </Box>
          <Box ml="auto">
            <ExportImportJson
              workflowName={workflowName}
              inputDefinition={updatedInputDefinition}
              onChangeData={handleChangeData}
              isPublishWfStatus={isPublishWfStatus}
            />
          </Box>
          <Box>
            <ModalCloseButton position="static" />
          </Box>
        </Flex>
        <Divider />
        <ModalBody px={['16px', '24px']}>
          <SettingForm
            inputDefinition={updatedInputDefinition}
            onSubmitSettings={onSubmitSettings}
          />
          <Divider mb="20px" />
          <DefineInputForm
            requestId={requestId}
            inputDefinition={updatedInputDefinition}
            onCloseModal={onClose}
            settingsToSet={settings}
            isChangedBySubmitSettings={isChangedBySubmitSettings}
          />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
