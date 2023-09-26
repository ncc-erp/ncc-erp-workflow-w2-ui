import {
  DragDropContext,
  Draggable,
  DropResult,
  Droppable,
} from '@hello-pangea/dnd';
import { useEffect, useState } from 'react';
import styles from './style.module.scss';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'common/components/StandaloneToast';
import { BoardColumnStatus, QueryKeys, TaskStatus } from 'common/constants';
import useBoard from './useBoard';
import { Box, Flex, IconButton, Text, useDisclosure } from '@chakra-ui/react';
import { FetchNextPageFunction, ITask, Refetch, TaskResult } from 'models/task';
import { useApproveTask, useRejectTask } from 'api/apiHooks/taskHooks';
import ModalBoard from './ModalBoard';
import { ETaskStatus } from 'common/enums';
import { useCurrentUser } from 'hooks/useCurrentUser';
import { formatDate } from 'utils/formatDate';
import { getDayAgo } from 'utils/getDayAgo';
import { HiArrowDown } from 'react-icons/hi';
import { TaskDetailModal } from 'features/Tasks/components/TaskDetailModal';

interface ModalDetail {
  isOpen: boolean;
  taskId: string;
}

export interface BoardsProps {
  data: {
    listPending: TaskResult;
    listApproved: TaskResult;
    listRejected: TaskResult;
  };
  fetchNextPagePending: FetchNextPageFunction;
  fetchNextPageApproved: FetchNextPageFunction;
  fetchNextPageRejected: FetchNextPageFunction;
  refetchPending: Refetch;
  refetchApproved: Refetch;
  refetchRejected: Refetch;
  status: number;
}

const initialModalStatus: ModalDetail = {
  isOpen: false,
  taskId: '',
};

