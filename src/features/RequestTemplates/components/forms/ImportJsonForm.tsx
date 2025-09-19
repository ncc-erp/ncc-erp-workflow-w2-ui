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
            description: t('REQUEST_TEMPLATES_PAGE.MESSAGES.IMPORT_ERROR'),
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
        description: t('REQUEST_TEMPLATES_PAGE.MESSAGES.INVALID_JSON_FORMAT'),
        status: 'error',
      });
      return;
    }
    try {
      toast({
        description: t('REQUEST_TEMPLATES_PAGE.MESSAGES.IMPORT_SUCCESS'),
        status: 'success',
      });
      onCloseModal();
      onChangeData(jsonObject);
    } catch (error) {
      console.log(error);
      toast({
        description: t('REQUEST_TEMPLATES_PAGE.MESSAGES.IMPORT_ERROR'),
        status: 'error',
      });
    }
  };

  return (
    <Box padding="20px">
      <ModalHeader fontSize="xl" paddingLeft="0px">
        {t('REQUEST_TEMPLATES_PAGE.IMPORT_WORKFLOW.TITLE')}
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
          {t('REQUEST_TEMPLATES_PAGE.IMPORT_WORKFLOW.IMPORT_DATA_LABEL')}
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
          {importedData
            ? importedData
            : t('REQUEST_TEMPLATES_PAGE.IMPORT_WORKFLOW.NO_DATA_IMPORTED')}
        </Box>
      </Box>

      <Button mt="14px" size="full" colorScheme="green" onClick={onSubmit}>
        {t('REQUEST_TEMPLATES_PAGE.IMPORT_BUTTON')}
      </Button>
    </Box>
  );
};

export default ImportJsonForm;
