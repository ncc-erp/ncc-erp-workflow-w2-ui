import {
  Box,
  Button,
  Flex,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spinner,
  Text,
  Tooltip,
  keyframes,
  useColorModeValue,
  useDisclosure,
} from '@chakra-ui/react';
import {
  DragDropContext,
  Draggable,
  DropResult,
  Droppable,
} from '@hello-pangea/dnd';
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
  ExternalAction,
  OtherActionSignalStatus,
  TaskStatus,
} from 'common/constants';
import { ETaskStatus } from 'common/enums';
import { useCurrentUser } from 'hooks/useCurrentUser';
import debounce from 'lodash.debounce';
import { FetchNextPageFunction, FilterTasks, ITask } from 'models/task';
import { useEffect, useMemo, useState } from 'react';
import { AiOutlineReload } from 'react-icons/ai';
import { FaAngleDown } from 'react-icons/fa';
import { HiArrowDown } from 'react-icons/hi';
import theme from 'themes/theme';
import { formatDate } from 'utils/formatDate';
import { getAllTaskPagination } from 'utils/getAllTaskPagination';
import { getDayAgo } from 'utils/getDayAgo';
import ModalBoard from './ModalBoard';
import styles from './style.module.scss';
import useBoard from './useBoard';
import TaskSkeleton from './TaskSkeleton';
import { isValidJSON } from 'utils';
import { useClearCacheTask } from './useClearCacheTask';
import { useNavigate } from 'react-router';
import { useMediaQuery } from 'hooks/useMediaQuery';
import TextToolTip from '../textTooltip';

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;
export interface BoardsProps {
  filters: FilterTasks;
  openDetailModal: (task: ITask) => () => void;
  status: number | Array<number>;
}

