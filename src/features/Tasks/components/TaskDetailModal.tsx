import {
  HStack,
  Heading,
  Modal,
  Image,
  Text,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Divider,
} from '@chakra-ui/react';
import { useGetTaskDetail } from 'api/apiHooks/taskHooks';
import Logo from 'assets/images/ncc_logo.svg';
import { TextGroup } from 'common/components/TextGroup/TextGroup';
import { formatDate, getStatusByIndex } from 'utils';
import { RequestInput } from './RequestInput';
import styles from './style.module.scss';

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
  const { data } = useGetTaskDetail(taskId);
  const { input, tasks } = data ?? {};

  const taskDetail = tasks;
  const inputRequestUser = input?.RequestUser;
  const inputRequestDetail = input?.Request;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent p="10px" maxW="700px">
        <ModalHeader>
          <HStack>
            <Image h="45px" src={Logo} />
            <Heading ml={1}>
              <Text color="primary" fontSize={18}>
                {taskDetail?.name}
              </Text>
              <Text fontSize={16} fontWeight={600} mt={1.5}>
                Details
              </Text>
            </Heading>
          </HStack>
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
              {inputRequestDetail && (
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
              <TextGroup label="User name" content={inputRequestUser?.name} />
              <TextGroup label="User email" content={inputRequestUser?.email} />
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
              <TextGroup label="Task name" content={taskDetail?.name} />
              <TextGroup
                label="Status"
                content={getStatusByIndex(taskDetail?.status).status}
                color={getStatusByIndex(taskDetail?.status).color}
              />
            </div>
            <div className={styles.right}>
              <TextGroup label="Email assignment" content={taskDetail?.email} />
              <TextGroup
                label="Creation time"
                content={
                  taskDetail?.creationTime
                    ? formatDate(new Date(taskDetail?.creationTime))
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
