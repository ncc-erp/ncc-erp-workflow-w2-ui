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
  QueryKeys,
  TaskStatus,
} from 'common/constants';
import { FilterTasks } from 'models/task';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { TFilterTask } from 'common/types';
import { useIsAdmin } from 'hooks/useIsAdmin';
import { TbSearch } from 'react-icons/tb';
import useDebounced from 'hooks/useDebounced';
import { useCurrentUser } from 'hooks/useCurrentUser';
import { subtractTime } from 'utils/subtractTime';
import { ListTask } from '../../../common/components/Boards/ListTask';
import { TaskDetailModal } from './TaskDetailModal';
import { useQueryClient } from '@tanstack/react-query';
import { FaTable } from 'react-icons/fa';
import { BsCardText } from 'react-icons/bs';

const initialFilter: FilterTasks = {
  skipCount: 0,
  maxResultCount: DEFAULT_TASK_PER_PAGE,
  workflowDefinitionId: '',
  status: -1,
  dates: subtractTime('months', 3),
  keySearch: '',
};

interface ModalDetail {
  isOpen: boolean;
  taskId: string;
}

const initialModalStatus: ModalDetail = {
  isOpen: false,
  taskId: '',
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
  const user = useCurrentUser();
  const [modalState, setModalState] = useState(initialModalStatus);
  const [filter, setFilter] = useState<FilterTasks>({
    ...initialFilter,
    keySearch: user.email,
  });
  const [txtSearch, setTxtSearch] = useState<string>('');
  const [isMyTask, setIsMyTask] = useState<boolean>(true);
  const [display, setDisplay] = useState<number>(0);
  const txtSearchDebounced = useDebounced(txtSearch, 500);
  const isAdmin = useIsAdmin();
  const queryClient = useQueryClient();

  const { data: requestTemplateData } = useRequestTemplates();
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
    (key: TFilterTask, value?: string) => {
      setFilter((filter) => ({ ...filter, [key]: value }));
    },
    []
  );

  const openModal = useCallback(
    (taskId: string) => {
      setModalState({
        ...modalState,
        isOpen: true,
        taskId: taskId,
      });
    },
    [modalState]
  );

  const closeModal = useCallback(() => {
    setModalState({
      ...modalState,
      isOpen: false,
    });
  }, [modalState]);

  useEffect(() => {
    if (isMyTask) {
      onTemplateStatusChange('keySearch', user.email);
    } else {
      onTemplateStatusChange('keySearch', txtSearchDebounced);
    }
  }, [isMyTask, onTemplateStatusChange, txtSearchDebounced, user.email]);

  useEffect(() => {
    queryClient.invalidateQueries([QueryKeys.GET_ALL_TASK_FILTERED]);
    queryClient.invalidateQueries([QueryKeys.GET_ALL_TASK]);
  }, [display, queryClient]);

  return (
    <Flex flexDirection={'column'} gap={2}>
      <Flex px="20px" justifyContent="space-between">
        <Flex gap={3}>
          <Box>
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
          <Box>
            <SelectField
              value={filter.status}
              size="sm"
              rounded="md"
              cursor="pointer"
              onChange={(e) => onTemplateStatusChange('status', e.target.value)}
              options={statusOptions}
            />
          </Box>
          <Box>
            <SelectField
              value={filter.dates}
              size="sm"
              rounded="md"
              cursor="pointer"
              onChange={(e) => onTemplateStatusChange('dates', e.target.value)}
              options={dateOptions}
            />
          </Box>
          {isAdmin && (
            <Box w={'300px'}>
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
          )}
        </Flex>
      </Flex>
      {isAdmin && (
        <Wrap spacing={2} px="20px">
          <WrapItem>
            <Button
              size={'sm'}
              colorScheme={isMyTask ? 'whatsapp' : 'gray'}
              onClick={() => setIsMyTask(!isMyTask)}
            >
              Only My Task
            </Button>
          </WrapItem>
        </Wrap>
      )}

      <Box position={'relative'}>
        <Wrap spacing={2} px="20px" position={'absolute'} right={55} top={-10}>
          {OptionsDisplay.map((item) => (
            <WrapItem key={item.value}>
              <IconButton
                value={item.value}
                colorScheme={item.value === display ? 'green' : 'gray'}
                aria-label="Call Sage"
                fontSize="20px"
                icon={item.icon}
                onClick={(e) => {
                  setDisplay(+e.currentTarget.value);
                }}
              />
            </WrapItem>
          ))}
        </Wrap>
        {display === DislayValue.LIST && (
          <ListTask filters={filter} openDetailModal={openModal} />
        )}
        {display === DislayValue.BOARD && (
          <Boards
            filters={filter}
            openDetailModal={openModal}
            status={filter?.status || -1}
          />
        )}
      </Box>
      {modalState.taskId.length > 0 && (
        <TaskDetailModal
          isOpen={modalState.isOpen}
          onClose={closeModal}
          taskId={modalState.taskId}
        />
      )}
    </Flex>
  );
};
