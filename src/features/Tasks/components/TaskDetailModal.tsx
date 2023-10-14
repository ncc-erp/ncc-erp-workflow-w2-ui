import {
  Button,
  Divider,
  HStack,
  Heading,
  Image,
  List,
  ListIcon,
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
import { useActionTask, useGetTaskDetail } from 'api/apiHooks/taskHooks';
import Logo from 'assets/images/ncc_logo.png';
import { toast } from 'common/components/StandaloneToast';
import { TextGroup } from 'common/components/TextGroup/TextGroup';
import { WorkflowModal } from 'common/components/WorkflowModal';
import {
  DynamicData,
  OtherActionSignalStatus,
  TaskStatus,
} from 'common/constants';
import { useMemo, useState } from 'react';
import {
  MdCheckCircle,
  MdOutlineAddCircle,
  MdRemoveCircle,
} from 'react-icons/md';
import {
  convertToCase,
  formatDate,
  getStatusByIndex,
  isObjectEmpty,
} from 'utils';
import { RequestInput } from './RequestInput';
import { IOtherTasks } from './TasksBoard';
import styles from './style.module.scss';

interface IDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  taskId: string;
  otherTasks?: IOtherTasks;
}

interface IDynamicDataProps {
  [key: string]: string;
}

export const TaskDetailModal = ({
  isOpen,
  onClose,
  taskId,
  otherTasks,
}: IDetailModalProps) => {
  const actionTaskMutation = useActionTask();
  const {
    data,
    refetch,
    isLoading: hasGetTaskLoading,
  } = useGetTaskDetail(taskId);
  const [isLoading, setIsLoading] = useState(false);

  const [requestWorkflow, setRequestWorkflow] = useState<string>('');
  const [isOpenWorkflow, setOpenWorkflow] = useState(false);

  const onActionViewWorkflow = (workflowId: string) => () => {
    setRequestWorkflow(workflowId);
    setOpenWorkflow(true);
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

  const convertToDynamicArray = (payload: string | null | undefined) => {
    if (!payload) return [];

    try {
      const data = JSON.parse(payload) as IDynamicDataProps[];
      return data.map((element) => ({
        data: (element.data || '').split('\n'),
        name: element.name || 'No Name',
        isFinalApprove: element.isFinalApprove || false,
      })) as unknown as IDynamicDataProps[];
    } catch (error) {
      return [];
    }
  };

  const dynamicDataParse: IDynamicDataProps[] = useMemo(() => {
    if (!tasks || !tasks.dynamicActionData) {
      return [];
    }

    return convertToDynamicArray(tasks.dynamicActionData);
  }, [tasks]);

  const getListIcon = (elementName: string) => {
    switch (elementName) {
      case DynamicData.STRENGTH_POINT:
        return <ListIcon as={MdCheckCircle} color="green.500" />;
      case DynamicData.WEAKNESS_POINT:
        return <ListIcon as={MdRemoveCircle} color="red.500" />;
      default:
        return <ListIcon as={MdOutlineAddCircle} color="gray.500" />;
    }
  };

  const renderDynamicDataContent = (data: IDynamicDataProps[] | undefined) => {
    if (!data || !tasks) return null;
    let convertData = [...data];

    const isFinalApproveTask = data.some((element) => element.isFinalApprove);
    if (isFinalApproveTask && otherTasks) {
      const filterOtherTask = otherTasks.items.map((x) =>
        convertToDynamicArray(x.dynamicActionData)
      );

      const combinedData = filterOtherTask.reduce((result, dataRow) => {
        dataRow.forEach((dataItem) => {
          const { name, data, isFinalApprove } = dataItem;
          const existingItem = result.find((item) => item.name === name);

          if (existingItem) {
            existingItem.data = existingItem.data.concat(data);
          } else {
            result.push({ name, data, isFinalApprove });
          }
        });

        return result;
      }, []);

      if (combinedData.length > 0) {
        convertData = [...combinedData];
      }
    }

    return (
      <>
        {convertData.map((element, ind) => {
          if (!Array.isArray(element.data)) return null;

          const filteredData = element.data.filter(
            (item) => item.trim() !== ''
          );

          if (filteredData.length === 0) return null;

          const listIcon = getListIcon(element.name);

          return (
            <List key={ind} mt={1} spacing={2}>
              <Text fontSize={15} fontWeight={600}>
                {convertToCase(element.name)}
              </Text>
              {filteredData.map((x) => (
                <ListItem key={x} className={styles.listItem}>
                  {listIcon}
                  {x}
                </ListItem>
              ))}
            </List>
          );
        })}
      </>
    );
  };

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
            <div className={styles.actions}>
              <Button
                onClick={onActionViewWorkflow(
                  data?.tasks.workflowInstanceId as string
                )}
              >
                View Workflow Detail
              </Button>
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
              </div>

              {dynamicDataParse.length > 0 &&
                renderDynamicDataContent(dynamicDataParse)}
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
      {requestWorkflow && (
        <WorkflowModal
          isOpen={isOpenWorkflow}
          onClose={() => setOpenWorkflow(false)}
          workflowId={requestWorkflow}
        />
      )}
    </>
  );
};
