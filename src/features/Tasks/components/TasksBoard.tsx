import {
  Box,
  Button,
  Flex,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Wrap,
  WrapItem,
} from '@chakra-ui/react';
import { useRequestTemplates } from 'api/apiHooks/requestHooks';
import Boards from 'common/components/Boards';
import { SelectField } from 'common/components/SelectField';
import {
  DEFAULT_TASK_PER_PAGE,
  DislayValue,
  FilterAll,
  FilterDate,
  Permissions,
  TaskStatus,
} from 'common/constants';
import { FilterTasks } from 'models/task';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useIsAdmin } from 'hooks/useIsAdmin';
import { TbSearch } from 'react-icons/tb';
import useDebounced from 'hooks/useDebounced';
import { useCurrentUser } from 'stores/user';
import { subtractTime } from 'utils/subtractTime';
import { ListTask } from '../../../common/components/Boards/ListTask';
import { TaskDetailModal } from './TaskDetailModal';
import { FaTable } from 'react-icons/fa';
import { BsCardText } from 'react-icons/bs';
import { ITask } from 'models/request';
import { useDynamicDataTask } from 'api/apiHooks/taskHooks';
import { useMediaQuery } from 'hooks/useMediaQuery';
import { useUserPermissions } from 'hooks/useUserPermissions';
import { useSyncFilterQuery } from 'hooks/useSyncFilterQuery';

const initialFilter: FilterTasks = {
  skipCount: 0,
  maxResultCount: DEFAULT_TASK_PER_PAGE,
  workflowDefinitionId: '',
  status: -1,
  dates: subtractTime('months', 1),
  emailRequest: '',
  emailAssign: '',
  display: DislayValue.BOARD,
};

export type IOtherTasks = {
  totalCount: number;
  items: ITask[];
};

interface ModalDetail {
  isOpen: boolean;
  taskId: string;
  otherTasks: IOtherTasks;
}

const initialModalStatus: ModalDetail = {
  isOpen: false,
  taskId: '',
  otherTasks: {
    totalCount: 0,
    items: [],
  },
};

export const OptionsDisplay = [
  {
    value: DislayValue.BOARD,
    label: 'Board Items',
    icon: <BsCardText />,
  },
  {
    value: DislayValue.LIST,
    label: 'List Items',
    icon: <FaTable />,
  },
];

