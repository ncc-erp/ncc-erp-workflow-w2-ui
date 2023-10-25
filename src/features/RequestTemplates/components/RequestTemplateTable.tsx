import {
  Box,
  Center,
  HStack,
  Spacer,
  Spinner,
  IconButton,
  Button,
} from '@chakra-ui/react';
import {
  ColumnDef,
  SortingState,
  createColumnHelper,
} from '@tanstack/react-table';
import { EmptyWrapper } from 'common/components/EmptyWrapper';
import { Pagination } from 'common/components/Pagination';
import { PageSize } from 'common/components/Table/PageSize';
import { ShowingItemText } from 'common/components/Table/ShowingItemText';
import { Table } from 'common/components/Table/Table';
import { noOfRows } from 'common/constants';
import { RequestSortField, SortDirection } from 'common/enums';
import { RiAddFill } from 'react-icons/ri';
import {
  FilterRequestParams,
  InputDefinition,
  RequestTemplate,
  RequestTemplateResult,
} from 'models/request';
import { useEffect, useMemo, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { appConfigState } from 'stores/appConfig';
import { RequestTemplateModal } from './modals/RequestTemplateModal';
import { useIsAdmin } from 'hooks/useIsAdmin';
import { WorkflowModal } from 'common/components/WorkflowModal';
import { MdBrightnessLow } from 'react-icons/md';
import { CreateTemplateModal } from './modals/CreateTemplateModal';

const initialFilter: FilterRequestParams = {
  Status: '',
  WorkflowDefinitionId: '',
  sorting: [RequestSortField.createdAt, 'desc'].join(' '),
  skipCount: 0,
  maxResultCount: +noOfRows[0].value,
};

const initialSorting: SortingState = [
  {
    id: RequestSortField.createdAt,
    desc: true,
  },
];

interface RequestTemplateTableProps {
  data: RequestTemplateResult;
  isLoading: boolean;
}

export const RequestTemplateTable = ({
  data: { items, totalCount },
  isLoading,
}: RequestTemplateTableProps) => {
  const [filter, setFilter] = useState<FilterRequestParams>(initialFilter);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);

  const [requestId, setRequestId] = useState<string>('');
  const [modalTitle, setModalTitle] = useState<string>('');
  const [modalWorkflow, setModalWorkflow] = useState<string>('');
  const [inputDefinition, setModalInputDefinition] =
    useState<InputDefinition>();
  const [sorting, setSorting] = useState<SortingState>(initialSorting);

  const [requestWorkflow, setRequestWorkflow] = useState<string>('');
  const [isOpenWorkflow, setOpenWorkflow] = useState(false);
  const isAdmin = useIsAdmin();

  const { sideBarWidth } = useRecoilValue(appConfigState);
  const columnHelper = createColumnHelper<RequestTemplate>();

  const onActionViewWorkflow = (workflowId: string) => () => {
    setRequestWorkflow(workflowId);
    setOpenWorkflow(true);
  };

  const currentPage = useMemo(() => {
    const { skipCount, maxResultCount } = filter;

    return (maxResultCount + skipCount) / maxResultCount;
  }, [filter]);

  const myRequestColumns = useMemo(() => {
    const displayColumn = columnHelper.accessor('displayName', {
      id: 'displayName',
      header: 'Request Template',
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

    const editorColumn = columnHelper.display({
      id: 'designer',
      enableSorting: false,
      header: () => <Center w="full">Designer</Center>,
      cell: (info) => {
        const { definitionId } = info.row.original;
        return (
          <Center>
            <IconButton
              onClick={onActionViewWorkflow(definitionId)}
              aria-label="Popup modal"
              icon={<MdBrightnessLow />}
            />
          </Center>
        );
      },
    });

    const result = [
      displayColumn,
      ...(isAdmin ? [editorColumn] : []),
      actionColumn,
    ] as ColumnDef<RequestTemplate>[];

    return result;
  }, [columnHelper, isAdmin]);

  useEffect(() => {
    const { id, desc } = sorting?.[0] ?? {};
    const sort = `${id} ${desc ? SortDirection.desc : SortDirection.asc}`;

    setFilter((filter) => ({
      ...filter,
      sorting: sort,
      skipCount: 0,
    }));
  }, [sorting]);

  const onPageChange = (page: number) => {
    setFilter((filter) => ({
      ...filter,
      skipCount: filter.maxResultCount * (page - 1),
    }));
  };

  const onPageSizeChange = (pageSize: number) => {
    setFilter((filter) => ({
      ...filter,
      maxResultCount: pageSize,
      skipCount: 0,
    }));
  };

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
  };

  const onOpenCreateModal = () => {
    setIsCreateModalOpen(true);
  };

  const onCloseCreateModal = () => {
    setIsCreateModalOpen(false);
  };

  return (
    <Box>
      {isAdmin && (
        <Box px={6} mt={2}>
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

      {isLoading ? (
        <Center h="200px">
          <Spinner mx="auto" speed="0.65s" thickness="3px" size="xl" />
        </Center>
      ) : (
        <EmptyWrapper
          isEmpty={!items.length}
          h="200px"
          fontSize="xs"
          message={'No requests found!'}
        >
          <Box
            overflowX="auto"
            w={{ base: `calc(100vw - ${sideBarWidth}px)`, lg: 'auto' }}
            p="10px 24px 0px"
          >
            <Table
              columns={myRequestColumns}
              data={items}
              sorting={sorting}
              onSortingChange={setSorting}
            />
          </Box>
        </EmptyWrapper>
      )}

      <HStack
        p="20px 30px 20px 30px"
        justifyContent="space-between"
        flexWrap="wrap"
      >
        <HStack alignItems="center" spacing="6px" flexWrap="wrap">
          <PageSize noOfRows={noOfRows} onChange={onPageSizeChange} />
          <Spacer w="12px" />
          <ShowingItemText
            skipCount={filter.skipCount}
            maxResultCount={filter.maxResultCount}
            totalCount={totalCount}
          />
        </HStack>
        <Pagination
          total={totalCount}
          pageSize={filter.maxResultCount}
          current={currentPage}
          onChange={onPageChange}
          hideOnSinglePage
        />
      </HStack>

      <CreateTemplateModal
        isOpen={isCreateModalOpen}
        onClose={onCloseCreateModal}
      />

      <RequestTemplateModal
        isOpen={isModalOpen}
        onClose={onCloseModal}
        requestId={requestId}
        displayName={modalTitle}
        workflow={modalWorkflow}
        inputDefinition={inputDefinition}
      />

      {requestWorkflow && (
        <WorkflowModal
          isOpen={isOpenWorkflow}
          onClose={() => setOpenWorkflow(false)}
          workflow={`CompOnly/Designer?id=${requestWorkflow}`}
        />
      )}
    </Box>
  );
};
