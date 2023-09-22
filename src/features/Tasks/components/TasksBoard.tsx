import {
  Box,
  Center,
  Flex,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Spinner,
} from '@chakra-ui/react';
import { useRequestTemplates } from 'api/apiHooks/requestHooks';
import { useGetAllTask } from 'api/apiHooks/taskHooks';
import Boards from 'common/components/Boards';
import { SelectField } from 'common/components/SelectField';
import { DEFAULT_TASK_PER_PAGE, FilterAll, TaskStatus } from 'common/constants';
import { FilterTasks } from 'models/task';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { AiOutlineReload } from 'react-icons/ai';
import { TFilterTask } from 'common/types';
import { useIsAdmin } from 'hooks/useIsAdmin';
import { getAllTaskPagination } from 'utils/getAllTaskPagination';
import { TbSearch } from 'react-icons/tb';
import useDebounced from 'hooks/useDebounced';

const initialFilter: FilterTasks = {
  skipCount: 0,
  maxResultCount: DEFAULT_TASK_PER_PAGE,
  workflowDefinitionId: '',
  status: -1,
  // dates: '',
  keySearch: '',
};

export const TasksBoard = () => {
  const [filter, setFilter] = useState<FilterTasks>(initialFilter);
  const [txtSearch, setTxtSearch] = useState<string>('');

  const txtSearchDebounced = useDebounced(txtSearch, 500);
  const isAdmin = useIsAdmin();

  const {
    data: listPending,
    isLoading: loadPending,
    fetchNextPage: fetchNextPagePending,
  } = useGetAllTask({ ...filter }, TaskStatus.Pending);
  const {
    data: listApproved,
    isLoading: loadApproved,
    fetchNextPage: fetchNextPageApproved,
  } = useGetAllTask({ ...filter }, TaskStatus.Approved);
  const {
    data: listRejected,
    isLoading: loadRejected,
    fetchNextPage: fetchNextPageRejected,
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

  // const dateOptions = useMemo(() => {
  //   const defaultOptions = {
  //     value: '',
  //     label: FilterAll.DATE,
  //   };

  //   const options = Object.values(FilterDate).map((value) => ({
  //     value: subtractTime(value.split(' ')[1], +value.split(' ')[0]),
  //     label: value,
  //   }));

  //   return [defaultOptions, ...options];
  // }, []);

  const onTemplateStatusChange = useCallback(
    (key: TFilterTask, value?: string) => {
      setFilter((filter) => ({ ...filter, [key]: value }));
    },
    []
  );

  useEffect(() => {
    onTemplateStatusChange('keySearch', txtSearchDebounced);
  }, [onTemplateStatusChange, txtSearchDebounced]);

  if (
    loadApproved ||
    loadPending ||
    loadRejected ||
    !listPending ||
    !listApproved ||
    !listRejected
  ) {
    return (
      <Center h="200px">
        <Spinner mx="auto" speed="0.65s" thickness="3px" size="xl" />
      </Center>
    );
  }

  return (
    <Box>
      <Flex pb="8px" paddingInline="20px" justifyContent="space-between">
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
          {/* <Box>
            <SelectField
              value={filter.dates}
              size="sm"
              rounded="md"
              cursor="pointer"
              onChange={(e) => onTemplateStatusChange('dates', e.target.value)}
              options={dateOptions}
            />
          </Box> */}
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
          onClick={() => {
            setFilter(initialFilter);
            setTxtSearch('');
          }}
        />
      </Flex>

      {!(loadApproved || loadPending || loadRejected) && (
        <Boards
          fetchNextPagePending={fetchNextPagePending}
          fetchNextPageApproved={fetchNextPageApproved}
          fetchNextPageRejected={fetchNextPageRejected}
          data={{
            listPending: getAllTaskPagination(listPending?.pages),
            listApproved: getAllTaskPagination(listApproved?.pages),
            listRejected: getAllTaskPagination(listRejected?.pages),
          }}
          status={filter?.status || -1}
        />
      )}
    </Box>
  );
};
