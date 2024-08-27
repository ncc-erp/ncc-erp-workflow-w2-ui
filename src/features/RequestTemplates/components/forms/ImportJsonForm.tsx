import {
  Box,
  Button,
  InputGroup,
  InputLeftElement,
  ModalHeader,
  Text,
} from '@chakra-ui/react';
import {
  useRequestTemplates,
  useUpdateWorkflowInput,
} from 'api/apiHooks/requestHooks';
import { toast } from 'common/components/StandaloneToast';
import { useState, ChangeEvent } from 'react';
import { GUID_ID_DEFAULT_VALUE } from 'common/constants';
import { IUpdateInputFormParams } from 'models/request';

interface ImportJsonFormProps {
  onCloseModal: () => void;
}

const ImportJsonForm = ({ onCloseModal }: ImportJsonFormProps) => {
  const [importedData, setImportedData] = useState<string>('');
  const { mutateAsync: updateMutate } = useUpdateWorkflowInput();
  const { refetch } = useRequestTemplates();

  const handleImport = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const fileReader = new FileReader();
    fileReader.onload = (e) => {
      if (e.target) {
        const content = e.target.result as string;
        try {
          const jsonData = JSON.parse(content);
          setImportedData(JSON.stringify(jsonData, null, 2));
        } catch (error) {
          setImportedData('');
          toast({
            description: 'Can not parse JSON!',
            status: 'error',
          });
        }
      }
    };
    fileReader.readAsText(file);
  };

  const onSubmit = async () => {
    const defaultKeys = ['id', 'workflowDefinitionId', 'propertyDefinitions'];
    const jsonObject = JSON.parse(importedData);
    const keysOfData = Object.keys(jsonObject);

    const isNotValidFormat = keysOfData.some(
      (key, index) => key !== defaultKeys[index]
    );

    if (isNotValidFormat) {
      toast({
        description: 'Invalid JSON format!',
        status: 'error',
      });
      return;
    }
    if (jsonObject) {
      try {
        const payload: IUpdateInputFormParams = {
          id: jsonObject?.id || GUID_ID_DEFAULT_VALUE,
          workflowDefinitionId: jsonObject?.workflowDefinitionId,
          propertyDefinitions: jsonObject?.propertyDefinitions,
        };

        await updateMutate(payload);
        refetch();
        toast({
          description: 'Import workflow input data successfully!',
          status: 'success',
        });
        onCloseModal();
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <Box padding="20px">
      <ModalHeader fontSize="xl">Import Workflow Input</ModalHeader>
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
          Import Data:
        </Text>
        <Box
          as="pre"
          whiteSpace="pre-wrap"
          wordBreak="break-word"
          backgroundColor="#F7FAFC"
          padding="10px"
          borderRadius="md"
        >
          {importedData ? importedData : 'No data !'}
        </Box>
      </Box>

      <Button
        mt="14px"
        h="50px"
        w="100%"
        colorScheme="green"
        onClick={onSubmit}
      >
        Import
      </Button>
    </Box>
  );
};

export default ImportJsonForm;
