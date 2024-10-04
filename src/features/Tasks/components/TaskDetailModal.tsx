import {
  Button,
  Divider,
  HStack,
  Heading,
  Image,
  List,
  ListItem,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Text,
} from '@chakra-ui/react';
import {
  useActionTask,
  useApproveTask,
  useGetAllTask,
  useGetTaskDetail,
  useRejectTask,
} from 'api/apiHooks/taskHooks';
import Logo from 'assets/images/ncc_logo.png';
import { toast } from 'common/components/StandaloneToast';
import { TextGroup } from 'common/components/TextGroup/TextGroup';
import { WorkflowModal } from 'common/components/WorkflowModal';
import {
  DEFAULT_TASK_PER_PAGE,
  OtherActionSignalStatus,
  TaskStatus,
  UPDATED_BY_W2,
} from 'common/constants';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  convertToCase,
  formatDate,
  getStatusByIndex,
  isObjectEmpty,
  subtractTime,
} from 'utils';
import { RequestInput } from './RequestInput';
import { IOtherTasks } from './TasksBoard';
import styles from './style.module.scss';
import { RequestStatus } from 'common/enums';
import { useUserList } from 'api/apiHooks/requestHooks';
import { removeDiacritics } from 'utils/removeDiacritics';
import { BiPencil } from 'react-icons/bi';
import ModalBoard from 'common/components/Boards/ModalBoard';
import { useClearCacheTask } from 'common/components/Boards/useClearCacheTask';
import { FilterTasks } from 'models/task';
import { useCurrentUser } from 'hooks/useCurrentUser';

const initialFilter: FilterTasks = {
  skipCount: 0,
  maxResultCount: DEFAULT_TASK_PER_PAGE,
  workflowDefinitionId: '',
  status: -1,
  dates: subtractTime('months', 1),
  emailRequest: '',
  emailAssign: '',
};

interface IDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  taskId: string;
  otherTasks?: IOtherTasks;
}

interface IDynamicDataProps {
  [key: string]: string;
}

interface IDynamicReviewProps {
  title: string;
  items: IDynamicDataProps[];
}

