import {
  DragDropContext,
  Draggable,
  DropResult,
  Droppable,
} from '@hello-pangea/dnd';
import { useEffect, useState } from 'react';

import { useQueryClient } from '@tanstack/react-query';
import classNames from 'classnames';
import { toast } from 'common/components/StandaloneToast';
import { BoardColumnStatus, QueryKeys, TaskStatus } from 'common/constants';
import './style.css';
import useBoard from './useBoard';
import { Box, Text, useDisclosure } from '@chakra-ui/react';
import { ITask } from 'models/task';
import { useApproveTask, useRejectTask } from 'api/apiHooks/taskHooks';
import ModalBoard from './ModalBoard';
import { ETaskStatus } from 'common/enums';
import { TaskDetailModal } from 'features/Tasks/components/TaskDetailModal';
import { useCurrentUser } from 'hooks/useCurrentUser';
import { formatDate } from 'utils/formatDate';

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
        <div className="container">
          {Object.values(state).map((el, ind) => (
            <Droppable key={ind} droppableId={`${ind}`}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  style={getListStyle(snapshot.isDraggingOver)}
                  {...provided.droppableProps}
                >
                  <div className="columnLabel">
                    {Object.keys(BoardColumnStatus)[ind]}
                  </div>

                  <Box className="columnContent">
                    {el.map((item, index) => (
                      <Draggable
                        key={item.id}
                        draggableId={item.id}
                        index={index}
                        isDragDisabled={
                          +item.status !== +TaskStatus.Pending ||
                          item?.email !== currentUser?.email
                        }
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
                              className={classNames('item', {
                                itemPending: ind === BoardColumnStatus.Pending,
                                itemApproved:
                                  ind === BoardColumnStatus.Approved,
                                itemRejected:
                                  ind === BoardColumnStatus.Rejected,
                              })}
                            >
                              <div>
                                <div className="content">
                                  ID: {item.id.slice(-5).toUpperCase()}
                                </div>
                                <div className="title">{item.name}</div>
                              </div>

                              <div className="timestamp">
                                Email:
                                <Text className="ellipsis-text">
                                  {item?.email}
                                </Text>
                              </div>
                              <div className="stateWrapper">
                                <div className="state">State:</div>
                                <div className="statusWrapper">
                                  <div
                                    className={classNames('status', {
                                      statusPending:
                                        ind === BoardColumnStatus.Pending,
                                      statusApproved:
                                        ind === BoardColumnStatus.Approved,
                                      statusRejected:
                                        ind === BoardColumnStatus.Rejected,
                                    })}
                                  />
                                  {Object.keys(BoardColumnStatus)[ind]}
                                </div>
                              </div>

                              <div className="timestamp">
                                Date:
                                <Text>
                                  {formatDate(new Date(item.createdAt))}
                                </Text>
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
