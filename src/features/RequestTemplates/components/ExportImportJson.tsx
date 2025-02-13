import {
  Button,
  Flex,
  IconButton,
  SpaceProps,
  ThemingProps,
  TypographyProps,
} from '@chakra-ui/react';
import React, { useEffect, useMemo, useState } from 'react';
import { ImportJsonModal } from './modals/ImportJsonModal';
import { useFieldArray, useForm } from 'react-hook-form';
import { IJsonObject, InputDefinition } from 'models/request';
import { BiExport } from 'react-icons/bi';
import { TbFileImport } from 'react-icons/tb';

interface FormParams {
  items: PropertyDefinition[];
}

export enum EButtonType {
  EXPORT = 'export',
  IMPORT = 'import',
}
interface ExportImportJsonProps {
  inputDefinition?: InputDefinition;
  workflowName?: string;
  buttonStyleObj?: {
    [key in EButtonType]?: TypographyProps & ThemingProps & SpaceProps;
  };
  hiddenButton?: Array<EButtonType>;
  onChangeData: (jsonObject: IJsonObject) => void;
  isPublishWfStatus?: boolean;
}
const ExportImportJson: React.FC<ExportImportJsonProps> = ({
  inputDefinition,
  workflowName,
  buttonStyleObj,
  hiddenButton,
  onChangeData,
  isPublishWfStatus = false,
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
      settings: inputDefinition?.settings ?? null,
      defineJson:
        inputDefinition?.defineJson &&
        typeof inputDefinition?.defineJson === 'string'
          ? JSON.parse(inputDefinition.defineJson)
          : inputDefinition?.defineJson,
      propertyDefinitions: fields,
    };
  }, [fields, inputDefinition?.defineJson, inputDefinition?.settings]);

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
    link.download = `${workflowName ?? 'workflow'}.json`;
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
    <Flex gap="4px">
      <ImportJsonModal
        id={inputDefinition?.id}
        isOpen={isImportJsonModalOpen}
        onClose={onCloseModal}
        onchangeData={onChangeData}
        isPublishWfStatus={isPublishWfStatus}
      />
      {!hiddenButton?.includes(EButtonType.EXPORT) && (
        <>
          <Button
            onClick={handleExport}
            colorScheme="red"
            {...buttonStyleObj?.export}
            size={['xs', 'md']}
            display={['none', 'flex']}
          >
            Export
          </Button>
          <IconButton
            onClick={handleExport}
            aria-label="Export"
            variant="ghost"
            size="sm"
            icon={<BiExport size={18} />}
            display={['flex', 'none']}
          />
        </>
      )}
      {!hiddenButton?.includes(EButtonType.IMPORT) && (
        <>
          <Button
            onClick={onOpenImportJsonModal}
            variant={'outline'}
            {...buttonStyleObj?.import}
            leftIcon={<TbFileImport />}
            border={'1px solid #344054'}
            fontWeight={'600'}
            _hover={{
              background: 'stone.300',
              _dark: {
                background: 'stone.800',
              },
            }}
            size={['xs', 'md']}
            display={['none', 'flex']}
          >
            Import
          </Button>
          <IconButton
            onClick={onOpenImportJsonModal}
            aria-label="Import"
            variant="ghost"
            size="sm"
            icon={<TbFileImport size={18} />}
            display={['flex', 'none']}
          />
        </>
      )}
    </Flex>
  );
};

export default ExportImportJson;
