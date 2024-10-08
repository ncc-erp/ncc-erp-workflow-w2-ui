import { Button } from '@chakra-ui/react';
import React, { useMemo, useState } from 'react';
import { ImportJsonModal } from './modals/ImportJsonModal';
import { useFieldArray, useForm } from 'react-hook-form';
import { InputDefinition } from 'models/request';

interface FormParams {
  items: PropertyDefinition[];
}
interface ExportImportJsonProps {
  requestId: string;
  inputDefinition?: InputDefinition;
  onClose: () => void;
  workflowName: string;
}
const ExportImportJson: React.FC<ExportImportJsonProps> = ({
  requestId,
  inputDefinition,
  onClose,
  workflowName,
}) => {
  const [isImportJsonModalOpen, setIsImportJsonModalOpen] =
    useState<boolean>(false);

  const { control } = useForm<FormParams>({
    criteriaMode: 'all',
    defaultValues: {
      items: inputDefinition?.propertyDefinitions || [
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
      settings: {
        color: inputDefinition?.settings?.color ?? '#aabbcc',
      },
      propertyDefinitions: fields,
    };
  }, [fields, inputDefinition?.settings?.color]);

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

  return (
    <div>
      <ImportJsonModal
        id={inputDefinition?.id}
        workflowDefinitionId={requestId}
        isOpen={isImportJsonModalOpen}
        onClose={onClose}
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