export const TasksBoard = () => {
  const isLargeScreen = useMediaQuery('(min-width: 768px)');
  const user = useCurrentUser();
  const isPublish = true;
  const [modalState, setModalState] = useState(initialModalStatus);
  const [filter, setFilter] = useSyncFilterQuery<FilterTasks>({
    ...initialFilter,
    emailAssign: user.email,
    display: DislayValue.BOARD,
  });
  const [txtSearch, setTxtSearch] = useState<string>(filter.emailRequest ?? '');
  const showOnlyMyTask = filter.emailAssign === user.email;
  const txtSearchDebounced = useDebounced(txtSearch, 500);
  const isAdmin = useIsAdmin();
  const dynamicDataTaskMutation = useDynamicDataTask();
  const { data: requestTemplateData } = useRequestTemplates(isPublish);
  const { renderIfAllowed } = useUserPermissions();
  const requestTemplates = useMemo(() => {
    if (requestTemplateData?.items) {
      return requestTemplateData.items;
    }

    return [];
  }, [requestTemplateData]);

  const statusOptions = useMemo(() => {
    const defaultOptions = {
      value: -1,
      label: FilterAll.STATUS,
    };

    const options = Object.entries(TaskStatus).map(([key, value]) => ({
      value,
      label: key,
    }));

    return [defaultOptions, ...options];
  }, []);

  const requestTemplateOtions = useMemo(() => {
    const defaultOptions = {
      value: '',
      label: 'All types',
    };

    const options = requestTemplates.map(({ definitionId, displayName }) => ({
      value: definitionId,
      label: displayName,
    }));

    return [defaultOptions, ...options];
  }, [requestTemplates]);

  const dateOptions = useMemo(() => {
    const defaultOptions = {
      value: '',
      label: FilterAll.DATE,
    };

    const options = Object.values(FilterDate).map((value) => ({
      value: subtractTime(value.split(' ')[1], +value.split(' ')[0]),
      label: value,
    }));

    return [defaultOptions, ...options];
  }, []);

  const onTemplateStatusChange = useCallback(
    (key: keyof FilterTasks, value?: string | number) => {
      setFilter((filter) => ({ ...filter, [key]: value, skipCount: 0 }));
    },
    [setFilter]
  );

  const openModal = useCallback(
    (task: ITask) => async () => {
      const result = await dynamicDataTaskMutation.mutateAsync({
        id: task.id,
        workflowInstanceId: task.workflowInstanceId,
      });

      setModalState({
        ...modalState,
        isOpen: true,
        taskId: task.id,
        otherTasks: result as unknown as IOtherTasks,
      });
    },
    [dynamicDataTaskMutation, modalState]
  );

  const closeModal = useCallback(() => {
    setModalState({
      ...modalState,
      isOpen: false,
    });
  }, [modalState]);

  useEffect(() => {
    const paramsEmailRequest = filter.emailRequest ? filter.emailRequest : '';
    if (paramsEmailRequest !== txtSearchDebounced) {
      onTemplateStatusChange('emailRequest', txtSearchDebounced);
    }
  }, [onTemplateStatusChange, txtSearchDebounced, filter.emailRequest]);

  return (
    <Flex flexDirection={'column'} gap={2}>
      <Flex gap={3} flexDirection={['column', 'row']} flexWrap={'wrap'}>
        <Box flex={{ sm: 2, xl: 'unset' }} flexBasis={{ xl: '296px' }}>
          <SelectField
            cursor="pointer"
            value={filter.workflowDefinitionId}
            size="sm"
            rounded="md"
            onChange={(e) =>
              onTemplateStatusChange('workflowDefinitionId', e.target.value)
            }
            options={requestTemplateOtions}
          />
        </Box>
        <Box flex={{ sm: 1, xl: 'unset' }}>
          <SelectField
            value={filter?.status as number}
            size="sm"
            rounded="md"
            cursor="pointer"
            onChange={(e) => onTemplateStatusChange('status', e.target.value)}
            options={statusOptions}
          />
        </Box>
        <Box flex={{ sm: 1, xl: 'unset' }}>
          <SelectField
            value={filter.dates}
            size="sm"
            rounded="md"
            cursor="pointer"
            onChange={(e) => onTemplateStatusChange('dates', e.target.value)}
            options={dateOptions}
          />
        </Box>
        <Box
          flex={{ sm: 2, xl: 'unset' }}
          flexBasis={{ sm: '100%', xl: '296px' }}
        >
          <InputGroup>
            <Input
              autoFocus
              value={txtSearch}
              type="text"
              placeholder="Enter email"
              fontSize="14px"
              mb={2}
              onChange={(e) => setTxtSearch(e.target.value)}
            />
            <InputRightElement width="40px">
              <TbSearch />
            </InputRightElement>
          </InputGroup>
        </Box>
      </Flex>
      {renderIfAllowed(
        Permissions.VIEW_ALL_TASKS,
        <Flex gap={1}>
          {isAdmin && (
            <WrapItem>
              <Button
                size="md"
                colorScheme={showOnlyMyTask ? 'green' : 'gray'}
                onClick={() =>
                  onTemplateStatusChange(
                    'emailAssign',
                    showOnlyMyTask ? '' : user.email
                  )
                }
                fontSize="sm"
                fontWeight="medium"
                mr={2}
              >
                Only my task
              </Button>
            </WrapItem>
          )}
        </Flex>
      )}
      <Box position={'relative'}>
        <Wrap
          spacing={2}
          position={'absolute'}
          right="48px"
          top={-12}
          hidden={!isLargeScreen}
        >
          {OptionsDisplay.map((item) => (
            <WrapItem key={item.value}>
              <IconButton
                value={item.value}
                colorScheme={item.value === filter.display ? 'green' : 'gray'}
                aria-label="Call Sage"
                fontSize="20px"
                icon={item.icon}
                onClick={(e) => {
                  onTemplateStatusChange('display', +e.currentTarget.value);
                }}
              />
            </WrapItem>
          ))}
        </Wrap>
        {(filter.display === DislayValue.LIST || !isLargeScreen) && (
          <ListTask
            filters={filter}
            setFilter={setFilter}
            openDetailModal={openModal}
          />
        )}
        {filter.display === DislayValue.BOARD && isLargeScreen && (
          <Boards
            filters={{ ...filter, status: filter.status + '' }}
            openDetailModal={openModal}
          />
        )}
      </Box>
      {modalState.taskId.length > 0 && (
        <TaskDetailModal
          isOpen={modalState.isOpen}
          onClose={closeModal}
          taskId={modalState.taskId}
          otherTasks={modalState.otherTasks}
        />
      )}
    </Flex>
  );
};