const Boards = ({ filters, openDetailModal }: BoardsProps): JSX.Element => {
  const isLargeScreen = useMediaQuery('(min-width: 1024px)');
  const [filter, setFilter] = useState<FilterTasks>(filters);
  const [shortTitle, setShortTitle] = useState<string>('');
  const [requestUser, setRequestUser] = useState<string>('');
  const [name, setName] = useState<string>('');
  const actionTaskMutation = useActionTask();

  const {
    data: listPending,
    isLoading: loadPending,
    fetchNextPage: fetchNextPagePending,
    refetch: refetchPending,
    hasNextPage: hasNextPagePending,
    isFetchingNextPage: isFetchingNextPagePending,
  } = useGetAllTask({ ...filter }, TaskStatus.Pending);

  const {
    data: listApproved,
    isLoading: loadApproved,
    fetchNextPage: fetchNextPageApproved,
    refetch: refetchApproved,
    hasNextPage: hasNextPageApproved,
    isFetchingNextPage: isFetchingNextPageApproved,
  } = useGetAllTask({ ...filter }, TaskStatus.Approved);

  const {
    data: listRejected,
    isLoading: loadRejected,
    fetchNextPage: fetchNextPageRejected,
    refetch: refetchRejected,
    hasNextPage: hasNextPageRejected,
    isFetchingNextPage: isFetchingNextPageRejected,
  } = useGetAllTask({ ...filter }, TaskStatus.Rejected);

  const color = useColorModeValue(ColorThemeMode.DARK, ColorThemeMode.LIGHT);
  const bg = useColorModeValue(theme.colors.white, theme.colors.quarty);
  const bgDisabled = useColorModeValue(
    'var(--chakra-colors-blackAlpha-100)',
    theme.colors.blackBorder[600]
  );
  const buttonHover = useColorModeValue('gray.200', theme.colors.white);

  const [result, setResult] = useState<DropResult>();
  const [isRejected, setIsRejected] = useState<boolean>(false);
  const [dynamicForm, setDynamicForm] = useState({
    hasDynamicForm: false,
    dynamicForm: '',
  });

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
  const approveTaskMutation = useApproveTask();
  const rejectTaskMutation = useRejectTask();
  const { reorder, move, getItemStyle, getListStyle } = useBoard();
  const currentUser = useCurrentUser();
  const { clear } = useClearCacheTask();
  const handleClose = () => {
    onClose();
    setIsRejected(false);
    setReason('');
    setDynamicForm({
      hasDynamicForm: false,
      dynamicForm: '',
    });
    history.pushState({}, '', window.location.href.split('?')[0]);
  };

  const onDragEnd = async (result: DropResult) => {
    const { destination, source } = result;
    if (!destination) return;
    const sInd = +source.droppableId as ETaskStatus;
    const dInd = +destination.droppableId;

    const shortTitleSelect = state[sInd][source.index].title;
    const requestUserSelect = state[sInd][source.index].authorName || '';
    const nameSelect = state[sInd][source.index].name;

    if (sInd === dInd) {
      const items = reorder(state[sInd], source.index, destination.index);
      const newState = { ...state };
      newState[sInd] = items;

      setState(newState);
      return;
    }
    if (
      +destination.droppableId === BoardColumnStatus.Approved &&
      isValidJSON(state[sInd][source.index].dynamicActionData)
    ) {
      setDynamicForm({
        hasDynamicForm: true,
        dynamicForm: state[sInd][source.index].dynamicActionData || '',
      });
    }
    if (+destination.droppableId === BoardColumnStatus.Rejected) {
      setIsRejected(true);
    }
    onOpen();
    setResult(result);
    setShortTitle(shortTitleSelect);
    setRequestUser(requestUserSelect);
    setName(nameSelect);
  };

  const handleDrop = async (approvedData?: string) => {
    const { source, destination } = result as DropResult;
    if (!destination) return;

    const sInd = +source.droppableId as ETaskStatus;
    const dInd = +destination.droppableId as ETaskStatus;

    const results = move(state[sInd], state[dInd], source, destination);
    const statusDrop = Number(destination.droppableId);
    try {
      state[ETaskStatus.Pending][source.index].status = statusDrop;
      const dynamicData = state[sInd][source.index].dynamicActionData;
      const newState = { ...state };
      newState[sInd] = results[sInd];
      newState[dInd] = results[dInd];
      setState(newState);
      handleClose();
      switch (statusDrop) {
        case BoardColumnStatus.Approved:
          approveTask(
            state[ETaskStatus.Pending][source.index].id,
            approvedData ?? dynamicData
          );
          break;
        case BoardColumnStatus.Rejected:
          if (!reason) return;
          rejectTask(state[ETaskStatus.Pending][source.index].id);
          break;
        default:
          break;
      }
    } catch (error) {
      refetchPending();
      refetchApproved();
      refetchRejected();
      console.error(error);
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

  useEffect(() => {
    refetchPending(), refetchApproved(), refetchRejected();
  }, [refetchPending, refetchApproved, refetchRejected]);

  const onActionClick = async (id: string, action: string) => {
    try {
      setIsActionLoading({
        isLoading: true,
        id,
      });
      await actionTaskMutation.mutateAsync({ id, action });
      toast({
        title: `Send action successfully!`,
        status: 'success',
      });
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

  const loadingStates = useMemo(() => {
    return [
      { name: 'loadPending', value: loadPending || isLoading },
      { name: 'loadApproved', value: loadApproved || isLoading },
      { name: 'loadRejected', value: loadRejected || isLoading },
    ];
  }, [loadPending, isLoading, loadApproved, loadRejected]);

  const showMoreItems = (
    fetchNextPage: FetchNextPageFunction,
    hasNextPage?: boolean,
    isLoading?: boolean
  ) => {
    if (hasNextPage) {
      return (
        <Flex w={'100%'} justifyContent={'center'} my={2}>
          <IconButton
            isLoading={isLoading}
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

  const [isExternal, setIsExternal] = useState<boolean>(false);

  const rejectTask = async (id: string | null) => {
    if (!reason) return;
    await rejectTaskMutation
      .mutateAsync({
        id: id as string,
        reason,
      })
      .then(() => {
        toast({ title: 'Rejected Task Successfully!', status: 'success' });
      })
      .catch((error) => {
        console.error(error.response.data.error.message);
      });
    clear();
    refetchRejected();
    refetchPending();
  };

  const approveTask = async (
    id: string | null,
    approvedData?: string | null
  ) => {
    await approveTaskMutation
      .mutateAsync({
        id: id as string,
        dynamicActionData: approvedData,
      })
      .then(() => {
        toast({ title: 'Approved Task Successfully!', status: 'success' });
      })
      .catch((error) => {
        console.error(error.response.data.error.message);
      });
    clear();
    refetchApproved();
    refetchPending();
  };

  const searchParams = new URLSearchParams(window.location.search);
  const id = searchParams.get('id');
  const action = searchParams.get('action');
  const dynamicInput = searchParams.get('input');
  const navigate = useNavigate();

  const handleConfirmExternal = (approvedData?: string) => {
    try {
      switch (action) {
        case ExternalAction.APPROVED:
          approveTask(id, approvedData ?? dynamicInput);
          break;

        case ExternalAction.REJECTED:
          rejectTask(id);
          break;

        case ExternalAction.OTHER:
          if (!id || !dynamicInput) return;
          onActionClick(id, dynamicInput);
          break;
      }
      handleClose();
    } catch (error) {
      handleClose();
      refetchPending();
      refetchApproved();
      refetchRejected();
      console.error(error);
    }
  };

  useEffect(() => {
    const checkPermissionConfirmTask = (taskId: string) => {
      return listPending?.pages?.[0]?.items?.find(function (item: ITask) {
        return item?.id === taskId;
      });
    };

    if (!id || !action || loadPending) {
      return;
    }

    if (!checkPermissionConfirmTask(id)) {
      toast({ title: "you don't have permission!", status: 'error' });
      return navigate('/request-templates');
    }

    switch (action) {
      case ExternalAction.APPROVED:
        if (dynamicInput && isValidJSON(dynamicInput)) {
          setDynamicForm({
            hasDynamicForm: true,
            dynamicForm: dynamicInput ?? '',
          });
        }
        break;

      case ExternalAction.REJECTED:
        setIsRejected(true);
        break;
    }

    setIsExternal(true);
    onOpen();
  }, [id, action, dynamicInput, onOpen, loadPending, listPending, navigate]);

  const getQuantityTasks = (ind: number) => {
    let result = '';

    if (
      BoardColumnStatus.Pending === ind &&
      (listPending?.pages?.[0]?.totalCount as number) > 0 &&
      (filters.status == -1 || filters.status == TaskStatus.Pending)
    ) {
      result = ` (${listPending?.pages?.[0]?.totalCount})`;
    }
    if (
      BoardColumnStatus.Approved === ind &&
      (listApproved?.pages?.[0]?.totalCount as number) > 0 &&
      (filters.status == -1 || filters.status == TaskStatus.Approved)
    ) {
      result = ` (${listApproved?.pages?.[0]?.totalCount})`;
    }
    if (
      BoardColumnStatus.Rejected === ind &&
      (listRejected?.pages?.[0]?.totalCount as number) > 0 &&
      (filters.status == -1 || filters.status == TaskStatus.Rejected)
    ) {
      result = ` (${listRejected?.pages?.[0]?.totalCount})`;
    }

    return result;
  };

  const formatShortId = (id: string) => {
    return id.slice(0, 5);
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
          onClick={debounce(async () => {
            if (!filter.status) return;
            setIsLoading(true);
            try {
              switch (+filter?.status) {
                case TaskStatus.Pending:
                  await refetchPending();
                  break;
                case TaskStatus.Approved:
                  await refetchApproved();
                  break;
                case TaskStatus.Rejected:
                  await refetchRejected();
                  break;
                default:
                  await Promise.all([
                    refetchPending(),
                    refetchApproved(),
                    refetchRejected(),
                  ]);
                  break;
              }
            } catch (error) {
              console.log(error);
            } finally {
              setIsLoading(false);
            }
          }, 200)}
        />

        <DragDropContext onDragEnd={onDragEnd}>
          <Box
            className={styles.container}
            p={isLargeScreen ? '10px 24px' : '10px 3px'}
          >
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
                      {getQuantityTasks(ind)}
                    </div>

                    <Box className={styles.columnContent}>
                      {!loadingStates[ind].value &&
                      !rejectTaskMutation.isLoading &&
                      !approveTaskMutation.isLoading &&
                      !loadPending &&
                      !loadApproved &&
                      !loadRejected ? (
                        el.map((item, index) => {
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
                                  position={'relative'}
                                  cursor={isDisabled ? 'pointer' : 'grab'}
                                  onClick={() => {
                                    item.id !== null && openDetailModal(item)();
                                  }}
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  style={getItemStyle(
                                    provided.draggableProps.style
                                  )}
                                  borderRadius={4}
                                  transition={'all ease-in-out 0.1s'}
                                  _hover={{
                                    boxShadow:
                                      'rgba(0, 0, 0, 0.15) 3px 3px 4px',
                                  }}
                                >
                                  <Box
                                    animation={`${fadeIn} 1s cubic-bezier(0.390, 0.575, 0.565, 1.000)`}
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
                                      background: isDisabled ? bgDisabled : bg,
                                    }}
                                  >
                                    <Flex
                                      justifyContent={'space-between'}
                                      alignItems={'flex-start'}
                                      w={'100%'}
                                    >
                                      <Box style={{ flex: 1 }}>
                                        <TextToolTip
                                          maxLines={1}
                                          title={item.title}
                                          id={formatShortId(item.id)}
                                          type="BOARD"
                                        />
                                      </Box>

                                      <Box>
                                        <div>
                                          ({getDayAgo(item?.creationTime)})
                                        </div>
                                      </Box>
                                    </Flex>

                                    <Flex gap={2}>
                                      <Text>Request user:</Text>
                                      <Tooltip label={item.email}>
                                        <div>{item.authorName}</div>
                                      </Tooltip>
                                    </Flex>
                                    <Flex gap={2}>
                                      <Text>Current State:</Text>
                                      {item.description}
                                    </Flex>
                                    <Flex
                                      style={{
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                        width: '100%',
                                        alignItems: 'center',
                                      }}
                                    >
                                      <Flex gap={2}>
                                        <Text>Assign:</Text>
                                        {item.emailTo
                                          .map((email) => email.split('@')[0])
                                          .join(', ')}
                                      </Flex>
                                      {item.status === TaskStatus.Pending &&
                                        item.otherActionSignals &&
                                        item?.otherActionSignals?.length >
                                          0 && (
                                          <Flex
                                            className={`${styles.menuButton} ${styles.btn}`}
                                          >
                                            {isActionLoading.isLoading &&
                                              isActionLoading.id ===
                                                item.id && (
                                                <Spinner size="xs" />
                                              )}
                                            <Menu>
                                              <MenuButton
                                                className={styles.menuButton}
                                                fontSize={12}
                                                as={Button}
                                                aria-label="Options"
                                                color={'#03A9F4'}
                                                padding={1}
                                                height="fit-content"
                                                bgColor={bg}
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                }}
                                                rightIcon={<FaAngleDown />}
                                                _hover={{ bg: buttonHover }}
                                                iconSpacing={1}
                                              >
                                                More Actions
                                              </MenuButton>
                                              <MenuList>
                                                {item.otherActionSignals.map(
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
                                                )}
                                              </MenuList>
                                            </Menu>
                                          </Flex>
                                        )}
                                    </Flex>
                                    <Flex className={styles.cardFooter}>
                                      <Flex gap={2}>
                                        <Text>Date:</Text>
                                        {formatDate(
                                          new Date(item?.creationTime)
                                        )}
                                      </Flex>
                                      <div
                                        className={styles.title}
                                        style={{
                                          backgroundColor:
                                            item?.settings?.color ?? '#aabbcc',
                                        }}
                                      >
                                        {item.name}
                                      </div>
                                    </Flex>
                                  </Box>
                                </Box>
                              )}
                            </Draggable>
                          );
                        })
                      ) : (
                        <>
                          <TaskSkeleton />
                          <TaskSkeleton />
                          <TaskSkeleton />
                        </>
                      )}
                      {ind === BoardColumnStatus.Pending &&
                        !loadingStates[ind].value &&
                        state[ETaskStatus.Pending].length > 0 &&
                        showMoreItems(
                          fetchNextPagePending,
                          hasNextPagePending,
                          isFetchingNextPagePending
                        )}
                      {ind === BoardColumnStatus.Approved &&
                        !loadingStates[ind].value &&
                        state[ETaskStatus.Approved].length > 0 &&
                        showMoreItems(
                          fetchNextPageApproved,
                          hasNextPageApproved,
                          isFetchingNextPageApproved
                        )}
                      {ind === BoardColumnStatus.Rejected &&
                        !loadingStates[ind].value &&
                        state[ETaskStatus.Rejected].length > 0 &&
                        showMoreItems(
                          fetchNextPageRejected,
                          hasNextPageRejected,
                          isFetchingNextPageRejected
                        )}
                    </Box>
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            ))}
          </Box>
        </DragDropContext>
      </Box>
      <ModalBoard
        shortTitle={shortTitle}
        isOpen={isOpen}
        onClose={handleClose}
        onConfirm={isExternal ? handleConfirmExternal : handleDrop}
        showReason={isRejected}
        setReason={setReason}
        showDynamicForm={dynamicForm.hasDynamicForm}
        dynamicForm={dynamicForm.dynamicForm}
        isDisabled={isRejected && !reason}
        isLoading={isLoading}
        name={name}
        requestUser={requestUser}
      />
    </>
  );
};

export default Boards;
