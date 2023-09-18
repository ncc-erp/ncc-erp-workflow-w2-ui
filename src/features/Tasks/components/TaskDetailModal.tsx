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
import { dateFormat, requestTemplateWorkflow } from 'common/constants';
import { extractContent } from 'utils/extractContent';
import { format } from 'date-fns';
import { getStatusByIndex } from 'utils/getStatusByIndex';
import { getOfficeNameByCode } from 'utils/getOfficeByCode';

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
              <Text color="primary" fontSize={18}>
                {taskDetail?.name}
              </Text>
              <Text fontSize={16} fontWeight={600} mt={1}>
                Details
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
                Request user
              </Text>
              <TextGroup label="User name" content={inputRequestUser?.name} />
              <TextGroup label="User email" content={inputRequestUser?.email} />
              <TextGroup
                label="Branch name"
                content={inputRequestUser?.branchName}
              />
            </div>
            <div style={{ width: '50%' }}>
              <Text
                mb="10px"
                fontWeight={600}
                fontStyle="italic"
                color="primary"
              >
                Request input
              </Text>
              {taskDetail?.name === requestTemplateWorkflow.WFH_REQUEST && (
                <>
                  <TextGroup
                    label="Current office"
                    content={getOfficeNameByCode(
                      inputRequestDetail?.CurrentOffice
                    )}
                  />
                  <TextGroup
                    label="Project"
                    content={inputRequestDetail?.Project}
                  />
                  <TextGroup
                    label="Reason"
                    content={extractContent(inputRequestDetail?.Reason)}
                  />
                  <TextGroup
                    label="Dates"
                    dates={
                      inputRequestDetail?.Dates
                        ? inputRequestDetail?.Dates.split(',')
                        : []
                    }
                  />
                </>
              )}
              {taskDetail?.name ===
                requestTemplateWorkflow.OFFICE_EQUIPMENT && (
                <>
                  <TextGroup
                    label="Current office"
                    content={getOfficeNameByCode(
                      inputRequestDetail?.CurrentOffice
                    )}
                  />
                  <TextGroup
                    label="Equipment"
                    content={inputRequestDetail?.Equipment}
                  />
                  <TextGroup
                    label="Reason"
                    content={extractContent(inputRequestDetail?.Reason)}
                  />
                </>
              )}
              {taskDetail?.name === requestTemplateWorkflow.CHANGE_OFFICE && (
                <>
                  <TextGroup
                    label="Current office"
                    content={getOfficeNameByCode(
                      inputRequestDetail?.CurrentOffice
                    )}
                  />
                  <TextGroup
                    label="Destination Office"
                    content={inputRequestDetail?.DestinationOffice}
                  />
                  <TextGroup
                    label="Content"
                    content={extractContent(inputRequestDetail?.Content)}
                  />
                  <TextGroup
                    label="Start date"
                    content={inputRequestDetail?.StartDate}
                  />
                  <TextGroup
                    label="End date"
                    content={inputRequestDetail?.EndDate}
                  />
                </>
              )}
              {taskDetail?.name === requestTemplateWorkflow.DEVICE_REQUEST && (
                <>
                  <TextGroup
                    label="Current office"
                    content={getOfficeNameByCode(
                      inputRequestDetail?.CurrentOffice
                    )}
                  />
                  <TextGroup
                    label="Project"
                    content={inputRequestDetail?.Project}
                  />
                  <TextGroup
                    label="Device"
                    content={inputRequestDetail?.Device}
                  />
                  <TextGroup
                    label="Reason"
                    content={extractContent(inputRequestDetail?.Reason)}
                  />
                </>
              )}
            </div>
          </div>
          <Divider mt={2} mb={5}></Divider>
          <Text mb="15px" fontWeight={600} fontStyle="italic" color="primary">
            Task detail
          </Text>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div style={{ width: '50%' }}>
              <TextGroup label="Task name" content={taskDetail?.name} />
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
            </div>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
