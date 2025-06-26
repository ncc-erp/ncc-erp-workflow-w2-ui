import {
  Box,
  Button,
  Center,
  Flex,
  HStack,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Spacer,
  Wrap,
  WrapItem,
} from '@chakra-ui/react';
import { useQueryClient } from '@tanstack/react-query';
import {
  ColumnDef,
  SortingState,
  createColumnHelper,
} from '@tanstack/react-table';
import {
  useCancelRequest,
  useMyRequests,
  useRequestTemplates,
} from 'api/apiHooks/requestHooks';
import { Pagination } from 'common/components/Pagination';
import { SelectField } from 'common/components/SelectField';
import { toast } from 'common/components/StandaloneToast';
import { PageSize } from 'common/components/Table/PageSize';
import { Table } from 'common/components/Table/Table';
import { Permissions, QueryKeys, noOfRows } from 'common/constants';
import { RequestSortField, RequestStatus, SortDirection } from 'common/enums';
import { RowAction } from 'features/requestDevices/components/RowAction';
import { useCurrentUser } from 'stores/user';
//import { useIsAdmin } from 'hooks/useIsAdmin';
import { EmptyWrapper } from 'common/components/EmptyWrapper';
import { ModalConfirm } from 'common/components/ModalConfirm';
import OverflowText from 'common/components/OverflowText';
import TextToolTip from 'common/components/textTooltip';
import { WorkflowModal } from 'common/components/WorkflowModal';
import useDebounced from 'hooks/useDebounced';
import { useUserPermissions } from 'hooks/useUserPermissions';
import { FilterRequestParams, Request, Settings } from 'models/request';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { AiOutlineReload } from 'react-icons/ai';
import { TbSearch } from 'react-icons/tb';
import { useRecoilValue } from 'recoil';
import { appConfigState } from 'stores/appConfig';
import { formatDate } from 'utils';
import { RequestDetailModal } from './DetailModal';
import styles from './style.module.scss';
import { useMediaQuery } from 'hooks/useMediaQuery';
import { PaginationMobile } from 'common/components/PaginationMobile';
import { CheckIcon } from '@chakra-ui/icons';

const initialSorting: SortingState = [
  {
    id: RequestSortField.createdAt,
    desc: true,
  },
];

