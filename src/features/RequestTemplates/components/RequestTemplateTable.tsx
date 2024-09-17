/* eslint-disable @typescript-eslint/no-unused-vars */
import { Box, Button, Center, IconButton } from '@chakra-ui/react';
import { ColumnDef, createColumnHelper } from '@tanstack/react-table';
import { EmptyWrapper } from 'common/components/EmptyWrapper';
import { Table } from 'common/components/Table/Table';
import { WorkflowModal } from 'common/components/WorkflowModal';
import { useIsAdmin } from 'hooks/useIsAdmin';
import {
  InputDefinition,
  RequestTemplate,
  RequestTemplateResult,
} from 'models/request';
import { useMemo, useState } from 'react';
import { RiAddFill } from 'react-icons/ri';
import { useRecoilValue } from 'recoil';
import { appConfigState } from 'stores/appConfig';
import { RowAction } from './RowAction';
import { CreateTemplateModal } from './modals/CreateTemplateModal';
import { RequestTemplateModal } from './modals/RequestTemplateModal';
import { useDeleteWorkflowDefinition } from 'api/apiHooks/requestHooks';
import { ModalConfirm } from 'common/components/ModalConfirm';
import { DefineTemplateInputModal } from './modals/DefineTemplateInputModal';

interface RequestTemplateTableProps {
  data: RequestTemplateResult;
  isLoading: boolean;
  refetch: () => void;
}

