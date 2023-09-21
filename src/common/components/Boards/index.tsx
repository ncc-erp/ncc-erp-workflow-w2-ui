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
import { Box, useDisclosure } from '@chakra-ui/react';
import { ITask } from 'models/task';
import { useApproveTask, useRejectTask } from 'api/apiHooks/taskHooks';
import ModalBoard from './ModalBoard';
import { ETaskStatus } from 'common/enums';
import { TaskDetailModal } from 'features/Tasks/components/TaskDetailModal';

interface BoardsProps {
  data: ITask[];
  totalCount: number;
}

interface ModalDetail {
  isOpen: boolean;
  taskId: string;
}

const initialModalStatus: ModalDetail = {
  isOpen: false,
  taskId: '',
};

const Boards = ({ data }: BoardsProps): JSX.Element => {
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
      [ETaskStatus.Pending]: data.filter(
        (x) => x.status === TaskStatus.Pending
      ),
      [ETaskStatus.Approved]: data.filter(
        (x) => x.status === TaskStatus.Approved
      ),
      [ETaskStatus.Rejected]: data.filter(
        (x) => x.status === TaskStatus.Rejected
      ),
    });
  }, [data]);

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
                    {el.map((item, index) => (
                      <Draggable
                        key={item.id}
                        draggableId={item.id}
                        index={index}
                        isDragDisabled={+item.status !== +TaskStatus.Pending}
                      >
                        {(provided, snapshot) => (
                          <div
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
                                  : ind === BoardColumnStatus.Canceled
                                  ? styles.itemCanceled
                                  : ''
                              }`}
                            >
                              <div>
                                <div className={styles.content}>
                                  ID: {item.id.slice(-5).toUpperCase()}
                                </div>
                                <div className={styles.title}>{item.name}</div>
                              </div>

                              <div className={styles.person}>{item.email}</div>

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
                                        : ind === BoardColumnStatus.Canceled
                                        ? styles.statusCanceled
                                        : ''
                                    }`}
                                  />
                                  {Object.keys(BoardColumnStatus)[ind]}
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
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
