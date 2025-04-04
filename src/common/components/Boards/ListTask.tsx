import {
  Box,
  Center,
  HStack,
  Icon,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spacer,
  Spinner,
  Tooltip,
  useDisclosure,
} from '@chakra-ui/react';
import { ColumnDef, createColumnHelper } from '@tanstack/react-table';
import {
  useActionTask,
  useApproveTask,
  useGetTasks,
  useRejectTask,
} from 'api/apiHooks/taskHooks';
import { EmptyWrapper } from 'common/components/EmptyWrapper';
import { Pagination } from 'common/components/Pagination';
import { PageSize } from 'common/components/Table/PageSize';
import { Table } from 'common/components/Table/Table';
import {
  OtherActionSignalStatus,
  Permissions,
  TaskStatus,
  noOfRows,
} from 'common/constants';
import { useCurrentUser } from 'stores/user';
import { FilterTasks, ITask } from 'models/task';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { AiFillCheckCircle, AiOutlineReload } from 'react-icons/ai';
import { BsFillFilterCircleFill } from 'react-icons/bs';
import { MdCancel } from 'react-icons/md';
import { RiEyeFill, RiSettings4Fill, RiMapFill } from 'react-icons/ri';
import { formatDate } from 'utils';
import { toast } from '../StandaloneToast';
import ModalBoard from './ModalBoard';
import styles from './style.module.scss';
import { useClearCacheTask } from './useClearCacheTask';
import { WorkflowModal } from 'common/components/WorkflowModal';
import OverflowText from '../OverflowText';
import TextToolTip from '../textTooltip';
import { useUserPermissions } from 'hooks/useUserPermissions';
import { useMediaQuery } from 'hooks/useMediaQuery';
import { PaginationMobile } from '../PaginationMobile';

interface Props {
  filters: FilterTasks;
  openDetailModal: (data: ITask) => () => void;
}

const initDataForm = {
  status: 0,
  taskId: '',
};

