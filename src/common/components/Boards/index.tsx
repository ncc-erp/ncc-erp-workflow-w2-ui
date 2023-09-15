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
import { ModalConfirm } from '../ModalConfirm';
import { Box, useDisclosure } from '@chakra-ui/react';
import { ITask, TaskResult } from 'models/task';
import {
  useApproveTask,
  useCancelTask,
  useRejectTask,
} from 'api/apiHooks/taskHooks';
import ModalBoard from './ModalBoard';

interface BoardsProps {
  data: TaskResult;
}

interface ModalStatus {
  isOpen: boolean;
  title: string;
  description: string;
}

const initialModalStatus: ModalStatus = {
  isOpen: false,
  title: 'Modal Title',
  description: 'Modal Description',
};

const Boards = ({ data }: BoardsProps): JSX.Element => {
  const [modalState, setModalState] = useState(initialModalStatus);
  const [result, setResult] = useState<DropResult>();
  const [isRejected, setIsRejected] = useState<boolean>(false);
  const [reason, setReason] = useState<string>('');
  const [state, setState] = useState<ITask[][]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const queryClient = useQueryClient();
  const cancelTaskMutation = useCancelTask();
  const approveTaskMutation = useApproveTask();
  const rejectTaskMutation = useRejectTask();
  const { reorder, move, getItemStyle, getListStyle } = useBoard();

  const openModal = (title: string, description: string) => {
    setModalState({
      ...modalState,
      isOpen: true,
      title,
      description,
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
    const sInd = +source.droppableId;
    const dInd = +destination.droppableId;
    if (sInd === dInd) {
      const items = reorder(state[sInd], source.index, destination.index);
      const newState = [...state];
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

    const sInd = +source.droppableId;
    const dInd = +destination.droppableId;

    const results = move(state[sInd], state[dInd], source, destination);

    try {
      setIsLoading(true);
      switch (Number(destination.droppableId)) {
        case BoardColumnStatus.Canceled:
          await cancelTaskMutation.mutateAsync(
            state[Number(source.droppableId)][source.index].id
          );
          queryClient.invalidateQueries({
            queryKey: [QueryKeys.FILTER_TASK],
          });
          toast({ title: 'Cancelled successfully!', status: 'success' });
          break;
        case BoardColumnStatus.Approved:
          await approveTaskMutation.mutateAsync(
            state[Number(source.droppableId)][source.index].id
          );
          queryClient.invalidateQueries({
            queryKey: [QueryKeys.FILTER_TASK],
          });
          toast({ title: 'Approved successfully!', status: 'success' });
          break;
        case BoardColumnStatus.Rejected:
          if (!reason) return;
          await rejectTaskMutation.mutateAsync({
            id: state[Number(source.droppableId)][source.index].id,
            reason,
          });
          queryClient.invalidateQueries({
            queryKey: [QueryKeys.FILTER_TASK],
          });
          toast({ title: 'Rejected successfully!', status: 'success' });
          break;
        default:
          break;
      }
    } catch (error) {
      console.error(error);
      return;
    } finally {
      setIsLoading(false);
    }

    const newState = [...state];
    newState[sInd] = results[sInd];
    newState[dInd] = results[dInd];

    setState(newState);
    handleClose();
  };

  useEffect(() => {
    setState([
      [...data.items].filter((x) => x.status === TaskStatus.Pending),
      [...data.items].filter((x) => x.status === TaskStatus.Approved),
      [...data.items].filter((x) => x.status === TaskStatus.Rejected),
      [...data.items].filter((x) => x.status === TaskStatus.Canceled),
    ]);
  }, [data]);

  return (
    <>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="container">
          {state.map((el, ind) => (
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
                        isDragDisabled={+item.status !== +TaskStatus.Pending}
                      >
                        {(provided, snapshot) => (
                          <div
                            onClick={() =>
                              openModal(
                                `${item.name} no: ${item.id
                                  .slice(-5)
                                  .toUpperCase()}`,
                                'Content to Something'
                              )
                            }
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
                                itemCanceled:
                                  ind === BoardColumnStatus.Canceled,
                              })}
                            >
                              <div>
                                <div className="content">
                                  ID: {item.id.slice(-5).toUpperCase()}
                                </div>
                                <div className="title">{item.name}</div>
                              </div>

                              <div className="person">{item.email}</div>

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
                                      statusCanceled:
                                        ind === BoardColumnStatus.Canceled,
                                    })}
                                  />
                                  {Object.keys(BoardColumnStatus)[ind]}
                                </div>
                              </div>

                              {/* <div className="timestamp">
                                Date:{' '}
                                {format(
                                  new Date(item.createdAt),
                                  'dd-MM-yyyy HH:mm'
                                )}
                              </div> */}
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

      <ModalConfirm
        isOpen={modalState.isOpen}
        onClose={closeModal}
        onConfirm={closeModal}
        title={modalState.title}
        description={modalState.description}
      />
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
