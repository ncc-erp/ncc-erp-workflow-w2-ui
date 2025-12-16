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
import { RequestStatus, REQUEST_STATUS_I18N_KEY } from 'common/enums';
import { UPDATED_BY_W2, resolveRequestTemplateI18nKey } from 'common/constants';
import { removeDiacritics } from 'utils/removeDiacritics';
import { BiPencil } from 'react-icons/bi';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();
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

  const convertToDynamicArray = useCallback(
    (payload: string | null | undefined) => {
      if (!payload) return [];

      try {
        const data = JSON.parse(payload) as IDynamicDataProps[];
        return data.map((element) => ({
          data: (element.data || '').split('\n'),
          name: element.name || t('MY_REQUESTS_PAGE.LABELS.NO_NAME'),
        })) as unknown as IDynamicDataProps[];
      } catch (error) {
        return [];
      }
    },
    [t]
  );

  // Di chuyển getDynamicReviewFieldI18nKey ra ngoài và sử dụng useCallback
  const getDynamicReviewFieldI18nKey = useCallback(
    (fieldName: string): string => {
      const fieldMappings: Record<string, string> = {
        'PM Reviews': 'MY_REQUESTS_PAGE.LABELS.PM_REVIEWS',
        StrengthPoints: 'MY_REQUESTS_PAGE.LABELS.STRENGTH_POINTS',
        WeaknessPoints: 'MY_REQUESTS_PAGE.LABELS.WEAKNESS_POINTS',
      };

      return fieldMappings[fieldName] || fieldName;
    },
    []
  );

  // Di chuyển mappingReviewToList ra ngoài và sử dụng useCallback
  const mappingReviewToList = useCallback(
    (data: IDynamicDataProps[]) => {
      return data.map((element, ind) => {
        if (!Array.isArray(element.data)) return null;

        const filteredData = element.data.filter((item) => item.trim() !== '');

        if (filteredData.length === 0) return null;

        const fieldI18nKey = getDynamicReviewFieldI18nKey(element.name);
        const fieldLabel = fieldI18nKey.startsWith('MY_REQUESTS_PAGE.')
          ? t(fieldI18nKey)
          : convertToCase(element.name);

        return (
          <List key={element.name + ind} mt={1} spacing={1}>
            <Text fontSize={14} fontWeight={600} fontStyle="italic">
              {fieldLabel}:
            </Text>
            {filteredData.map((x) => (
              <ListItem key={x}>{x}</ListItem>
            ))}
          </List>
        );
      });
    },
    [getDynamicReviewFieldI18nKey, t]
  );

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
  }, [tasks, convertToDynamicArray, mappingReviewToList]); // Thêm mappingReviewToList vào dependency

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

  const templateDisplayName = (() => {
    const dn = requestDetail?.workflowDefinitionDisplayName;
    if (!dn) return '';
    const key = resolveRequestTemplateI18nKey(dn);
    return key ? t(key) : dn;
  })();

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
                  {templateDisplayName}
                </Text>
                <Text fontSize={16} fontWeight={400} mt={1.5}>
                  {t('MY_REQUESTS_PAGE.TITLES.REQUEST_DETAILS')}
                </Text>
              </Heading>
            </HStack>
            <Button mt={2} onClick={onActionViewWorkflow(requestDetail.id)}>
              {t('MY_REQUESTS_PAGE.BUTTONS.VIEW_WORKFLOW')}
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
                {t('MY_REQUESTS_PAGE.LABELS.REQUEST_INPUT')}
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
                {t('MY_REQUESTS_PAGE.LABELS.REQUEST_USER')}
              </Text>
              <div className={styles.wrapper}>
                {inputRequestUser ? (
                  <>
                    <TextGroup
                      label={t('MY_REQUESTS_PAGE.LABELS.NAME')}
                      content={inputRequestUser?.name}
                    />
                    <TextGroup
                      label={t('MY_REQUESTS_PAGE.LABELS.EMAIL')}
                      content={inputRequestUser?.email}
                    />
                    <TextGroup
                      label={t('MY_REQUESTS_PAGE.LABELS.BRANCH_NAME')}
                      content={inputRequestUser?.branchName}
                    />
                  </>
                ) : (
                  <Text fontSize="15px">
                    {t('MY_REQUESTS_PAGE.LABELS.NOT_FOUND')}
                  </Text>
                )}
              </div>

              <Divider mt={2} mb={3} />
              <Text
                mb="15px"
                fontWeight={600}
                fontStyle="italic"
                color="primary"
              >
                {t('MY_REQUESTS_PAGE.LABELS.DETAIL')}
              </Text>

              <div className={styles.wrapper}>
                <TextGroup
                  label={t('MY_REQUESTS_PAGE.LABELS.REQUEST_TEMPLATE')}
                  content={
                    requestDetail?.workflowDefinitionDisplayName
                      ? t(
                          resolveRequestTemplateI18nKey(
                            requestDetail.workflowDefinitionDisplayName
                          ) || requestDetail.workflowDefinitionDisplayName
                        )
                      : ''
                  }
                />
                {(() => {
                  const statusValue = requestDetail?.status as
                    | RequestStatus
                    | undefined;
                  const statusColor = getColorByStatus(statusValue);
                  const statusLabel =
                    statusValue && REQUEST_STATUS_I18N_KEY[statusValue]
                      ? t(REQUEST_STATUS_I18N_KEY[statusValue])
                      : statusColor.status;

                  return (
                    <TextGroup
                      label={t('MY_REQUESTS_PAGE.LABELS.STATUS')}
                      content={statusLabel}
                      color={statusColor.color}
                    />
                  );
                })()}

                {requestDetail?.currentStates.length > 0 && (
                  <TextGroup
                    label={t('MY_REQUESTS_PAGE.LABELS.CURRENT_STATE')}
                    content={requestDetail?.currentStates.join(', ')}
                  />
                )}
                {requestDetail?.stakeHolders.length > 0 && (
                  <TextGroup
                    label={t('MY_REQUESTS_PAGE.LABELS.STAKEHOLDERS')}
                    content={requestDetail?.stakeHolders.join(', ')}
                  />
                )}
                <TextGroup
                  label={t('MY_REQUESTS_PAGE.LABELS.CREATION_TIME')}
                  content={
                    requestDetail?.createdAt
                      ? formatDate(new Date(requestDetail?.createdAt))
                      : ''
                  }
                />

                {rejectReason && (
                  <TextGroup
                    label={t('MY_REQUESTS_PAGE.LABELS.REASON')}
                    content={rejectReason}
                  />
                )}
                {!rejectReason && <TextGroup label="" content="" />}
                {getUserReject && (
                  <TextGroup
                    label={t('MY_REQUESTS_PAGE.LABELS.REJECTED_BY')}
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
