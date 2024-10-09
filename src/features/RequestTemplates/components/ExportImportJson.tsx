import { Button } from '@chakra-ui/react';
import React, { useEffect, useMemo, useState } from 'react';
import { ImportJsonModal } from './modals/ImportJsonModal';
import { useFieldArray, useForm } from 'react-hook-form';
import { IJsonObject, InputDefinition } from 'models/request';

interface FormParams {
  items: PropertyDefinition[];
}
interface ExportImportJsonProps {
  requestId: string;
  inputDefinition?: InputDefinition;
  workflowName: string;
  onChangeData: (jsonObject: IJsonObject) => void;
}
const ExportImportJson: React.FC<ExportImportJsonProps> = ({
  requestId,
  inputDefinition,
  workflowName,
  onChangeData,
}) => {
  const [isImportJsonModalOpen, setIsImportJsonModalOpen] =
    useState<boolean>(false);
  const [inputDefinitionUpdated, setInputDefinitionUpdated] =
    useState(inputDefinition);

  const { control, reset } = useForm<FormParams>({
    criteriaMode: 'all',
    defaultValues: {
      items: inputDefinitionUpdated?.propertyDefinitions || [
        { name: '', type: 'Text', isRequired: false },
      ],
    },
  });
  const { fields } = useFieldArray({
    control,
    name: 'items',
  });
  const exportData = useMemo(() => {
    return {
      settings: inputDefinition?.settings,
      propertyDefinitions: fields,
    };
  }, [fields, inputDefinition?.settings]);

  useEffect(() => {
    if (inputDefinition) {
      setInputDefinitionUpdated(inputDefinition);
    }
    reset({
      items: inputDefinition?.propertyDefinitions || [
        { name: '', type: 'Text', isRequired: false },
      ],
    });
  }, [inputDefinition, reset]);

  const handleExport = () => {
    const jsonString = JSON.stringify(exportData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${workflowName}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  const onOpenImportJsonModal = () => {
    setIsImportJsonModalOpen(true);
  };
  const onCloseModal = () => {
    setIsImportJsonModalOpen(false);
  };

  return (
    <div>
      <ImportJsonModal
        id={inputDefinition?.id}
        workflowDefinitionId={requestId}
        isOpen={isImportJsonModalOpen}
        onClose={onCloseModal}
        onchangeData={onChangeData}
      />
      <Button onClick={handleExport} colorScheme="red" m={2}>
        Export
      </Button>
      <Button onClick={onOpenImportJsonModal} colorScheme="green" m={2}>
        Import
      </Button>
    </div>
  );
};

export default ExportImportJson;
