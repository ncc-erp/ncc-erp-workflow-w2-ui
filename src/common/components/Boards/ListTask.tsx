import {
  Box,
  Center,
  Flex,
  HStack,
  Icon,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spacer,
  Spinner,
  useDisclosure,
} from '@chakra-ui/react';
import { useRecoilValue } from 'recoil';
import { appConfigState } from 'stores/appConfig';
import { Table } from 'common/components/Table/Table';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ColumnDef, createColumnHelper } from '@tanstack/react-table';
import { EmptyWrapper } from 'common/components/EmptyWrapper';
import { FilterTasks, ITask } from 'models/task';
import { RiEyeFill, RiSettings4Fill } from 'react-icons/ri';
import { MdCancel } from 'react-icons/md';
import { AiFillCheckCircle, AiOutlineReload } from 'react-icons/ai';
import { formatDate } from 'utils';
import { TaskStatus, noOfRows } from 'common/constants';
import { useCurrentUser } from 'hooks/useCurrentUser';
import {
  useApproveTask,
  useGetTasks,
  useRejectTask,
} from 'api/apiHooks/taskHooks';
import { PageSize } from 'common/components/Table/PageSize';
import { ShowingItemText } from 'common/components/Table/ShowingItemText';
import { Pagination } from 'common/components/Pagination';
import styles from './style.module.scss';
import ModalBoard from './ModalBoard';
import { toast } from '../StandaloneToast';

interface Props {
  filters: FilterTasks;
  openDetailModal: (id: string) => void;
}

const initDataForm = {
  status: 0,
  taskId: '',
};

