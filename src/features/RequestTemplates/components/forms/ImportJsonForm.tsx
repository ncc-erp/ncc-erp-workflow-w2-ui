import {
  Box,
  Button,
  InputGroup,
  InputLeftElement,
  ModalHeader,
  Text,
} from '@chakra-ui/react';
import { toast } from 'common/components/StandaloneToast';
import { IJsonObject } from 'models/request';
import { useState, ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
interface ImportJsonFormProps {
  onCloseModal: () => void;
  id: string | undefined;
  onChangeData: (jsonObject: IJsonObject) => void;
  isPublishWfStatus: boolean;
}

const ImportJsonForm = ({
  onCloseModal,
  onChangeData,
  isPublishWfStatus,
}: ImportJsonFormProps) => {
  const { t } = useTranslation();
  const [importedData, setImportedData] = useState<string>('');

  const handleImport = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const fileReader = new FileReader();
    fileReader.onload = (e) => {
      if (e.target) {
        const content = e.target.result as string;
        try {
          const jsonData = JSON.parse(content);
          jsonData.defineJson.isPublished = isPublishWfStatus;
          setImportedData(JSON.stringify(jsonData, null, 2));
        } catch (error) {
          setImportedData('');
          toast({
            description: t('requestTemplates.messages.importError'),
            status: 'error',
          });
        }
      }
    };
    fileReader.readAsText(file);
  };

  const onSubmit = async () => {
    const defaultKeys = ['settings', 'defineJson', 'propertyDefinitions'];
    const jsonObject = JSON.parse(importedData);
    const keysOfData = Object.keys(jsonObject);

    const isInvalidFormat = keysOfData.some(
      (key, index) => key !== defaultKeys[index]
    );

    if (isInvalidFormat) {
      toast({
        description: t('requestTemplates.messages.invalidJsonFormat'),
        status: 'error',
      });
      return;
    }
    try {
      toast({
        description: t('requestTemplates.messages.importSuccess'),
        status: 'success',
      });
      onCloseModal();
      onChangeData(jsonObject);
    } catch (error) {
      console.log(error);
      toast({
        description: t('requestTemplates.messages.importError'),
        status: 'error',
      });
    }
  };

  return (
    <Box padding="20px">
      <ModalHeader fontSize="xl" paddingLeft="0px">
        {t('requestTemplates.modals.importWorkflow')}
      </ModalHeader>
      <InputGroup>
        <InputLeftElement pointerEvents="none" />
        <input
          type="file"
          accept=".json"
          onChange={handleImport}
          style={{
            border: '1px solid #E2E8F0',
            borderRadius: '0.375rem',
            padding: '0.5rem',
            width: '100%',
          }}
        />
      </InputGroup>
      <Box marginTop="20px">
        <Text fontSize="lg" fontWeight="bold">
          {t('requestTemplates.import.dataLabel')}
        </Text>
        <Box
          as="pre"
          whiteSpace="pre-wrap"
          wordBreak="break-word"
          backgroundColor="#F7FAFC"
          padding="10px"
          borderRadius="md"
          _dark={{
            backgroundColor: 'stone.900',
          }}
        >
          {importedData ? importedData : t('requestTemplates.import.noData')}
        </Box>
      </Box>

      <Button mt="14px" size="full" colorScheme="green" onClick={onSubmit}>
        {t('requestTemplates.buttons.import')}
      </Button>
    </Box>
  );
};

export default ImportJsonForm;
