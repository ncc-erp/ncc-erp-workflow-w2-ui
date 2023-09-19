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
  Select,
} from '@chakra-ui/react';
import { useGetTaskDetail } from 'api/apiHooks/taskHooks';
import Logo from 'assets/images/ncc_logo.svg';
import { TextGroup } from 'common/components/TextGroup/TextGroup';
import { dateFormat } from 'common/constants';
import { format } from 'date-fns';
import { getStatusByIndex } from 'utils/getStatusByIndex';
import { RequestDetail } from './RequestDetail';

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
            <Image h="40px" src={Logo} />
            <Heading ml={1}>
              <Text color="primary" fontSize={20}>
                {taskDetail?.name}
              </Text>
              <Text fontSize={14} fontWeight={600} mt={1}>
                {taskDetail?.description}
              </Text>
            </Heading>
          </HStack>
        </ModalHeader>
        <ModalCloseButton mt="15px" mr="10px" />
        <ModalBody>
          <Divider mb={5}></Divider>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginTop: '10px',
            }}
          >
            <div style={{ width: '50%' }}>
              <Text
                mb="10px"
                fontWeight={600}
                fontStyle="italic"
                color="primary"
              >
                Request input
              </Text>
              <RequestDetail
                type={taskDetail?.name}
                inputRequestDetail={inputRequestDetail}
              />
            </div>
            <div style={{ width: '50%' }}>
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

          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div style={{ width: '50%' }}>
              <TextGroup label="Name" content={taskDetail?.name} />
              <TextGroup label="Detail" content={taskDetail?.description} />
              <TextGroup
                label="Status"
                content={getStatusByIndex(taskDetail?.status).status}
                color={getStatusByIndex(taskDetail?.status).color}
              />
            </div>
            <div style={{ width: '50%' }}>
              <TextGroup label="Email assignment" content={taskDetail?.email} />
              <TextGroup
                label="Creation time"
                content={
                  taskDetail?.creationTime
                    ? format(new Date(taskDetail?.creationTime), dateFormat)
                    : ''
                }
              />

              {taskDetail?.otherActionSignal && (
                <Select>
                  <option value="all">Normal</option>
                  <option value="otherActionSignal">
                    {taskDetail?.otherActionSignal}
                  </option>
                </Select>
              )}
            </div>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
