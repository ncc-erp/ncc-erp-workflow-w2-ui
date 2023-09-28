import {
  Box,
  Center,
  Flex,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spinner,
  Text,
  useColorModeValue,
  useDisclosure,
} from '@chakra-ui/react';
import {
  DragDropContext,
  Draggable,
  DropResult,
  Droppable,
} from '@hello-pangea/dnd';
import { useQueryClient } from '@tanstack/react-query';
import {
  useActionTask,
  useApproveTask,
  useGetAllTask,
  useRejectTask,
} from 'api/apiHooks/taskHooks';
import { toast } from 'common/components/StandaloneToast';
import {
  BoardColumnStatus,
  ColorThemeMode,
  OtherActionSignalStatus,
  QueryKeys,
  TaskStatus,
} from 'common/constants';
import { ETaskStatus } from 'common/enums';
import { useCurrentUser } from 'hooks/useCurrentUser';
import debounce from 'lodash.debounce';
import { FetchNextPageFunction, FilterTasks, ITask } from 'models/task';
import { useEffect, useState } from 'react';
import { AiOutlineMenu, AiOutlineReload } from 'react-icons/ai';
import { HiArrowDown } from 'react-icons/hi';
import theme from 'themes/theme';
import { formatDate } from 'utils/formatDate';
import { getAllTaskPagination } from 'utils/getAllTaskPagination';
import { getDayAgo } from 'utils/getDayAgo';
import ModalBoard from './ModalBoard';
import styles from './style.module.scss';
import useBoard from './useBoard';

export interface BoardsProps {
  filters: FilterTasks;
  openDetailModal: (id: string) => void;
  status: number;
}