export const ListTask = ({ filters, openDetailModal }: Props) => {
  const [filter, setFilter] = useState<FilterTasks>(filters);
  const columnHelper = createColumnHelper<ITask>();
  const isLargeScreen = useMediaQuery('(min-width: 1024px)');

  const user = useCurrentUser();
  const { data, refetch, isLoading, isRefetching } = useGetTasks({ ...filter });
  const approveTaskMutation = useApproveTask();
  const rejectTaskMutation = useRejectTask();
  const [reason, setReason] = useState<string>('');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [dataForm, setDataForm] = useState<{ status: number; taskId: string }>(
    initDataForm
  );
  const [loadStatus, setLoadStatus] = useState<boolean>(false);
  const actionTaskMutation = useActionTask();
  const { renderIfAllowed } = useUserPermissions();
  const [isActionLoading, setIsActionLoading] = useState({
    isLoading: false,
    id: '',
  });
  const [dynamicForm, setDynamicForm] = useState({
    hasDynamicForm: false,
    dynamicForm: '',
  });

  const { clear } = useClearCacheTask();

  const [requestWorkflow, setRequestWorkflow] = useState<string>('');
  const [isOpenWorkflow, setOpenWorkflow] = useState(false);

  const onActionViewWorkflow = (workflowId: string) => () => {
    setRequestWorkflow(workflowId);
    setOpenWorkflow(true);
  };

  const taskColumns = useMemo(() => {
    const onActionClick = async (id: string, action: string) => {
      try {
        setIsActionLoading({
          isLoading: true,
          id,
        });
        await actionTaskMutation.mutateAsync({ id, action });
        toast({ title: 'Send action successfully!', status: 'success' });
        refetch();
      } catch (error) {
        console.error(error);
      } finally {
        setIsActionLoading({
          isLoading: false,
          id: '',
        });
      }
    };

    return [
      columnHelper.accessor('requestId', {
        id: 'id',
        header: () => (
          <Box textAlign="center" w="full">
            ID
          </Box>
        ),
        enableSorting: false,
        sortDescFirst: true,
        cell: (info) => (
          <Center>
            <Tooltip fontSize={'xs'} label={info.getValue()}>
              {info.getValue()
                ? info.getValue()?.slice(-5).toUpperCase()
                : info.row.original.id.slice(-5).toUpperCase()}
            </Tooltip>
          </Center>
        ),
      }),
      // columnHelper.accessor('name', {
      //   id: 'name',
      //   header: 'Request template',
      //   enableSorting: false,
      //   cell: (info) => info.getValue(),
      // }),
      columnHelper.accessor('title', {
        id: 'title',
        header: () => <Box textAlign="center">Title</Box>,
        enableSorting: false,
        cell: (info) => {
          const { settings } = info.row.original;
          const color: string = settings?.color || '#aabbcc';
          const titleTemplate: string = settings?.titleTemplate || '';
          return (
            <>
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
                  title={titleTemplate}
                  maxLines={1}
                  type="LIST"
                  place="top"
                />

                <Box
                  className={styles.titleBoard}
                  style={{
                    backgroundColor: color,
                  }}
                >
                  <OverflowText text={info.row.original.name} maxLines={1} />
                </Box>
              </Box>
            </>
          );
        },
      }),
      columnHelper.accessor('authorName', {
        id: 'authorName',
        header: 'Request user',
        enableSorting: false,
        cell: (info) => {
          const authorName = info.getValue();
          return (
            <Tooltip fontSize={'xs'} label={info.row.original.email}>
              <Box>{authorName}</Box>
            </Tooltip>
          );
        },
      }),
      columnHelper.accessor('description', {
        id: 'description',
        header: 'Current State',
        enableSorting: false,
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('emailTo', {
        id: 'emailTo',
        header: 'Assigned To',
        enableSorting: false,
        cell: (info) =>
          info
            .getValue()
            .map((email) => email.split('@')[0])
            .join(', '),
      }),
      columnHelper.accessor('status', {
        id: 'status',
        header: 'State',
        enableSorting: false,
        cell: (info) => {
          const status = info.row.original.status;
          return (
            <Box display={'flex'}>
              {
                <div
                  className={`${styles.badge} ${
                    status === TaskStatus.Pending
                      ? styles.statusPending
                      : status === TaskStatus.Approved
                      ? styles.statusApproved
                      : status === TaskStatus.Rejected
                      ? styles.statusRejected
                      : ''
                  }`}
                >
                  {Object.keys(TaskStatus)[info.getValue()]}
                </div>
              }
            </Box>
          );
        },
      }),

      columnHelper.accessor('creationTime', {
        id: 'creationTime',
        header: 'Created At',
        enableSorting: false,
        cell: (info) => formatDate(info.getValue()),
      }),
      columnHelper.display({
        id: 'actions',
        enableSorting: false,
        header: () => <Center w="full">Actions</Center>,
        cell: (info) => {
          return (
            <Center mr={1} onClick={(e) => e.stopPropagation()}>
              <div className={styles.tableActionLoading}>
                {isActionLoading.isLoading &&
                  isActionLoading.id === info.row.original.id && (
                    <Spinner size="xs" />
                  )}
              </div>
              <Menu>
                <MenuButton
                  as={IconButton}
                  aria-label=""
                  variant="ghost"
                  size="sm"
                  icon={
                    <Icon color="gray.500" fontSize="lg" as={RiSettings4Fill} />
                  }
                />
                <MenuList minW={'100px'}>
                  <MenuItem
                    display="flex"
                    gap="12px"
                    onClick={() => openDetailModal(info.row.original)()}
                  >
                    <Icon as={RiEyeFill} />
                    View
                  </MenuItem>
                  <MenuItem
                    display="flex"
                    gap="12px"
                    onClick={() =>
                      onActionViewWorkflow(
                        info.row.original.workflowInstanceId
                      )()
                    }
                  >
                    <Icon as={RiMapFill} />
                    Workflow
                  </MenuItem>
                  {renderIfAllowed(
                    Permissions.UPDATE_TASK_STATUS,
                    info.row.original.status === TaskStatus.Pending &&
                      info.row.original.emailTo.includes(user.email) ? (
                      <>
                        <MenuItem
                          display="flex"
                          gap="12px"
                          onClick={() => {
                            setDataForm({
                              status: TaskStatus.Approved,
                              taskId: info.row.original.id,
                            });

                            if (info.row.original?.dynamicActionData) {
                              setDynamicForm({
                                hasDynamicForm: true,
                                dynamicForm:
                                  info.row.original.dynamicActionData || '',
                              });
                            }
                            onOpen();
                          }}
                        >
                          <Icon as={AiFillCheckCircle} />
                          Approve
                        </MenuItem>
                        <MenuItem
                          display="flex"
                          gap="12px"
                          onClick={() => {
                            setDataForm({
                              status: TaskStatus.Rejected,
                              taskId: info.row.original.id,
                            });
                            onOpen();
                          }}
                        >
                          <Icon as={MdCancel} />
                          Reject
                        </MenuItem>
                        {info.row.original.otherActionSignals &&
                          info.row.original.otherActionSignals.map(
                            (el, index) => (
                              <MenuItem
                                display="flex"
                                gap="12px"
                                isDisabled={
                                  el.status !== OtherActionSignalStatus.PENDING
                                }
                                key={index}
                                onClick={() => {
                                  onActionClick(
                                    info.row.original.id,
                                    el.otherActionSignal
                                  );
                                }}
                              >
                                <Icon as={BsFillFilterCircleFill} />
                                {el.otherActionSignal}
                              </MenuItem>
                            )
                          )}
                      </>
                    ) : (
                      <></>
                    )
                  )}
                </MenuList>
              </Menu>
            </Center>
          );
        },
      }),
    ] as ColumnDef<ITask>[];
  }, [
    actionTaskMutation,
    columnHelper,
    isActionLoading.id,
    isActionLoading.isLoading,
    onOpen,
    openDetailModal,
    refetch,
    user.email,
    renderIfAllowed,
  ]);

  const handleClose = useCallback(() => {
    onClose();
    setDataForm(initDataForm);
    setReason('');
    setDynamicForm({
      hasDynamicForm: false,
      dynamicForm: '',
    });
  }, [onClose]);

  const handleConfirm = useCallback(
    async (approvedData?: string) => {
      try {
        setLoadStatus(true);
        switch (dataForm.status) {
          case TaskStatus.Approved:
            await approveTaskMutation.mutateAsync({
              id: dataForm.taskId,
              dynamicActionData: approvedData,
            });
            refetch();
            clear();
            toast({ title: 'Approved Task Successfully!', status: 'success' });
            break;
          case TaskStatus.Rejected:
            if (!reason) return;
            await rejectTaskMutation.mutateAsync({
              id: dataForm.taskId,
              reason,
            });
            refetch();
            clear();
            toast({ title: 'Rejected Task Successfully!', status: 'success' });
            break;
          default:
            break;
        }
        handleClose();
      } catch (error) {
        console.log(error);
      } finally {
        setLoadStatus(false);
      }
    },
    [
      approveTaskMutation,
      clear,
      dataForm.status,
      dataForm.taskId,
      handleClose,
      reason,
      refetch,
      rejectTaskMutation,
    ]
  );

  const onPageChange = useCallback(
    (page: number) => {
      setFilter({
        ...filters,
        skipCount: filter.maxResultCount * (page - 1),
        maxResultCount: filter.maxResultCount,
      });
    },
    [filter.maxResultCount, filters]
  );

  const onPageSizeChange = useCallback(
    (pageSize: number) => {
      setFilter({
        ...filters,
        maxResultCount: pageSize,
        skipCount: 0,
      });
    },
    [filters]
  );

  const displayData = useMemo(() => {
    return data?.items.map((item) => {
      return {
        ...item,
        id: item.requestId || item.id,
      };
    });
  }, [data]);

  useEffect(() => {
    setFilter({
      ...filters,
    });
  }, [filters]);

  const currentPage = useMemo(() => {
    const { skipCount, maxResultCount } = filter;
    return (maxResultCount + skipCount) / maxResultCount;
  }, [filter]);

  return (
    <>
      <Box position={'relative'}>
        <IconButton
          isDisabled={isLoading || isRefetching}
          isRound={true}
          variant="solid"
          aria-label="Done"
          fontSize="20px"
          position={'absolute'}
          right="0"
          top={'-48px'}
          icon={<AiOutlineReload />}
          onClick={() => refetch()}
          data-testid="task-actions-menu-button"
        />
        <>
          <EmptyWrapper
            isEmpty={false}
            h="200px"
            fontSize="xs"
            message={'No request found!'}
          >
            <Box py="10px" data-testid="list-tasks-view">
              <Box w={'100%'} overflowX="auto" className={styles.tableContent}>
                <Table
                  onRowClick={openDetailModal}
                  columns={taskColumns}
                  data={displayData ?? []}
                  onRowHover={true}
                  isHighlight={true}
                  isLoading={isLoading}
                  isRefetching={isRefetching}
                  pageSize={filter.maxResultCount}
                  dataTestId="task-item"
                />
              </Box>
            </Box>
          </EmptyWrapper>
          {isLargeScreen ? (
            <HStack
              py="20px"
              justifyContent={['center', 'space-between']}
              borderBottom="1px"
              borderColor="gray.200"
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
        </>
      </Box>
      <ModalBoard
        isOpen={isOpen}
        onClose={handleClose}
        onConfirm={handleConfirm}
        showReason={dataForm.status === TaskStatus.Rejected}
        setReason={setReason}
        isDisabled={dataForm.status === TaskStatus.Rejected && !reason}
        isLoading={loadStatus}
        showDynamicForm={dynamicForm.hasDynamicForm}
        dynamicForm={dynamicForm.dynamicForm}
      />
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
