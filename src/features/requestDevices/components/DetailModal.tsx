import {
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
import Logo from 'assets/images/ncc_logo.svg';
import styles from './style.module.scss';
import { Request } from 'models/request';
import { useGetRequestDetail } from 'api/apiHooks/requestHooks';
import { useMemo } from 'react';
import { RequestInput } from 'features/Tasks/components/RequestInput';
import { TextGroup } from 'common/components/TextGroup/TextGroup';
import { isObjectEmpty, formatDate, getColorByStatus } from 'utils';

interface IDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  requestDetail: Request;
}

export const RequestDetailModal = ({
  isOpen,
  onClose,
  requestDetail,
}: IDetailModalProps) => {
  const { data } = useGetRequestDetail(requestDetail.id);

  const { inputRequestDetail, inputRequestUser } = useMemo(() => {
    const { typeRequest, input, tasks, workInstanceId } = data || {};
    const { RequestUser, Request } = input || {};

    return {
      tasks,
      inputRequestUser: RequestUser,
      inputRequestDetail: Request,
      typeRequest,
      workInstanceId,
    };
  }, [data]);

  const hasInputRequestData: boolean = useMemo(() => {
    return !isObjectEmpty(inputRequestDetail);
  }, [inputRequestDetail]);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent p="10px" maxW="700px">
        <ModalHeader>
          <HStack>
            <Image h="45px" src={Logo} />
            <Heading ml={1} w="550px">
              <Text color="primary" fontSize={18}>
                {requestDetail?.workflowDefinitionDisplayName}
              </Text>
              <Text fontSize={16} fontWeight={400} mt={1.5}>
                Request Details
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
              {hasInputRequestData && inputRequestDetail && (
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
              {inputRequestUser ? (
                <>
                  <TextGroup label="Name" content={inputRequestUser?.name} />
                  <TextGroup label="Email" content={inputRequestUser?.email} />
                  <TextGroup
                    label="Branch name"
                    content={inputRequestUser?.branchName}
                  />
                </>
              ) : (
                <Text fontSize="15px">Not found!</Text>
              )}
            </div>
          </div>
          <Divider mt={2} mb={5}></Divider>
          <Text mb="15px" fontWeight={600} fontStyle="italic" color="primary">
            Detail
          </Text>
          <div className={styles.container}>
            <div className={styles.left}>
              <TextGroup
                label="Request name"
                content={requestDetail?.workflowDefinitionDisplayName}
              />
              <TextGroup
                label="Status"
                content={getColorByStatus(requestDetail?.status).status}
                color={getColorByStatus(requestDetail?.status).color}
              />
            </div>
            <div className={styles.right}>
              {requestDetail?.currentStates.length > 0 && (
                <TextGroup
                  label="Current state"
                  content={requestDetail?.currentStates.join(', ')}
                />
              )}
              {requestDetail?.stakeHolders.length > 0 && (
                <TextGroup
                  label="Stake holders"
                  content={requestDetail?.stakeHolders.join(', ')}
                />
              )}
              <TextGroup
                label="Creation time"
                content={
                  requestDetail?.createdAt
                    ? formatDate(new Date(requestDetail?.createdAt))
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