export const MyRequestTable = () => {
  const currentUser = useCurrentUser();
  const isLargeScreen = useMediaQuery('(min-width: 768px)');
  const initialFilter: FilterRequestParams = {
    Status: '',
    WorkflowDefinitionId: '',
    sorting: [RequestSortField.createdAt, 'desc'].join(' '),
    skipCount: 0,
    maxResultCount: +noOfRows[0].value,
    RequestUser: currentUser?.sub[0],
    StakeHolder: '',
  };
  const isPublish = true;
  const { sideBarWidth } = useRecoilValue(appConfigState);
  const [filter, setFilter] = useState<FilterRequestParams>(initialFilter);
  const [sorting, setSorting] = useState<SortingState>(initialSorting);
  const { data, isLoading, isRefetching, refetch } = useMyRequests(filter);
  const { data: requestTemplateData } = useRequestTemplates(isPublish);
  const { items: requests = [] } = data ?? {};
  const { items: requestTemplates = [] } = requestTemplateData ?? {};
  const { skipCount, maxResultCount } = filter;
  const currentPage = (maxResultCount + skipCount) / maxResultCount;
  const columnHelper = createColumnHelper<Request>();
  const { hasPermission, renderIfAllowed } = useUserPermissions();
  const queryClient = useQueryClient();
  const cancelRequestMutation = useCancelRequest();
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenDetails, setOpenDetails] = useState(false);
  const [isOpenWorkflow, setOpenWorkflow] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalDescription, setModalDescription] = useState('');
  const [requestId, setRequestId] = useState('');
  const [requestDetails, setRequestDetails] = useState<Request>();
  const [requestWorkflow, setRequestWorkflow] = useState<string>('');
  const [txtSearch, setTxtSearch] = useState<string>('');
  const txtSearchDebounced = useDebounced(txtSearch, 500);

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

  const myRequestColumns = useMemo(() => {
    const displayColumn = columnHelper.accessor('shortTitle', {
      id: 'shortTitle',
      header: () => <Box textAlign="center">Title</Box>,
      enableSorting: false,
      cell: (info) => {
        let colorCode: string = '#aabbcc';
        if (
          info.row.original.settings &&
          typeof info.row.original.settings === 'object'
        ) {
          const settings = info.row.original.settings as Settings;
          if (settings.color) {
            colorCode = settings.color;
          }
        }
        return (
          <Box
            style={{
              display: 'flex',
              alignItems: 'start',
              flexDirection: 'column',
              gap: '5px',
              minWidth: '400px',
            }}
          >
            <TextToolTip
              title={info.row.original.shortTitle || ''}
              maxLines={1}
              type="LIST"
              place="top"
              data-testid="short-title-tooltip"
            />
            <Box
              className={styles.titleTable}
              style={{
                backgroundColor: colorCode,
              }}
            >
              <OverflowText
                text={info.row.original.workflowDefinitionDisplayName}
                maxLines={1}
              />
            </Box>
          </Box>
        );
      },
    });

    const editorColumn = columnHelper.accessor('userRequestName', {
      id: 'userRequestName',
      header: () => <Box>Request user</Box>,
      enableSorting: false,
      cell: (info) => info.getValue(),
    });

    const coreColumn = [
      columnHelper.accessor('currentStates', {
        id: 'currentStates',
        header: () => <Box textAlign="center">Current states</Box>,
        enableSorting: false,
        cell: (info) => {
          const currentStates = info.getValue();
          const formattedCurrentStates = currentStates.join(',\n');
          return (
            <div
              className={styles.coreColumnRow}
              dangerouslySetInnerHTML={{ __html: formattedCurrentStates }}
            />
          );
        },
      }),

      columnHelper.accessor('stakeHolders', {
        id: 'stakeHolders',
        header: 'Stakeholders',
        enableSorting: false,
        cell: (info) => {
          const stakeholders = info.getValue();
          const formattedStakeholders = stakeholders.join(',\n');
          return (
            <div
              className={styles.coreColumnRow}
              dangerouslySetInnerHTML={{ __html: formattedStakeholders }}
            />
          );
        },
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
        enableSorting: false,
        sortDescFirst: true,
      }),
      columnHelper.accessor('status', {
        id: 'status',
        header: 'Status',
        enableSorting: false,
        cell: (info) => {
          const status = info.row.original.status;
          return (
            <Box display={'flex'}>
              {
                <div className={`${styles.badge} ${styles[status]}`}>
                  {info.getValue()}
                </div>
              }
            </Box>
          );
        },
      }),
      columnHelper.display({
        id: 'actions',
        enableSorting: false,
        header: () => <Center w="full">Actions</Center>,
        cell: (info) => {
          return (
            // eslint-disable-next-line{}
            <Center onClick={(e) => e.stopPropagation()}>
              <RowAction
                onCancel={onAction(info.row.original.id, 'canceled')}
                onViewDetails={onActionViewDetails(info.row.original)}
                onViewWorkflow={onActionViewWorkflow(info.row.original.id)}
                actions={{
                  cancel:
                    hasPermission(Permissions.CANCEL_WORKFLOW_INSTANCE) &&
                    info.row.original.status === RequestStatus.Pending,
                }}
              />
            </Center>
          );
        },
      }),
    ] as ColumnDef<Request>[];

    const result = [
      displayColumn,
      ...[editorColumn],
      ...coreColumn,
    ] as ColumnDef<Request>[];
    return result;
  }, [columnHelper, hasPermission]);

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

  const onTemplateStatusChange = useCallback(
    (
      key:
        | 'Status'
        | 'WorkflowDefinitionId'
        | 'RequestUser'
        | 'StakeHolder'
        | 'EmailRequest',
      value?: string
    ) => {
      setFilter((filter) => ({ ...filter, [key]: value, skipCount: 0 }));
    },
    []
  );

  useEffect(() => {
    onTemplateStatusChange('EmailRequest', txtSearchDebounced);
  }, [onTemplateStatusChange, txtSearchDebounced]);

  const onActionViewDetails = (request: Request) => () => {
    setRequestDetails(request);
    setOpenDetails(true);
  };

  const onActionViewWorkflow = (workflowId: string) => () => {
    setRequestWorkflow(workflowId);
    setOpenWorkflow(true);
  };

  const onAction = (requestId: string, type: 'canceled') => () => {
    setRequestId(requestId);
    setModalTitle(`Confirm ${type} request`);
    setModalDescription(`Request will be ${type}. Do you confirm that?`);
    setIsOpen(true);
  };

  const handleConfirmation = async () => {
    setIsOpen(false);
    if (requestId.length === 0) return;

    try {
      await cancelRequestMutation.mutateAsync(requestId);
      queryClient.invalidateQueries({ queryKey: [QueryKeys.FILTER_REQUEST] });
      toast({ title: 'Cancelled successfully!', status: 'success' });
    } catch (error) {
      toast({ title: 'Cancel failed!', status: 'error' });
    }
  };

  return (
    <>
      <Box>
        <Flex
          w="full"
          gap={3}
          pb="8px"
          flexDirection={['column', 'row']}
          alignItems={['unset', 'flex-end']}
        >
          <Box flexBasis={{ sm: '296px' }}>
            <SelectField
              isDisabled={isLoading || isRefetching}
              size="sm"
              rounded="md"
              onChange={(e) =>
                onTemplateStatusChange('WorkflowDefinitionId', e.target.value)
              }
              options={requestTemplateOtions}
            />
          </Box>
          <Box>
            <SelectField
              isDisabled={isLoading || isRefetching}
              size="sm"
              rounded="md"
              onChange={(e) => onTemplateStatusChange('Status', e.target.value)}
              options={statusOptions}
            />
          </Box>
          {
            //  isAdmin &&
            !filter.RequestUser && (
              <Box w={'300px'}>
                <InputGroup>
                  <Input
                    autoFocus
                    value={txtSearch}
                    type="text"
                    placeholder="Enter email"
                    fontSize="14px"
                    onChange={(e) =>
                      !isLoading &&
                      !isRefetching &&
                      setTxtSearch(e.target.value)
                    }
                    data-testid="search-input"
                  />
                  <InputRightElement width="40px">
                    <TbSearch />
                  </InputRightElement>
                </InputGroup>
              </Box>
            )
          }
        </Flex>
        <Box className={styles.requestFilterBar}>
          {renderIfAllowed(
            Permissions.VIEW_ALL_WORKFLOW_INSTANCES,
            <Wrap justify="space-between">
              {
                <WrapItem>
                  <Button
                    leftIcon={filter.RequestUser ? <CheckIcon /> : <></>}
                    isDisabled={isLoading || isRefetching}
                    size={'md'}
                    colorScheme={filter.RequestUser ? 'green' : 'gray'}
                    onClick={() =>
                      setFilter({
                        ...filter,
                        RequestUser: filter.RequestUser
                          ? ''
                          : currentUser?.sub[0],
                      })
                    }
                    fontSize="sm"
                    fontWeight="medium"
                    mr={2}
                  >
                    Only my request
                  </Button>
                </WrapItem>
              }
            </Wrap>
          )}
          <Wrap spacing={2} className={styles.requestFilterItem}>
            <WrapItem>
              <IconButton
                isDisabled={isLoading || isRefetching}
                isRound={true}
                variant="solid"
                aria-label="Done"
                fontSize="20px"
                icon={<AiOutlineReload />}
                onClick={() => refetch()}
              />
            </WrapItem>
          </Wrap>
        </Box>
        <EmptyWrapper
          isEmpty={!requests.length && !isRefetching && !isLoading}
          h="200px"
          fontSize="xs"
          message={'No request found!'}
        >
          <Box
            w={{
              base: `calc(100vw - ${sideBarWidth}px)`,
              lg: `calc(100vw - ${sideBarWidth}px)`,
              xs: 'max-content',
            }}
            pt="10px"
            data-testid="my-requests-view"
          >
            <Table
              columns={myRequestColumns}
              data={requests}
              sorting={sorting}
              onSortingChange={setSorting}
              onRowClick={onActionViewDetails}
              onRowHover={true}
              isHighlight={true}
              isLoading={isLoading}
              isRefetching={isRefetching}
              pageSize={filter.maxResultCount}
              dataTestId="my-request-item"
            />
          </Box>

          {isLargeScreen ? (
            <HStack
              py="20px"
              justifyContent={['center', 'space-between']}
              flexWrap="wrap"
            >
              <HStack alignItems="center" spacing="6px" flexWrap="wrap">
                <PageSize
                  noOfRows={noOfRows}
                  onChange={onPageSizeChange}
                  value={filter.maxResultCount}
                />
                <Spacer w="12px" />
              </HStack>
              <Pagination
                total={data?.totalCount ?? 0}
                pageSize={filter.maxResultCount}
                current={currentPage}
                onChange={onPageChange}
                hideOnSinglePage
                data-testid="pagination"
              />
            </HStack>
          ) : (
            <HStack
              display={'flex'}
              width={'100%'}
              p={['0px 16px 20px 16px', '0px 16px 20px 16px']}
              justifyContent={['center', 'space-between']}
            >
              <PaginationMobile
                total={data?.totalCount ?? 0}
                pageSize={filter.maxResultCount}
                current={currentPage}
                onChange={onPageChange}
                hideOnSinglePage
                data-testid="pagination"
              />
            </HStack>
          )}
        </EmptyWrapper>
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
      {requestWorkflow && (
        <WorkflowModal
          isOpen={isOpenWorkflow}
          onClose={() => setOpenWorkflow(false)}
          workflow={`CompOnly?id=${requestWorkflow}`}
        />
      )}
    </>
  );
};