export const TaskDetailModal = ({
  isOpen,
  onClose,
  taskId,
  otherTasks,
}: IDetailModalProps) => {
  const { data: users } = useUserList();
  const actionTaskMutation = useActionTask();
  const {
    data,
    refetch,
    isLoading: hasGetTaskLoading,
  } = useGetTaskDetail(taskId);

  const [isLoading, setIsLoading] = useState(false);
  const approveTaskMutation = useApproveTask();
  const rejectTaskMutation = useRejectTask();
  const { clear } = useClearCacheTask();
  const user = useCurrentUser();
  const [isLoadingBtnApprove, setIsLoadingBtnApprove] = useState(false);
  const [isLoadingBtnReject, setIsLoadingBtnReject] = useState(false);
  const [loadStatus] = useState<boolean>(false);
  const [isRejected, setIsRejected] = useState<boolean>(false);

  const [requestWorkflow, setRequestWorkflow] = useState<string>('');
  const [isOpenWorkflow, setOpenWorkflow] = useState(false);

  const onActionViewWorkflow = (workflowId: string) => () => {
    setRequestWorkflow(workflowId);
    setOpenWorkflow(true);
  };

  const [filter] = useState<FilterTasks>({
    ...initialFilter,
    emailAssign: user?.email,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'approve' | 'reject' | ''>('');
  const [reason, setReason] = useState('');
  const [dynamicForm, setDynamicForm] = useState({
    hasDynamicForm: false,
    dynamicForm: '',
  });
  const { refetch: refetchPending } = useGetAllTask(
    { ...filter },
    TaskStatus.Pending
  );

  const { refetch: refetchApproved } = useGetAllTask(
    { ...filter },
    TaskStatus.Approved
  );

  const { refetch: refetchRejected } = useGetAllTask(
    { ...filter },
    TaskStatus.Rejected
  );

  useEffect(() => {
    if (data) {
      setRequestWorkflow(data.tasks.workflowInstanceId || '');
    }
  }, [data]);

  const handleApproveClick = () => {
    setModalType('approve');
    setIsModalOpen(true);
    setIsRejected(false);
  };
  const handleRejectClick = () => {
    setModalType('reject');
    setIsModalOpen(true);
    setIsRejected(true);
  };

  const rejectTask = async (id: string | null) => {
    if (!reason) return;
    setIsLoadingBtnReject(true);
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
    refetch();
    refetchRejected();
    refetchPending();
    setIsLoadingBtnApprove(false);
    onClose();
  };

  const approveTask = async (
    id: string | null,
    approvedData?: string | null
  ) => {
    setIsLoadingBtnApprove(true);
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
    refetch();
    refetchApproved();
    refetchPending();
    setIsLoadingBtnApprove(false);
    onClose();
  };

  const handleModalConfirm = async (data?: string) => {
    setIsModalOpen(false);
    if (modalType === 'approve') {
      await approveTask(taskId, data);
    } else if (modalType === 'reject') {
      await rejectTask(taskId);
    }
  };

  const { tasks, inputRequestUser, inputRequestDetail, emailTo } =
    useMemo(() => {
      const { input, tasks, emailTo } = data || {};
      const { RequestUser, Request } = input || {};

      return {
        tasks,
        emailTo,
        inputRequestUser: RequestUser,
        inputRequestDetail: Request,
      };
    }, [data]);

  const hasTaskAction: boolean = useMemo(() => {
    if (!data?.tasks || typeof data.tasks.status !== 'number') {
      return false;
    }

    return (
      data.tasks.status === TaskStatus.Pending &&
      !!data.otherActionSignals?.length
    );
  }, [data]);

  const hasInputRequestData: boolean = useMemo(() => {
    return !isObjectEmpty(inputRequestDetail);
  }, [inputRequestDetail]);

  const onActionClick = async (id: string, action: string) => {
    try {
      setIsLoading(true);
      await actionTaskMutation.mutateAsync({ id, action });
      toast({ title: 'Send action successfully!', status: 'success' });
      refetch();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      setIsLoadingBtnApprove(false);
      setIsLoadingBtnReject(false);
      if (isRejected) {
        setDynamicForm({
          hasDynamicForm: false,
          dynamicForm: '',
        });
      } else {
        const { dynamicActionData } = tasks || {};
        setDynamicForm({
          hasDynamicForm: !!dynamicActionData,
          dynamicForm: dynamicActionData || '',
        });
      }
    }
  }, [isOpen, isRejected, tasks]);

  const convertToDynamicArray = (payload: string | null | undefined) => {
    if (!payload) return [];

    try {
      const data = JSON.parse(payload) as IDynamicDataProps[];
      return data.map((element) => ({
        data: (element.data || '').split('\n'),
        name: element.name || 'No Name',
      })) as unknown as IDynamicDataProps[];
    } catch (error) {
      return [];
    }
  };

  const getUserReject = useMemo(() => {
    if (
      (getStatusByIndex(tasks?.status).status as string) !==
      RequestStatus.Rejected
    ) {
      return null;
    }

    const otherTasksSorted = otherTasks?.items?.sort(
      (a, b) =>
        new Date(b?.creationTime).getTime() -
        new Date(a?.creationTime).getTime()
    );

    const userReject = otherTasksSorted?.find(
      (task) => task.updatedBy != null && task.updatedBy != UPDATED_BY_W2
    )?.updatedBy;

    return users?.find((user) => user.email == userReject)?.name;
  }, [tasks?.status, otherTasks, users]);

  const mappingReviewToList = (data: IDynamicDataProps[]) => {
    return data.map((element, ind) => {
      if (!Array.isArray(element.data)) return null;

      const filteredData = element.data.filter((item) => item.trim() !== '');

      if (filteredData.length === 0) return null;

      return (
        <List key={element.name + ind} mt={1} spacing={1}>
          <Text fontSize={14} fontWeight={600} fontStyle="italic">
            {convertToCase(element.name)}:
          </Text>
          {filteredData.map((x) => (
            <ListItem key={x}>{x}</ListItem>
          ))}
        </List>
      );
    });
  };

  const renderDynamicDataContent = useCallback(() => {
    if (!otherTasks || otherTasks.items.length <= 0) return null;

    const filterOtherTask: IDynamicReviewProps[] = otherTasks.items.map((x) => {
      return {
        title: `${x.description || 'No name'} (${x.updatedBy
          ?.split('@')
          .shift()})`,
        items: convertToDynamicArray(x.dynamicActionData),
      };
    });

    const tasksWithData = filterOtherTask.filter((task) =>
      task.items.some(
        (item) =>
          Array.isArray(item.data) &&
          item.data.some((data) => data.trim() !== '')
      )
    );

    return tasksWithData.map((x, ind) => {
      return (
        <div key={ind}>
          <Text
            display="flex"
            alignItems="center"
            gap={1}
            fontSize={15}
            mt={2}
            fontWeight={600}
          >
            {x.title} <BiPencil fontSize={15} />
          </Text>
          {mappingReviewToList(x.items)}
        </div>
      );
    });
  }, [otherTasks]);

  if (hasGetTaskLoading) {
    return (
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent p="10px" maxW="700px">
          <ModalBody>
            <div className={styles.containerSpinner}>
              <Spinner color="red.500" size="xl" />
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    );
  }

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} blockScrollOnMount={false}>
        <ModalOverlay />
        <ModalContent p="10px" maxW="700px">
          <ModalHeader>
            <HStack>
              <Image h="45px" src={Logo} />
              <Heading ml={1} w="550px">
                <Text color="primary" fontSize={18}>
                  {tasks?.name}
                </Text>
                <Text fontSize={16} fontWeight={400} mt={1.5}>
                  {tasks?.description}
                </Text>
              </Heading>
            </HStack>
            <div className={styles.listActionContainer}>
              <Button
                className={styles.btnWFDetail}
                onClick={onActionViewWorkflow(
                  data?.tasks.workflowInstanceId as string
                )}
                mt={2}
              >
                View Workflow Detail
              </Button>
              <div className={styles.actions}>
                <div className={styles.spinner}>
                  {isLoading && <Spinner color="red.500" />}
                </div>
                {hasTaskAction &&
                  data?.otherActionSignals
                    ?.sort((a, b) => {
                      return a.otherActionSignal.localeCompare(
                        b.otherActionSignal
                      );
                    })
                    .map((x, ind) => {
                      return (
                        <Button
                          key={ind}
                          isDisabled={
                            isLoading ||
                            x.status !== OtherActionSignalStatus.PENDING
                          }
                          onClick={() =>
                            onActionClick(data?.tasks.id, x.otherActionSignal)
                          }
                        >
                          {x.otherActionSignal}
                        </Button>
                      );
                    })}
              </div>
              <div className={styles.listBtnActionTask}>
                {tasks?.status === TaskStatus.Approved ||
                tasks?.status === TaskStatus.Rejected ? null : (
                  <>
                    <Button
                      colorScheme="green"
                      isLoading={isLoadingBtnApprove}
                      onClick={handleApproveClick}
                      mt={2}
                      className={styles.btnApproveTask}
                    >
                      Approve
                    </Button>
                    <Button
                      colorScheme="red"
                      isLoading={isLoadingBtnReject}
                      onClick={handleRejectClick}
                      mt={2}
                      className={styles.btnRejectTask}
                    >
                      Reject
                    </Button>
                  </>
                )}
              </div>
            </div>
          </ModalHeader>
          <ModalCloseButton mt="15px" mr="10px" />
          <ModalBody className={styles.modalBody} pr={2}>
            <Divider mt={2} mb={3} />
            <div className={styles.container}>
              <Text
                mb="10px"
                fontWeight={600}
                fontStyle="italic"
                color="primary"
              >
                Request input
              </Text>

              <div className={styles.wrapper}>
                {hasInputRequestData && inputRequestDetail && (
                  <RequestInput inputRequestDetail={inputRequestDetail} />
                )}
              </div>

              <Divider mt={2} mb={3} />
              <Text
                mb="10px"
                fontWeight={600}
                fontStyle="italic"
                color="primary"
              >
                Request user
              </Text>

              <div className={styles.wrapper}>
                <TextGroup label="Name" content={inputRequestUser?.name} />
                <TextGroup label="Email" content={inputRequestUser?.email} />
                <TextGroup
                  label="Branch name"
                  content={inputRequestUser?.branchName}
                />
              </div>

              <Divider mt={2} mb={3} />
              <Text
                mb="15px"
                fontWeight={600}
                fontStyle="italic"
                color="primary"
              >
                Detail
              </Text>
              <div className={styles.wrapper}>
                <TextGroup label="Request template" content={tasks?.name} />
                <TextGroup
                  label="State"
                  content={getStatusByIndex(tasks?.status).status}
                  color={getStatusByIndex(tasks?.status).color}
                />
                {tasks?.reason && (
                  <TextGroup label="Reason" content={tasks.reason} />
                )}

                <TextGroup
                  label="Email assignment"
                  content={emailTo?.join(', ')}
                />
                <TextGroup
                  label="Creation time"
                  content={
                    tasks?.creationTime
                      ? formatDate(new Date(tasks?.creationTime))
                      : ''
                  }
                />
                {getUserReject && (
                  <TextGroup
                    label="Rejected by"
                    content={removeDiacritics(getUserReject)}
                  />
                )}
                {renderDynamicDataContent()}
              </div>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
      <ModalBoard
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleModalConfirm}
        showReason={isRejected}
        showDynamicForm={dynamicForm.hasDynamicForm}
        dynamicForm={dynamicForm.dynamicForm}
        setReason={setReason}
        shortTitle={tasks?.title}
        isLoading={loadStatus}
        name={tasks?.name}
        requestUser={data?.input?.RequestUser?.name}
        isDisabled={isRejected && !reason}
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
