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
  Spinner,
  Text,
  Button,
  ListItem,
  List,
} from '@chakra-ui/react';
import Logo from 'assets/images/ncc_logo.png';
import styles from './style.module.scss';
import { Request } from 'models/request';
import { useGetRequestDetail, useUserList } from 'api/apiHooks/requestHooks';
import { useCallback, useMemo, useState } from 'react';
import { RequestInput } from 'features/Tasks/components/RequestInput';
import { TextGroup } from 'common/components/TextGroup/TextGroup';
import {
  isObjectEmpty,
  formatDate,
  getColorByStatus,
  convertToCase,
} from 'utils';
import { WorkflowModal } from 'common/components/WorkflowModal';
import { RequestStatus } from 'common/enums';
import { UPDATED_BY_W2 } from 'common/constants';
import { removeDiacritics } from 'utils/removeDiacritics';
import { BiPencil } from 'react-icons/bi';

interface IDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  requestDetail: Request;
}

interface IDynamicDataProps {
  [key: string]: string;
}

interface IDynamicReviewProps {
  title: string;
  items: IDynamicDataProps[];
}

export const RequestDetailModal = ({
  isOpen,
  onClose,
  requestDetail,
}: IDetailModalProps) => {
  const { data, isLoading } = useGetRequestDetail(requestDetail.id);

  const { data: users } = useUserList();

  const [requestWorkflow, setRequestWorkflow] = useState<string>('');
  const [isOpenWorkflow, setOpenWorkflow] = useState(false);

  const onActionViewWorkflow = (workflowId: string) => () => {
    setRequestWorkflow(workflowId);
    setOpenWorkflow(true);
  };

  const { inputRequestDetail, inputRequestUser, tasks } = useMemo(() => {
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

  const rejectReason = useMemo(() => {
    if (!tasks || requestDetail?.status !== RequestStatus.Rejected) {
      return null;
    }

    return tasks?.find((task) => task.reason)?.reason;
  }, [requestDetail?.status, tasks]);

  const getUserReject = useMemo(() => {
    if (!tasks || requestDetail?.status !== RequestStatus.Rejected) {
      return null;
    }

    const taskSorted = tasks?.sort(
      (a, b) =>
        new Date(b?.creationTime).getTime() -
        new Date(a?.creationTime).getTime()
    );

    const userReject = taskSorted?.find(
      (task) => task.updatedBy != null && task.updatedBy != UPDATED_BY_W2
    )?.updatedBy;

    return users?.find((user) => user.email == userReject)?.name;
  }, [requestDetail?.status, tasks, users]);

  const hasInputRequestData: boolean = useMemo(() => {
    return !isObjectEmpty(inputRequestDetail);
  }, [inputRequestDetail]);

  const renderDynamicDataContent = useCallback(() => {
    if (!tasks || tasks.length <= 0) return null;

    const filterOtherTask: IDynamicReviewProps[] = tasks.map((x) => {
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
  }, [tasks]);

  if (isLoading) {
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

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        blockScrollOnMount={false}
        closeOnOverlayClick={false}
      >
        <ModalOverlay />
        <ModalContent className={styles.modalContent}>
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
            <Button mt={2} onClick={onActionViewWorkflow(requestDetail.id)}>
              View Workflow Detail
            </Button>
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
                {inputRequestUser ? (
                  <>
                    <TextGroup label="Name" content={inputRequestUser?.name} />
                    <TextGroup
                      label="Email"
                      content={inputRequestUser?.email}
                    />
                    <TextGroup
                      label="Branch name"
                      content={inputRequestUser?.branchName}
                    />
                  </>
                ) : (
                  <Text fontSize="15px">Not found!</Text>
                )}
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
                <TextGroup
                  label="Request template"
                  content={requestDetail?.workflowDefinitionDisplayName}
                />
                <TextGroup
                  label="Status"
                  content={getColorByStatus(requestDetail?.status).status}
                  color={getColorByStatus(requestDetail?.status).color}
                />

                {requestDetail?.currentStates.length > 0 && (
                  <TextGroup
                    label="Current state"
                    content={requestDetail?.currentStates.join(', ')}
                  />
                )}
                {requestDetail?.stakeHolders.length > 0 && (
                  <TextGroup
                    label="Stakeholders"
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

                {rejectReason && (
                  <TextGroup label="Reason" content={rejectReason} />
                )}
                {!rejectReason && <TextGroup label="" content="" />}
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
