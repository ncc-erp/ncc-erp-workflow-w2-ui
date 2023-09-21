import {
  Button,
  Divider,
  HStack,
  Heading,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
} from '@chakra-ui/react';
import { useActionTask, useGetTaskDetail } from 'api/apiHooks/taskHooks';
import Logo from 'assets/images/ncc_logo.svg';
import { TextGroup } from 'common/components/TextGroup/TextGroup';
import { formatDate, getStatusByIndex } from 'utils';
import { RequestInput } from './RequestInput';
import styles from './style.module.scss';
import { toast } from 'common/components/StandaloneToast';
import { TaskStatus } from 'common/constants';
import { useMemo } from 'react';
import isObjectEmpty from 'utils/isObjectEmpty';

interface IDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  taskId: string;
}

export const TaskDetailModal = ({
  isOpen,
  onClose,
  taskId,
}: IDetailModalProps) => {
  const actionTaskMutation = useActionTask();
  const { data } = useGetTaskDetail(taskId);

  const { tasks, inputRequestUser, inputRequestDetail } = useMemo(() => {
    const { input, tasks } = data || {};
    const { RequestUser, Request } = input || {};

    return {
      tasks,
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
      !!data.tasks.otherActionSignals?.length
    );
  }, [data]);

  const hasInputRequestData: boolean = useMemo(() => {
    return !isObjectEmpty(inputRequestDetail);
  }, [inputRequestDetail]);

  const onActionClick = async (id: string, action: string) => {
    try {
      await actionTaskMutation.mutateAsync({ id, action });
      toast({ title: 'Approved successfully!', status: 'success' });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
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
            {hasTaskAction &&
              data?.tasks?.otherActionSignals?.map((x, ind) => {
                return (
                  <Button
                    key={ind}
                    onClick={() => onActionClick(data?.tasks.id, x)}
                  >
                    {x}
                  </Button>
                );
              })}
          </div>
        </ModalHeader>
        <ModalCloseButton mt="15px" mr="10px" />
        <ModalBody>
          <Divider mb={5}></Divider>
          <div className={styles.container}>
            <div className={styles.left}>
              <Text
                mb="10px"
                fontWeight={600}
                fontStyle="italic"
                color="primary"
              >
                Request input
              </Text>
              {hasInputRequestData && (
                <RequestInput inputRequestDetail={inputRequestDetail} />
              )}
            </div>
            <div className={styles.right}>
              <Text
                mb="10px"
                fontWeight={600}
                fontStyle="italic"
                color="primary"
              >
                Request user
              </Text>
              <TextGroup label="Name" content={inputRequestUser?.name} />
              <TextGroup label="Email" content={inputRequestUser?.email} />
              <TextGroup
                label="Branch name"
                content={inputRequestUser?.branchName}
              />
            </div>
          </div>
          <Divider mt={2} mb={5}></Divider>
          <Text mb="15px" fontWeight={600} fontStyle="italic" color="primary">
            Task detail
          </Text>
          <div className={styles.container}>
            <div className={styles.left}>
              <TextGroup label="Task name" content={tasks?.name} />
              <TextGroup
                label="Status"
                content={getStatusByIndex(tasks?.status).status}
                color={getStatusByIndex(tasks?.status).color}
              />
            </div>
            <div className={styles.right}>
              <TextGroup label="Email assignment" content={tasks?.email} />
              <TextGroup
                label="Creation time"
                content={
                  tasks?.creationTime
                    ? formatDate(new Date(tasks?.creationTime))
                    : ''
                }
              />
            </div>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
