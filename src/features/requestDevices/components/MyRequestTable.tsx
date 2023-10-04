import {
  ColumnDef,
  SortingState,
  createColumnHelper,
} from '@tanstack/react-table';
import { useQueryClient } from '@tanstack/react-query';
import {
  Box,
  Button,
  Center,
  HStack,
  Spacer,
  Spinner,
  Wrap,
  WrapItem,
} from '@chakra-ui/react';
import {
  useCancelRequest,
  useDeleteRequest,
  useMyRequests,
  useRequestTemplates,
} from 'api/apiHooks/requestHooks';
import { SelectField } from 'common/components/SelectField';
import { Table } from 'common/components/Table/Table';
import { RequestSortField, RequestStatus, SortDirection } from 'common/enums';
import { FilterRequestParams, Request } from 'models/request';
import { useEffect, useMemo, useState } from 'react';
import { Pagination } from 'common/components/Pagination';
import { QueryKeys, noOfRows } from 'common/constants';
import { PageSize } from 'common/components/Table/PageSize';
import { ShowingItemText } from 'common/components/Table/ShowingItemText';
import { RowAction } from 'features/requestDevices/components/RowAction';
import { EmptyWrapper } from 'common/components/EmptyWrapper';
import { useRecoilValue } from 'recoil';
import { appConfigState } from 'stores/appConfig';
import { toast } from 'common/components/StandaloneToast';
import { ModalConfirm } from 'common/components/ModalConfirm';
import { useCurrentUser } from 'hooks/useCurrentUser';
import { formatDate } from 'utils';
import { useIsAdmin } from 'hooks/useIsAdmin';
import { RequestDetailModal } from './DetailModal';

const initialSorting: SortingState = [
  {
    id: RequestSortField.createdAt,
    desc: true,
  },
];

