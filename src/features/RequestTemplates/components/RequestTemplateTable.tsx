/* eslint-disable @typescript-eslint/no-unused-vars */
import { Box, Button, Center, IconButton } from '@chakra-ui/react';
import { ColumnDef, createColumnHelper } from '@tanstack/react-table';
import { EmptyWrapper } from 'common/components/EmptyWrapper';
import { Table } from 'common/components/Table/Table';
import { WorkflowModal } from 'common/components/WorkflowModal';
import { useIsAdmin } from 'hooks/useIsAdmin';
import {
  IJsonObject,
  InputDefinition,
  RequestTemplate,
  RequestTemplateResult,
} from 'models/request';
import { useCallback, useMemo, useState } from 'react';
import { RiAddFill } from 'react-icons/ri';
import { useRecoilValue } from 'recoil';
import { appConfigState } from 'stores/appConfig';
import { RowAction } from './RowAction';
import { CreateTemplateModal } from './modals/CreateTemplateModal';
import { RequestTemplateModal } from './modals/RequestTemplateModal';
import {
  useDeleteWorkflowDefinition,
  useUpdateWorkflowPublishStatus,
} from 'api/apiHooks/requestHooks';
import { ModalConfirm } from 'common/components/ModalConfirm';
import { DefineTemplateInputModal } from './modals/DefineTemplateInputModal';
import { toast } from 'common/components/StandaloneToast';
import ExportImportJson, { EButtonType } from './ExportImportJson';
import { useUserPermissions } from 'hooks/useUserPermissions';
import { Permissions } from 'common/constants';
import { BiSolidPencil } from 'react-icons/bi';
import { useMediaQuery } from 'hooks/useMediaQuery';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();
  const isLargeScreen = useMediaQuery('(min-width: 1024px)');
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
  const { renderIfAllowed, hasPermission } = useUserPermissions();

  const { sideBarWidth } = useRecoilValue(appConfigState);
  const columnHelper = createColumnHelper<RequestTemplate>();
  const deleteWorkflowDefinitionMutation = useDeleteWorkflowDefinition();
  const updatePublishStatus = useUpdateWorkflowPublishStatus();
  const canViewDesignerColumn = hasPermission([
    Permissions.DEFINE_INPUT,
    Permissions.EDIT_WORKFLOW_DEFINITION,
    Permissions.UPDATE_WORKFLOW_DEFINITION_STATUS,
    Permissions.DELETE_WORKFLOW_DEFINITION,
  ]);
  const [workflowCreateData, setWorkflowCreateData] =
    useState<IJsonObject | null>(null);
  const [isPublishWfStatus, setisPublishWfStatus] = useState<boolean>(false);

  // stable callbacks to satisfy react-hooks/exhaustive-deps
  const onConfirmDeleteWorkflow = useCallback(
    (workflowId: string) => () => {
      setIsModalConfirmOpen(true);
      setRequestId(workflowId);
      setModalTitle(t('requestTemplates.buttons.delete'));
      setModalDescription(
        t('requestTemplates.messages.deleteWorkflowConfirmation')
      );
    },
    [t]
  );

  const onDefineInputWorkflow =
    (
      workflowId: string,
      inputDefinition: InputDefinition,
      name: string,
      isPublish: boolean
    ) =>
    () => {
      setIsModalDefineInputOpen(true);
      setRequestId(workflowId);
      setModalInputDefinition(inputDefinition);
      setModalTitle(name);
      setisPublishWfStatus(isPublish);
    };

  const onAction = useCallback(
    (
      requestIdArg: string,
      displayNameArg: string,
      workflowArg: string,
      inputDefinitionArg: InputDefinition
    ) =>
      () => {
        if (
          !inputDefinitionArg ||
          !inputDefinitionArg.propertyDefinitions?.length ||
          !inputDefinitionArg?.propertyDefinitions?.[0]?.name
        ) {
          toast({
            title: t('requestTemplates.messages.defineInputWarning'),
            status: 'warning',
          });
          return;
        }
        setIsModalOpen(true);
        setRequestId(requestIdArg);
        setModalTitle(displayNameArg);
        setModalWorkflow(workflowArg);
        setModalInputDefinition(inputDefinitionArg);
      },
    [t]
  );

  const onDeleteWorkflow = async () => {
    await deleteWorkflowDefinitionMutation.mutateAsync(requestId);
    setIsModalConfirmOpen(false);
    refetch();
  };

  const onActionViewWorkflow = (workflowId: string) => () => {
    setRequestWorkflow(workflowId);
    setOpenWorkflow(true);
  };

  const handleTogglePublish = useCallback(
    async (workflowId: string, isPublished: boolean) => {
      const payload = {
        workflowId,
        isPublished: !isPublished,
      };
      await updatePublishStatus.mutateAsync(payload);
      refetch();
    },
    [updatePublishStatus, refetch]
  );

  const myRequestColumns = useMemo(() => {
    const displayColumn = columnHelper.accessor('displayName', {
      id: 'displayName',
      header: isAdmin
        ? t('requestTemplates.columns.displayName')
        : t('requestTemplates.columns.requestTemplate'),
      enableSorting: false,
      cell: (info) => info.getValue(),
    });

    const actionColumn = columnHelper.display({
      id: 'actions',
      enableSorting: false,
      header: () => (
        <Center w="full">{t('requestTemplates.columns.actions')}</Center>
      ),
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
              backgroundColor="actionBtnBg"
              color="paginationText"
            />
          </Center>
        );
      },
    });

    const editColumn = [
      ...(canViewDesignerColumn
        ? [
            columnHelper.display({
              id: 'designer',
              enableSorting: false,
              header: () => <Center w="full">Edit</Center>,
              cell: (info) => {
                const {
                  definitionId,
                  inputDefinition,
                  name,
                  displayName,
                  defineJson,
                  isPublished,
                } = info.row.original;
                return (
                  <Center>
                    <RowAction
                      onDelete={onConfirmDeleteWorkflow(definitionId)}
                      onDefineInput={onDefineInputWorkflow(
                        definitionId,
                        {
                          ...inputDefinition,
                          nameRequest: name,
                          requestDisplayName: displayName,
                          defineJson,
                        },
                        name,
                        isPublished
                      )}
                      onViewWorkflow={onActionViewWorkflow(definitionId)}
                      onTogglePublish={() =>
                        handleTogglePublish(definitionId, isPublished)
                      }
                      isPublished={isPublished}
                    />
                  </Center>
                );
              },
            }),
          ]
        : []),
    ];

    const editorColumn = [
      columnHelper.accessor('name', {
        id: 'name',
        header: t('requestTemplates.columns.name'),
        enableSorting: false,
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('version', {
        id: 'version',
        header: () => (
          <Center w="full">{t('requestTemplates.columns.version')}</Center>
        ),
        enableSorting: false,
        cell: (info) => <Center w="full">{info.getValue()}</Center>,
      }),
      columnHelper.accessor('isPublished', {
        id: 'isPublished',
        header: () => <Center w="full">Published</Center>,
        enableSorting: false,
        cell: (info) => (
          <Center w="full">
            {info.getValue().toString() === 'true' ? 'Yes' : 'No'}
          </Center>
        ),
      }),
    ];

    const result = [
      displayColumn,
      ...//isAdmin ?
      editorColumn,
      //: []
      ...(hasPermission(Permissions.CREATE_WORKFLOW_INSTANCE)
        ? [actionColumn]
        : []),
      ...editColumn,
    ] as ColumnDef<RequestTemplate>[];

    return result;
  }, [
    columnHelper,
    isAdmin,
    handleTogglePublish,
    hasPermission,
    canViewDesignerColumn,
    onAction,
    onConfirmDeleteWorkflow,
    t,
  ]);

  const onCloseModal = () => {
    setWorkflowCreateData(null);
    setIsModalOpen(false);
    setIsModalConfirmOpen(false);
    setIsCreateModalOpen(false);
    setIsModalDefineInputOpen(false);
  };

  const onOpenCreateModal = () => {
    setIsCreateModalOpen(true);
  };

  const handleImportJson = useCallback((jsonObject: IJsonObject) => {
    setWorkflowCreateData(jsonObject);
    onOpenCreateModal();
  }, []);

  return (
    <Box>
      {isLargeScreen && (
        <Box display="flex" mb={2} columnGap="1rem">
          {renderIfAllowed(
            Permissions.CREATE_WORKFLOW_DEFINITION,
            <Button
              leftIcon={<BiSolidPencil size={20} />}
              isDisabled={isLoading}
              onClick={onOpenCreateModal}
              variant="primary"
            >
              {t('requestTemplates.buttons.create')}
            </Button>
          )}

          {renderIfAllowed(
            Permissions.IMPORT_WORKFLOW_DEFINITION,
            <ExportImportJson
              buttonStyleObj={{
                import: {
                  m: '0',
                  fontSize: '14px',
                  fontWeight: '500',
                },
              }}
              hiddenButton={[EButtonType.EXPORT]}
              inputDefinition={undefined}
              onChangeData={handleImportJson}
            />
          )}
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
          py="10px"
          paddingBottom={10}
          data-testid="list-request-templates-view"
        >
          <Table
            columns={myRequestColumns}
            data={items}
            isLoading={isLoading}
            onRowHover={true}
            isHighlight={true}
            dataTestId="request-template-item"
          />
        </Box>
      </EmptyWrapper>

      <CreateTemplateModal
        isOpen={isCreateModalOpen}
        onClose={onCloseModal}
        workflowCreateData={workflowCreateData}
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
        isPublishWfStatus={isPublishWfStatus}
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