export const ListTask = ({ filters, openDetailModal }: Props) => {
  const [filter, setFilter] = useState<FilterTasks>(filters);
  const columnHelper = createColumnHelper<ITask>();
  const { sideBarWidth } = useRecoilValue(appConfigState);
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

  const taskColumns = useMemo(
    () =>
      [
        columnHelper.accessor('id', {
          id: 'id',
          header: () => <Box pl="16px">ID</Box>,
          enableSorting: true,
          sortDescFirst: true,
          cell: (info) => (
            <Center>{info.getValue().slice(-5).toUpperCase()}</Center>
          ),
        }),
        columnHelper.accessor('name', {
          id: 'name',
          header: 'Types',
          enableSorting: true,
          cell: (info) => info.getValue(),
        }),
        columnHelper.accessor('authorName', {
          id: 'authorName',
          header: 'Name',
          enableSorting: true,
          cell: (info) => info.getValue(),
        }),
        columnHelper.accessor('emailTo', {
          id: 'emailTo',
          header: 'Assigned To',
          enableSorting: true,
          cell: (info) =>
            info
              .getValue()
              .map((email) => email.split('@')[0])
              .join(', '),
        }),
        columnHelper.accessor('status', {
          id: 'status',
          header: 'State',
          enableSorting: true,
          cell: (info) => {
            const status = info.row.original.status;
            return (
              <Flex alignItems={'center'} gap={1}>
                <div
                  className={`${styles.status} ${
                    status === TaskStatus.Pending
                      ? styles.statusPending
                      : status === TaskStatus.Approved
                      ? styles.statusApproved
                      : status === TaskStatus.Rejected
                      ? styles.statusRejected
                      : ''
                  }`}
                />
                {Object.keys(TaskStatus)[info.getValue()]}
              </Flex>
            );
          },
        }),
        columnHelper.accessor('creationTime', {
          id: 'creationTime',
          header: 'Created At',
          enableSorting: true,
          cell: (info) => formatDate(info.getValue()),
        }),
        columnHelper.display({
          id: 'actions',
          enableSorting: false,
          header: () => <Center w="full">Actions</Center>,
          cell: (info) => {
            return (
              <Center>
                <Menu>
                  <MenuButton
                    as={IconButton}
                    aria-label=""
                    variant="ghost"
                    size="sm"
                    icon={
                      <Icon
                        color="gray.500"
                        fontSize="lg"
                        as={RiSettings4Fill}
                      />
                    }
                  />
                  <MenuList minW={'100px'}>
                    <MenuItem
                      display="flex"
                      gap="12px"
                      onClick={() => openDetailModal(info.row.original.id)}
                    >
                      <Icon color="blue.500" as={RiEyeFill} />
                      View
                    </MenuItem>
                    {info.row.original.status === TaskStatus.Pending &&
                      info.row.original.emailTo.includes(user.email) && (
                        <>
                          <MenuItem
                            display="flex"
                            gap="12px"
                            onClick={() => {
                              setDataForm({
                                status: TaskStatus.Approved,
                                taskId: info.row.original.id,
                              });
                              onOpen();
                            }}
                          >
                            <Icon color="green.500" as={AiFillCheckCircle} />
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
                            <Icon color="red.500" as={MdCancel} />
                            Reject
                          </MenuItem>
                        </>
                      )}
                  </MenuList>
                </Menu>
              </Center>
            );
          },
        }),
      ] as ColumnDef<ITask>[],
    [columnHelper, onOpen, openDetailModal, user.email]
  );

  const handleClose = useCallback(() => {
    onClose();
    setDataForm(initDataForm);
    setReason('');
  }, [onClose]);

  const handleConfirm = useCallback(async () => {
    try {
      setLoadStatus(true);
      switch (dataForm.status) {
        case TaskStatus.Approved:
          await approveTaskMutation.mutateAsync(dataForm.taskId);
          refetch();
          toast({ title: 'Approved successfully!', status: 'success' });
          break;
        case TaskStatus.Rejected:
          if (!reason) return;
          await rejectTaskMutation.mutateAsync({
            id: dataForm.taskId,
            reason,
          });
          refetch();
          toast({ title: 'Rejected successfully!', status: 'success' });
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
  }, [
    approveTaskMutation,
    dataForm.status,
    dataForm.taskId,
    handleClose,
    reason,
    refetch,
    rejectTaskMutation,
  ]);

  const onPageChange = useCallback(
    (page: number) => {
      setFilter({
        ...filters,
        skipCount: filter.maxResultCount * (page - 1),
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

  useEffect(() => {
    setFilter(filters);
  }, [filters]);

  const currentPage = useMemo(() => {
    const { skipCount, maxResultCount } = filter;
    return (maxResultCount + skipCount) / maxResultCount;
  }, [filter]);

  return (
    <>
      <Box position={'relative'}>
        <IconButton
          isRound={true}
          variant="solid"
          aria-label="Done"
          fontSize="20px"
          position={'absolute'}
          right={25}
          top={'-40px'}
          icon={<AiOutlineReload />}
          onClick={() => refetch()}
        />
        {isLoading || isRefetching ? (
          <Center h="200px">
            <Spinner mx="auto" speed="0.65s" thickness="3px" size="xl" />
          </Center>
        ) : (
          <>
            <EmptyWrapper
              isEmpty={false}
              h="200px"
              fontSize="xs"
              message={'No requests found!'}
            >
              <Box
                p="10px 20px"
                overflowX="auto"
                w={{ base: `calc(100vw - ${sideBarWidth}px)`, lg: 'auto' }}
              >
                <Table columns={taskColumns} data={data?.items ?? []} />
              </Box>
            </EmptyWrapper>
            <HStack
              p="0px 30px 20px 30px"
              justifyContent="space-between"
              borderBottom="1px"
              borderColor="gray.200"
              flexWrap="wrap"
            >
              <HStack alignItems="center" spacing="6px" flexWrap="wrap">
                <PageSize noOfRows={noOfRows} onChange={onPageSizeChange} />
                <Spacer w="12px" />
                <ShowingItemText
                  skipCount={filter.skipCount}
                  maxResultCount={filter.maxResultCount}
                  totalCount={data?.totalCount ?? 0}
                />
              </HStack>
              <Pagination
                total={data?.totalCount ?? 0}
                pageSize={filter.maxResultCount}
                current={currentPage}
                onChange={onPageChange}
                hideOnSinglePage
              />
            </HStack>
          </>
        )}
      </Box>
      <ModalBoard
        isOpen={isOpen}
        onClose={handleClose}
        onConfirm={handleConfirm}
        showReason={dataForm.status === TaskStatus.Rejected}
        setReason={setReason}
        isDisabled={dataForm.status === TaskStatus.Rejected && !reason}
        isLoading={loadStatus}
      />
    </>
  );
};
