import {
  Box,
  Button,
  Center,
  Flex,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Spinner,
  Wrap,
  WrapItem,
} from '@chakra-ui/react';
import { useRequestTemplates } from 'api/apiHooks/requestHooks';
import { useGetAllTask } from 'api/apiHooks/taskHooks';
import Boards from 'common/components/Boards';
import { SelectField } from 'common/components/SelectField';
import {
  DEFAULT_TASK_PER_PAGE,
  FilterAll,
  FilterDate,
  TaskStatus,
} from 'common/constants';
import { FilterTasks } from 'models/task';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { AiOutlineReload } from 'react-icons/ai';
import { TFilterTask } from 'common/types';
import { useIsAdmin } from 'hooks/useIsAdmin';
import { getAllTaskPagination } from 'utils/getAllTaskPagination';
import { TbSearch } from 'react-icons/tb';
import useDebounced from 'hooks/useDebounced';
import debounce from 'lodash.debounce';
import { useCurrentUser } from 'hooks/useCurrentUser';
import { subtractTime } from 'utils/subtractTime';

const initialFilter: FilterTasks = {
  skipCount: 0,
  maxResultCount: DEFAULT_TASK_PER_PAGE,
  workflowDefinitionId: '',
  status: -1,
  // dates: '',
  keySearch: '',
};

export const TasksBoard = () => {
  const isAdmin = useIsAdmin();
  const user = useCurrentUser();

  const [filter, setFilter] = useState<FilterTasks>({
    ...initialFilter,
    keySearch: user.email,
  });
  const [txtSearch, setTxtSearch] = useState<string>('');
  const [isMyTask, setIsMyTask] = useState<boolean>(true);

  const txtSearchDebounced = useDebounced(txtSearch, 500);

  const {
    data: listPending,
    isLoading: loadPending,
    fetchNextPage: fetchNextPagePending,
    refetch: refetchPending,
    isRefetching: isRefetchingPending,
  } = useGetAllTask({ ...filter }, TaskStatus.Pending);
  const {
    data: listApproved,
    isLoading: loadApproved,
    fetchNextPage: fetchNextPageApproved,
    refetch: refetchApproved,
    isRefetching: isRefetchingApproved,
  } = useGetAllTask({ ...filter }, TaskStatus.Approved);
  const {
    data: listRejected,
    isLoading: loadRejected,
    fetchNextPage: fetchNextPageRejected,
    refetch: refetchRejected,
    isRefetching: isRefetchingRejected,
  } = useGetAllTask({ ...filter }, TaskStatus.Rejected);

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

  useEffect(() => {
    if (isMyTask) {
      onTemplateStatusChange('keySearch', user.email);
    } else {
      onTemplateStatusChange('keySearch', txtSearchDebounced);
    }
  }, [isMyTask, onTemplateStatusChange, txtSearchDebounced, user.email]);

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
        <IconButton
          isRound={true}
          variant="solid"
          aria-label="Done"
          fontSize="20px"
          icon={<AiOutlineReload />}
          onClick={debounce(() => {
            if (!filter.status) return;
            switch (+filter?.status) {
              case TaskStatus.Pending:
                refetchPending();
                break;
              case TaskStatus.Approved:
                refetchApproved();
                break;
              case TaskStatus.Rejected:
                refetchRejected();
                break;
              default:
                refetchPending();
                refetchApproved();
                refetchRejected();
                break;
            }
          }, 200)}
        />
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

      {!(
        loadApproved ||
        loadPending ||
        loadRejected ||
        isRefetchingPending ||
        isRefetchingApproved ||
        isRefetchingRejected
      ) ? (
        <Boards
          refetchPending={refetchPending}
          refetchApproved={refetchApproved}
          refetchRejected={refetchRejected}
          fetchNextPagePending={fetchNextPagePending}
          fetchNextPageApproved={fetchNextPageApproved}
          fetchNextPageRejected={fetchNextPageRejected}
          data={{
            listPending: getAllTaskPagination(
              listPending ? listPending?.pages : []
            ),
            listApproved: getAllTaskPagination(
              listApproved ? listApproved?.pages : []
            ),
            listRejected: getAllTaskPagination(
              listRejected ? listRejected?.pages : []
            ),
          }}
          status={filter?.status || -1}
        />
      ) : (
        <Center h="200px">
          <Spinner mx="auto" speed="0.65s" thickness="3px" size="xl" />
        </Center>
      )}
    </Flex>
  );
};