const Boards = ({
  data,
  fetchNextPageApproved,
  fetchNextPagePending,
  fetchNextPageRejected,
  refetchApproved,
  refetchRejected,
  status,
}: BoardsProps): JSX.Element => {
  const [modalState, setModalState] = useState(initialModalStatus);
  const [result, setResult] = useState<DropResult>();
  const [isRejected, setIsRejected] = useState<boolean>(false);
  const [reason, setReason] = useState<string>('');
  const [state, setState] = useState<Record<ETaskStatus, ITask[]>>({
    [ETaskStatus.Pending]: [],
    [ETaskStatus.Approved]: [],
    [ETaskStatus.Rejected]: [],
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const queryClient = useQueryClient();
  const approveTaskMutation = useApproveTask();
  const rejectTaskMutation = useRejectTask();
  const { reorder, move, getItemStyle, getListStyle } = useBoard();
  const currentUser = useCurrentUser();

  const openModal = (taskId: string) => {
    setModalState({
      ...modalState,
      isOpen: true,
      taskId: taskId,
    });
  };

  const closeModal = () => {
    setModalState({
      ...modalState,
      isOpen: false,
    });
  };

  const handleClose = () => {
    onClose();
    setIsRejected(false);
    setReason('');
  };

  const onDragEnd = async (result: DropResult) => {
    const { destination, source } = result;
    if (!destination) return;
    const sInd = +source.droppableId as ETaskStatus;
    const dInd = +destination.droppableId;
    if (sInd === dInd) {
      const items = reorder(state[sInd], source.index, destination.index);
      const newState = { ...state };
      newState[sInd] = items;

      setState(newState);
      return;
    }
    if (+destination.droppableId === BoardColumnStatus.Rejected) {
      setIsRejected(true);
    }
    onOpen();
    setResult(result);
  };

  const handleDrop = async () => {
    const { source, destination } = result as DropResult;
    if (!destination) return;

    const sInd = +source.droppableId as ETaskStatus;
    const dInd = +destination.droppableId as ETaskStatus;

    const results = move(state[sInd], state[dInd], source, destination);

    try {
      setIsLoading(true);
      switch (Number(destination.droppableId)) {
        case BoardColumnStatus.Approved:
          await approveTaskMutation.mutateAsync(
            state[ETaskStatus.Pending][source.index].id
          );
          queryClient.invalidateQueries({
            queryKey: [QueryKeys.FILTER_TASK],
          });
          state[ETaskStatus.Pending][source.index].status = TaskStatus.Approved;
          refetchApproved();
          toast({ title: 'Approved successfully!', status: 'success' });
          break;
        case BoardColumnStatus.Rejected:
          if (!reason) return;
          await rejectTaskMutation.mutateAsync({
            id: state[ETaskStatus.Pending][source.index].id,
            reason,
          });
          queryClient.invalidateQueries({
            queryKey: [QueryKeys.FILTER_TASK],
          });
          state[ETaskStatus.Pending][source.index].status = TaskStatus.Rejected;
          refetchRejected();
          toast({ title: 'Rejected successfully!', status: 'success' });
          break;
        default:
          break;
      }

      const newState = { ...state };
      newState[sInd] = results[sInd];
      newState[dInd] = results[dInd];

      setState(newState);
      handleClose();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setState({
      [ETaskStatus.Pending]: data.listPending.items.filter(
        (x) => x.status === TaskStatus.Pending
      ),
      [ETaskStatus.Approved]: data.listApproved.items.filter(
        (x) => x.status === TaskStatus.Approved
      ),
      [ETaskStatus.Rejected]: data.listRejected.items.filter(
        (x) => x.status === TaskStatus.Rejected
      ),
    });
  }, [data]);

  const showMoreItems = (
    fetchNextPage: FetchNextPageFunction,
    listLength: number,
    totalCount: number
  ) => {
    if (listLength < totalCount) {
      return (
        <Flex w={'100%'} justifyContent={'center'} my={2}>
          <IconButton
            variant="solid"
            aria-label="Call Sage"
            fontSize="20px"
            icon={<HiArrowDown />}
            isRound={true}
            colorScheme="teal"
            onClick={() => fetchNextPage()}
          />
        </Flex>
      );
    }
    return null;
  };

  return (
    <>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className={styles.container}>
          {Object.values(state).map((el, ind) => (
            <Droppable key={ind} droppableId={`${ind}`}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  style={getListStyle(snapshot.isDraggingOver)}
                  {...provided.droppableProps}
                >
                  <div className={styles.columnLabel}>
                    {Object.keys(BoardColumnStatus)[ind]}
                  </div>

                  <Box className={styles.columnContent}>
                    {el.map((item, index) => {
                      const isDisabled =
                        +item.status !== +TaskStatus.Pending ||
                        item?.email !== currentUser?.email;
                      return (
                        <Draggable
                          key={item.id}
                          draggableId={item.id}
                          index={index}
                          isDragDisabled={isDisabled}
                        >
                          {(provided, snapshot) => (
                            <Box
                              cursor={isDisabled ? 'pointer' : 'grab'}
                              onClick={() => {
                                item.id !== null && openModal(item.id);
                              }}
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              style={getItemStyle(
                                snapshot.isDragging,
                                provided.draggableProps.style
                              )}
                            >
                              <div
                                className={`${styles.item} ${
                                  ind === BoardColumnStatus.Pending
                                    ? styles.itemPending
                                    : ind === BoardColumnStatus.Approved
                                    ? styles.itemApproved
                                    : ind === BoardColumnStatus.Rejected
                                    ? styles.itemRejected
                                    : ''
                                }`}
                              >
                                <Flex
                                  justifyContent={'space-between'}
                                  w={'100%'}
                                >
                                  <Text fontWeight={'bold'}>
                                    ID: {item.id.slice(-5).toUpperCase()}
                                  </Text>
                                  {getDayAgo(item?.creationTime)}
                                </Flex>
                                <div className={styles.title}>{item.name}</div>

                                <Flex gap={2}>
                                  <Text>Name:</Text> {item.authorName}
                                </Flex>
                                <Flex gap={2}>
                                  <Text>Assign:</Text> {item.email}
                                </Flex>
                                <div className={styles.stateWrapper}>
                                  <div className={styles.state}>State:</div>
                                  <div className={styles.statusWrapper}>
                                    <div
                                      className={`${styles.status} ${
                                        ind === BoardColumnStatus.Pending
                                          ? styles.statusPending
                                          : ind === BoardColumnStatus.Approved
                                          ? styles.statusApproved
                                          : ind === BoardColumnStatus.Rejected
                                          ? styles.statusRejected
                                          : ''
                                      }`}
                                    />
                                    {Object.keys(BoardColumnStatus)[ind]}
                                  </div>
                                </div>
                                <Flex gap={2}>
                                  <Text>Date:</Text>
                                  {formatDate(new Date(item?.creationTime))}
                                </Flex>
                              </div>
                            </Box>
                          )}
                        </Draggable>
                      );
                    })}

                    {ind === BoardColumnStatus.Pending &&
                      (+status === -1 || +status === TaskStatus.Pending) &&
                      showMoreItems(
                        fetchNextPagePending,
                        data?.listPending?.items?.length,
                        data?.listPending?.totalCount
                      )}
                    {ind === BoardColumnStatus.Approved &&
                      (+status === -1 || +status === TaskStatus.Approved) &&
                      showMoreItems(
                        fetchNextPageApproved,
                        data?.listApproved?.items?.length,
                        data.listApproved?.totalCount
                      )}
                    {ind === BoardColumnStatus.Rejected &&
                      (+status === -1 || +status === TaskStatus.Rejected) &&
                      showMoreItems(
                        fetchNextPageRejected,
                        data?.listRejected?.items?.length,
                        data?.listRejected?.totalCount
                      )}
                  </Box>
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>

      {modalState.taskId.length > 0 && (
        <TaskDetailModal
          isOpen={modalState.isOpen}
          onClose={closeModal}
          taskId={modalState.taskId}
        />
      )}
      <ModalBoard
        isOpen={isOpen}
        onClose={handleClose}
        onConfirm={handleDrop}
        showReason={isRejected}
        setReason={setReason}
        isDisabled={isRejected && !reason}
        isLoading={isLoading}
      />
    </>
  );
};

export default Boards;