const Boards = ({
  filters,
  openDetailModal,
  status,
}: BoardsProps): JSX.Element => {
  const [filter, setFilter] = useState<FilterTasks>(filters);
  const actionTaskMutation = useActionTask();
  const {
    data: listPending,
    isLoading: loadPending,
    fetchNextPage: fetchNextPagePending,
    refetch: refetchPending,
    isRefetching: isRefetchingPending,
    hasNextPage: hasNextPagePending,
  } = useGetAllTask({ ...filter }, TaskStatus.Pending);
  const {
    data: listApproved,
    isLoading: loadApproved,
    fetchNextPage: fetchNextPageApproved,
    refetch: refetchApproved,
    isRefetching: isRefetchingApproved,
    hasNextPage: hasNextPageApproved,
  } = useGetAllTask({ ...filter }, TaskStatus.Approved);
  const {
    data: listRejected,
    isLoading: loadRejected,
    fetchNextPage: fetchNextPageRejected,
    refetch: refetchRejected,
    isRefetching: isRefetchingRejected,
    hasNextPage: hasNextPageRejected,
  } = useGetAllTask({ ...filter }, TaskStatus.Rejected);
  const color = useColorModeValue(ColorThemeMode.DARK, ColorThemeMode.LIGHT);
  const bg = useColorModeValue(theme.colors.white, theme.colors.quarty);
  const borderColor = useColorModeValue(
    theme.colors.blackBorder[500],
    theme.colors.blackBorder[600]
  );

  const [result, setResult] = useState<DropResult>();
  const [isRejected, setIsRejected] = useState<boolean>(false);
  const [reason, setReason] = useState<string>('');
  const [state, setState] = useState<Record<ETaskStatus, ITask[]>>({
    [ETaskStatus.Pending]: [],
    [ETaskStatus.Approved]: [],
    [ETaskStatus.Rejected]: [],
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isActionLoading, setIsActionLoading] = useState({
    isLoading: false,
    id: '',
  });

  const { isOpen, onOpen, onClose } = useDisclosure();
  const queryClient = useQueryClient();
  const approveTaskMutation = useApproveTask();
  const rejectTaskMutation = useRejectTask();
  const { reorder, move, getItemStyle, getListStyle } = useBoard();
  const currentUser = useCurrentUser();

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
      [ETaskStatus.Pending]: getAllTaskPagination(
        listPending ? listPending?.pages : []
      ).items.filter((x) => x.status === TaskStatus.Pending),
      [ETaskStatus.Approved]: getAllTaskPagination(
        listApproved ? listApproved?.pages : []
      ).items.filter((x) => x.status === TaskStatus.Approved),
      [ETaskStatus.Rejected]: getAllTaskPagination(
        listRejected ? listRejected?.pages : []
      ).items.filter((x) => x.status === TaskStatus.Rejected),
    });
  }, [listApproved, listPending, listRejected]);

  useEffect(() => {
    setFilter(filters);
  }, [filters]);

  const onActionClick = async (id: string, action: string) => {
    try {
      setIsActionLoading({
        isLoading: true,
        id,
      });
      await actionTaskMutation.mutateAsync({ id, action });
      toast({ title: 'Send action successfully!', status: 'success' });
      refetchPending();
    } catch (error) {
      console.error(error);
    } finally {
      setIsActionLoading({
        isLoading: false,
        id: '',
      });
    }
  };

  const showMoreItems = (
    fetchNextPage: FetchNextPageFunction,
    hasNextPage?: boolean
  ) => {
    if (hasNextPage) {
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
          onClick={debounce(() => {
            if (!filter.status) return;
            switch (+filter?.status) {
              case TaskStatus.Pending:
                refetchPending();
                break;
              case TaskStatus.Approved:
                refetchApproved();
                break;
              case TaskStatus.Rejected:
                refetchRejected();
                break;
              default:
                refetchPending();
                refetchApproved();
                refetchRejected();
                break;
            }
          }, 200)}
        />
        {!(
          loadApproved ||
          loadPending ||
          loadRejected ||
          isRefetchingPending ||
          isRefetchingApproved ||
          isRefetchingRejected
        ) ? (
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
                      <div
                        className={styles.columnLabel}
                        style={{ color: color, backgroundColor: bg }}
                      >
                        {Object.keys(BoardColumnStatus)[ind]}
                      </div>

                      <Box className={styles.columnContent}>
                        {el.map((item, index) => {
                          const isDisabled =
                            +item.status !== +TaskStatus.Pending ||
                            !item?.emailTo.includes(currentUser?.email);
                          return (
                            <Draggable
                              key={item.id}
                              draggableId={item.id}
                              index={index}
                              isDragDisabled={isDisabled}
                            >
                              {(provided) => (
                                <Box
                                  cursor={isDisabled ? 'pointer' : 'grab'}
                                  onClick={() => {
                                    item.id !== null &&
                                      openDetailModal(item.id);
                                  }}
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  style={getItemStyle(
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
                                    style={{
                                      background: bg,
                                      border: `1px solid ${borderColor}`,
                                    }}
                                  >
                                    <Flex
                                      justifyContent={'space-between'}
                                      alignItems={'center'}
                                      w={'100%'}
                                    >
                                      <Flex>
                                        <Text fontWeight={'bold'} mr={1}>
                                          ID: {item.id.slice(-5).toUpperCase()}
                                        </Text>
                                        <div>
                                          ({getDayAgo(item?.creationTime)})
                                        </div>
                                      </Flex>

                                      {item.status === TaskStatus.Pending && (
                                        <div className={styles.menuButton}>
                                          {isActionLoading.isLoading &&
                                            isActionLoading.id === item.id && (
                                              <Spinner size="xs" />
                                            )}
                                          <Menu>
                                            <MenuButton
                                              className={styles.menuButton}
                                              maxH="20px"
                                              maxW="20px"
                                              fontSize={16}
                                              as={IconButton}
                                              aria-label="Options"
                                              icon={<AiOutlineMenu />}
                                              variant="outline"
                                              onClick={(e) => {
                                                e.stopPropagation();
                                              }}
                                            >
                                              Actions
                                            </MenuButton>
                                            <MenuList>
                                              {item.otherActionSignals &&
                                              item?.otherActionSignals?.length >
                                                0 ? (
                                                item.otherActionSignals.map(
                                                  (el, index) => {
                                                    return (
                                                      <MenuItem
                                                        isDisabled={
                                                          el.status !==
                                                          OtherActionSignalStatus.PENDING
                                                        }
                                                        key={index}
                                                        onClick={(e) => {
                                                          e.stopPropagation();
                                                          onActionClick(
                                                            item.id,
                                                            el.otherActionSignal
                                                          );
                                                        }}
                                                      >
                                                        {el.otherActionSignal}
                                                      </MenuItem>
                                                    );
                                                  }
                                                )
                                              ) : (
                                                <MenuItem
                                                  isDisabled={true}
                                                  onClick={(e) => {
                                                    e.stopPropagation();
                                                  }}
                                                >
                                                  No action
                                                </MenuItem>
                                              )}
                                            </MenuList>
                                          </Menu>
                                        </div>
                                      )}
                                    </Flex>
                                    <div className={styles.title}>
                                      {item.name}
                                    </div>

                                    <Flex gap={2}>
                                      <Text>Name:</Text> {item.authorName}
                                    </Flex>
                                    <Flex gap={2}>
                                      <Text>Assign:</Text>
                                      {item.emailTo
                                        .map((email) => email.split('@')[0])
                                        .join(', ')}
                                    </Flex>
                                    <div className={styles.stateWrapper}>
                                      <div className={styles.state}>State:</div>
                                      <div className={styles.statusWrapper}>
                                        <div
                                          className={`${styles.status} ${
                                            ind === BoardColumnStatus.Pending
                                              ? styles.statusPending
                                              : ind ===
                                                BoardColumnStatus.Approved
                                              ? styles.statusApproved
                                              : ind ===
                                                BoardColumnStatus.Rejected
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
                            hasNextPagePending
                          )}
                        {ind === BoardColumnStatus.Approved &&
                          (+status === -1 || +status === TaskStatus.Approved) &&
                          showMoreItems(
                            fetchNextPageApproved,
                            hasNextPageApproved
                          )}
                        {ind === BoardColumnStatus.Rejected &&
                          (+status === -1 || +status === TaskStatus.Rejected) &&
                          showMoreItems(
                            fetchNextPageRejected,
                            hasNextPageRejected
                          )}
                      </Box>
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              ))}
            </div>
          </DragDropContext>
        ) : (
          <Center h="200px">
            <Spinner mx="auto" speed="0.65s" thickness="3px" size="xl" />
          </Center>
        )}
      </Box>
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