export const RequestTemplateTable = ({
  data: { items },
  isLoading,
  refetch,
}: RequestTemplateTableProps) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);

  const [requestId, setRequestId] = useState<string>('');
  const [modalTitle, setModalTitle] = useState<string>('');
  const [modalDescription, setModalDescription] = useState<string>('');
  const [modalWorkflow, setModalWorkflow] = useState<string>('');
  const [inputDefinition, setModalInputDefinition] =
    useState<InputDefinition>();
  const [requestWorkflow, setRequestWorkflow] = useState<string>('');
  const [isOpenWorkflow, setOpenWorkflow] = useState(false);
  const [isModalDefineInputOpen, setIsModalDefineInputOpen] = useState(false);
  const [isModalConfirmOpen, setIsModalConfirmOpen] = useState(false);
  const isAdmin = useIsAdmin();

  const { sideBarWidth } = useRecoilValue(appConfigState);
  const columnHelper = createColumnHelper<RequestTemplate>();
  const deleteWorkflowDefinitionMutation = useDeleteWorkflowDefinition();
  const onConfirmDeleteWorkflow = (workflowId: string) => () => {
    setIsModalConfirmOpen(true);
    setRequestId(workflowId);
    setModalTitle('Delete workflow');
    setModalDescription('Do you want to delete workflow?');
  };

  const onDefineInputWorkflow =
    (workflowId: string, inputDefinition: InputDefinition, name: string) =>
    () => {
      setIsModalDefineInputOpen(true);
      setRequestId(workflowId);
      setModalInputDefinition(inputDefinition);
      setModalTitle(name);
    };

  const onDeleteWorkflow = async () => {
    await deleteWorkflowDefinitionMutation.mutateAsync(requestId);
    setIsModalConfirmOpen(false);
    refetch();
  };

  const onActionViewWorkflow = (workflowId: string) => () => {
    setRequestWorkflow(workflowId);
    setOpenWorkflow(true);
  };

  const myRequestColumns = useMemo(() => {
    const displayColumn = columnHelper.accessor('displayName', {
      id: 'displayName',
      header: isAdmin ? 'Display Name' : 'Request Template',
      enableSorting: false,
      cell: (info) => info.getValue(),
    });

    const actionColumn = columnHelper.display({
      id: 'actions',
      enableSorting: false,
      header: () => <Center w="full">Actions</Center>,
      cell: (info) => {
        const { definitionId, displayName, name, inputDefinition } =
          info.row.original;
        return (
          <Center>
            <IconButton
              onClick={onAction(
                definitionId,
                displayName,
                name,
                inputDefinition
              )}
              aria-label="Popup modal"
              icon={<RiAddFill />}
            />
          </Center>
        );
      },
    });

    const editorColumn = [
      columnHelper.accessor('name', {
        id: 'name',
        header: 'Name',
        enableSorting: false,
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('version', {
        id: 'version',
        header: 'Version',
        enableSorting: false,
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('isPublished', {
        id: 'isPublished',
        header: 'Published',
        enableSorting: false,
        cell: (info) => info.getValue().toString(),
      }),
      columnHelper.display({
        id: 'designer',
        enableSorting: false,
        header: () => <Center w="full">Designer</Center>,
        cell: (info) => {
          const { definitionId, inputDefinition, name } = info.row.original;
          return (
            <Center>
              <RowAction
                onDelete={onConfirmDeleteWorkflow(definitionId)}
                onDefineInput={onDefineInputWorkflow(
                  definitionId,
                  { ...inputDefinition, nameRequest: name },
                  name
                )}
                onViewWorkflow={onActionViewWorkflow(definitionId)}
              />
            </Center>
          );
        },
      }),
    ];

    const result = [
      displayColumn,
      ...(isAdmin ? editorColumn : []),
      actionColumn,
    ] as ColumnDef<RequestTemplate>[];

    return result;
  }, [columnHelper, isAdmin]);

  const onAction =
    (
      requestId: string,
      displayName: string,
      workflow: string,
      inputDefinition: InputDefinition
    ) =>
    () => {
      setIsModalOpen(true);
      setRequestId(requestId);
      setModalTitle(displayName);
      setModalWorkflow(workflow);
      setModalInputDefinition(inputDefinition);
    };

  const onCloseModal = () => {
    setIsModalOpen(false);
    setIsModalConfirmOpen(false);
    setIsCreateModalOpen(false);
    setIsModalDefineInputOpen(false);
  };

  const onOpenCreateModal = () => {
    setIsCreateModalOpen(true);
  };

  return (
    <Box>
      {isAdmin && (
        <Box px={6}>
          <Button
            isDisabled={isLoading}
            size="md"
            fontSize="sm"
            fontWeight="medium"
            colorScheme="green"
            onClick={onOpenCreateModal}
          >
            Create
          </Button>
        </Box>
      )}

      <EmptyWrapper
        isEmpty={!items.length && !isLoading}
        h="200px"
        fontSize="xs"
        message={'No request found!'}
        boxSizing="border-box"
      >
        <Box
          w={{
            base: `calc(100vw - ${sideBarWidth}px)`,
            lg: `calc(100vw - ${sideBarWidth}px)`,
            xs: 'max-content',
          }}
          p={{ base: '10px 24px 0px' }}
          paddingBottom={10}
        >
          <Table
            columns={myRequestColumns}
            data={items}
            isLoading={isLoading}
            onRowHover={true}
            isHighlight={true}
          />
        </Box>
      </EmptyWrapper>

      <CreateTemplateModal
        isOpen={isCreateModalOpen}
        onClose={onCloseModal}
        OnCreateSuccess={(workflowId) => {
          setRequestWorkflow(workflowId);
          setOpenWorkflow(true);
        }}
      />

      <DefineTemplateInputModal
        requestId={requestId}
        workflowName={modalTitle}
        inputDefinition={inputDefinition}
        isOpen={isModalDefineInputOpen}
        onClose={onCloseModal}
      />

      <RequestTemplateModal
        isOpen={isModalOpen}
        onClose={onCloseModal}
        requestId={requestId}
        displayName={modalTitle}
        workflow={modalWorkflow}
        inputDefinition={inputDefinition}
      />

      <ModalConfirm
        isOpen={isModalConfirmOpen}
        onClose={onCloseModal}
        onConfirm={onDeleteWorkflow}
        title={modalTitle}
        description={modalDescription}
      />

      {requestWorkflow && (
        <WorkflowModal
          isOpen={isOpenWorkflow}
          onClose={() => {
            setOpenWorkflow(false);
            refetch();
          }}
          workflow={`CompOnly/Designer?id=${requestWorkflow}`}
        />
      )}
    </Box>
  );
};
