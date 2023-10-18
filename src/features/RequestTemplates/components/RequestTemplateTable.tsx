import {
  Box,
  Center,
  HStack,
  Spacer,
  Spinner,
  IconButton,
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
import { RequestTemplateModal } from './RequestTemplateModal';

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
  const [requestId, setRequestId] = useState<string>('');
  const [modalTitle, setModalTitle] = useState<string>('');
  const [modalWorkflow, setModalWorkflow] = useState<string>('');
  const [inputDefinition, setModalInputDefinition] =
    useState<InputDefinition>();
  const [sorting, setSorting] = useState<SortingState>(initialSorting);

  const { sideBarWidth } = useRecoilValue(appConfigState);
  const columnHelper = createColumnHelper<RequestTemplate>();

  const currentPage = useMemo(() => {
    const { skipCount, maxResultCount } = filter;

    return (maxResultCount + skipCount) / maxResultCount;
  }, [filter]);

  const myRequestColumns = useMemo(
    () =>
      [
        columnHelper.accessor('displayName', {
          id: 'displayName',
          header: 'Request Template',
          enableSorting: false,
          cell: (info) => info.getValue(),
        }),
        columnHelper.display({
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
        }),
      ] as ColumnDef<RequestTemplate>[],
    [columnHelper]
  );

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

  return (
    <Box>
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

      <RequestTemplateModal
        isOpen={isModalOpen}
        onClose={onCloseModal}
        requestId={requestId}
        displayName={modalTitle}
        workflow={modalWorkflow}
        inputDefinition={inputDefinition}
      />
    </Box>
  );
};