export const MyRequestTable = () => {
  const currentUser = useCurrentUser();
  const initialFilter: FilterRequestParams = {
    Status: '',
    WorkflowDefinitionId: '',
    sorting: [RequestSortField.createdAt, 'desc'].join(' '),
    skipCount: 0,
    maxResultCount: +noOfRows[0].value,
    RequestUser: currentUser?.sub[0],
    StakeHolder: '',
  };
  const { sideBarWidth } = useRecoilValue(appConfigState);
  const [filter, setFilter] = useState<FilterRequestParams>(initialFilter);
  const [sorting, setSorting] = useState<SortingState>(initialSorting);
  const { data, isLoading } = useMyRequests(filter);
  const { data: requestTemplateData } = useRequestTemplates();
  const { items: requests = [], totalCount = 0 } = data ?? {};
  const { items: requestTemplates = [] } = requestTemplateData ?? {};
  const { skipCount, maxResultCount } = filter;
  const currentPage = (maxResultCount + skipCount) / maxResultCount;
  const columnHelper = createColumnHelper<Request>();
  const isAdmin = useIsAdmin();

  const queryClient = useQueryClient();
  const deleteRequestMutation = useDeleteRequest();
  const cancelRequestMutation = useCancelRequest();
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenDetails, setOpenDetails] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalDescription, setModalDescription] = useState('');
  const [actionType, setActionType] = useState('');
  const [requestId, setRequestId] = useState('');
  const [requestDetails, setRequestDetails] = useState<Request>();

  const statusOptions = useMemo(() => {
    const defaultOptions = {
      value: '',
      label: 'All status',
    };

    const options = Object.values(RequestStatus).map((value) => ({
      value,
      label: value == RequestStatus.Pending ? 'Pending' : value,
    }));

    return [defaultOptions, ...options];
  }, []);

  const requestTemplateOtions = useMemo(() => {
    const defaultOptions = {
      value: '',
      label: 'All types',
    };

    const options = requestTemplates.map(({ definitionId, displayName }) => ({
      value: definitionId,
      label: displayName,
    }));

    return [defaultOptions, ...options];
  }, [requestTemplates]);

  const myRequestColumns = useMemo(
    () =>
      [
        columnHelper.accessor('workflowDefinitionDisplayName', {
          id: 'workflowDefinitionDisplayName',
          header: () => <Box>Request template</Box>,
          enableSorting: false,
          cell: (info) => <Box>{info.getValue()}</Box>,
        }),
        columnHelper.accessor('userRequestName', {
          id: 'userRequestName',
          header: () => <Box>Request user</Box>,
          enableSorting: false,
          cell: (info) => info.getValue(),
        }),
        columnHelper.accessor('currentStates', {
          id: 'currentStates',
          header: () => <Box textAlign="center">Current states</Box>,
          enableSorting: false,
          cell: (info) => info.getValue().join('\n'),
        }),
        columnHelper.accessor('stakeHolders', {
          id: 'stakeHolders',
          header: 'Stake holders',
          enableSorting: false,
          cell: (info) => info.getValue().join(', '),
        }),
        columnHelper.accessor('createdAt', {
          id: 'createdAt',
          header: 'Created at',
          cell: (info) => formatDate(new Date(info.getValue())),
          sortDescFirst: true,
        }),
        columnHelper.accessor('lastExecutedAt', {
          id: 'lastExecutedAt',
          header: 'Last executed at',
          cell: (info) => formatDate(new Date(info.getValue())),
          sortDescFirst: true,
        }),
        columnHelper.accessor('status', {
          id: 'status',
          header: 'Status',
          enableSorting: false,
          cell: (info) => info.getValue(),
        }),
        columnHelper.display({
          id: 'actions',
          enableSorting: false,
          header: () => <Center w="full">Actions</Center>,
          cell: (info) => (
            <Center>
              <RowAction
                onViewDetails={onActionViewDetails(info.row.original)}
                onCancel={onAction(info.row.original.id, 'cancel')}
                onDelete={onAction(info.row.original.id, 'delete')}
              />
            </Center>
          ),
        }),
      ] as ColumnDef<Request>[],
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

  const onTemplateStatusChange = (
    key: 'Status' | 'WorkflowDefinitionId' | 'RequestUser' | 'StakeHolder',
    value?: string
  ) => {
    setFilter({ ...filter, [key]: value, skipCount: 0 });
  };

  const onActionViewDetails = (request: Request) => () => {
    setRequestDetails(request);
    setOpenDetails(true);
  };

  const onAction = (requestId: string, type: 'delete' | 'cancel') => () => {
    setRequestId(requestId);
    setActionType(type);
    setModalTitle(`Confirm ${type} request`);
    setModalDescription(`Request will be ${type}ed. Do you confirm that?`);
    setIsOpen(true);
  };

  const handleConfirmation = async () => {
    setIsOpen(false);
    if (requestId.length === 0) return;

    const mutation =
      actionType === 'delete' ? deleteRequestMutation : cancelRequestMutation;
    const successMessage =
      actionType === 'delete'
        ? 'Deleted successfully!'
        : 'Cancelled successfully!';
    const errorMessage =
      actionType === 'delete' ? 'Delete failed!' : 'Cancel failed!';

    try {
      await mutation.mutateAsync(requestId);
      queryClient.invalidateQueries({ queryKey: [QueryKeys.FILTER_REQUEST] });
      toast({ title: successMessage, status: 'success' });
    } catch (error) {
      toast({ title: errorMessage, status: 'error' });
    }
  };

  return (
    <>
      <Box>
        <HStack
          w="full"
          pl="24px"
          pb="8px"
          alignItems="flex-end"
          flexWrap="wrap"
        >
          <Box w="220px">
            <SelectField
              size="sm"
              rounded="md"
              onChange={(e) =>
                onTemplateStatusChange('WorkflowDefinitionId', e.target.value)
              }
              options={requestTemplateOtions}
            />
          </Box>
          <Box w="112px">
            <SelectField
              size="sm"
              rounded="md"
              onChange={(e) => onTemplateStatusChange('Status', e.target.value)}
              options={statusOptions}
            />
          </Box>
        </HStack>
        {isAdmin && (
          <Wrap pl="24px" pt="8px">
            <WrapItem>
              <Button
                size={'md'}
                colorScheme={filter.RequestUser ? 'green' : 'gray'}
                onClick={() => {
                  if (filter.RequestUser) {
                    setFilter({ ...filter, RequestUser: '' });
                  } else {
                    setFilter({ ...filter, RequestUser: currentUser?.sub[0] });
                  }
                }}
                fontSize="sm"
                fontWeight="medium"
                mr={2}
              >
                Only my request
              </Button>
            </WrapItem>
          </Wrap>
        )}
        {isLoading ? (
          <Center h="200px">
            <Spinner mx="auto" speed="0.65s" thickness="3px" size="xl" />
          </Center>
        ) : (
          <EmptyWrapper
            isEmpty={!requests.length}
            h="200px"
            fontSize="xs"
            message={'No requests found!'}
          >
            <Box
              p="20px 30px 0px 24px"
              overflowX="auto"
              w={{ base: `calc(100vw - ${sideBarWidth}px)`, lg: 'auto' }}
            >
              <Table
                columns={myRequestColumns}
                data={requests}
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
      </Box>
      <ModalConfirm
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onConfirm={handleConfirmation}
        title={modalTitle}
        description={modalDescription}
      />
      {requestDetails && (
        <RequestDetailModal
          isOpen={isOpenDetails}
          onClose={() => setOpenDetails(false)}
          requestDetail={requestDetails}
        />
      )}
    </>
  );
};
