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
import { Box, Flex, IconButton, Text, useDisclosure } from '@chakra-ui/react';
import { ModalConfirm } from '../ModalConfirm';
import { FetchNextPageFunction, ITask, TaskResult } from 'models/task';
import { useApproveTask, useRejectTask } from 'api/apiHooks/taskHooks';
import ModalBoard from './ModalBoard';
import { ETaskStatus } from 'common/enums';
import { useCurrentUser } from 'hooks/useCurrentUser';
import { formatDate } from 'utils/formatDate';
import { getDayAgo } from 'utils/getDayAgo';
import { HiArrowDown } from 'react-icons/hi';

interface ModalStatus {
  isOpen: boolean;
  title: string;
  description: string;
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
  status: number;
}

const initialModalStatus: ModalStatus = {
  isOpen: false,
  title: 'Modal Title',
  description: 'Modal Description',
};

const Boards = ({
  data,
  fetchNextPageApproved,
  fetchNextPagePending,
  fetchNextPageRejected,
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
                          <Box
                            cursor="pointer"
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
                              })}
                            >
                              <Flex justifyContent={'space-between'} w={'100%'}>
                                <div className="content">
                                  ID: {item.id.slice(-5).toUpperCase()}
                                </div>
                                {getDayAgo(item.creationTime)}
                              </Flex>
                              <div className="title">{item.name}</div>

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
                                  {formatDate(new Date(item?.creationTime))}
                                </Text>
                              </div>
                            </div>
                          </Box>
                        )}
                      </Draggable>
                    ))}

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
