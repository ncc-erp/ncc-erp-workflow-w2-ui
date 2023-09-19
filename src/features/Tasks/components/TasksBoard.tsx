import { Box, Center, Flex, IconButton, Spinner } from '@chakra-ui/react';
import { useRequestTemplates } from 'api/apiHooks/requestHooks';
import { useGetAllTask } from 'api/apiHooks/taskHooks';
import Boards from 'common/components/Boards';
import { SelectField } from 'common/components/SelectField';
import { FilterAll, FilterDate, TaskStatus } from 'common/constants';
import { FilterTasks } from 'models/task';
import { useMemo, useState } from 'react';
import { AiOutlineReload } from 'react-icons/ai';
import { subtractTime } from 'utils/subtractTime';
import Select from 'react-select';
import { useUserIdentity } from 'api/apiHooks/userIdentityHooks';
import { FilterUserParams } from 'models/userIdentity';
import { UserSortField } from 'common/enums';
import { TFilterTask } from 'common/types';
import { useIsAdmin } from 'hooks/useIsAdmin';

const initialFilter: FilterTasks = {
  skipCount: 0,
  maxResultCount: 1000, //FIXME: Currently getting 1000 tasks
  workflowDefinitionId: '',
  status: -1,
  dates: '',
  email: '',
};

const initialFilterUser: FilterUserParams = {
  filter: '',
  maxResultCount: 1000, //FIXME: Currently getting 1000 users
  skipCount: 0,
  sorting: [UserSortField.userName, 'asc'].join(' '),
};

export const TasksBoard = () => {
  const [filter, setFilter] = useState<FilterTasks>(initialFilter);

  const isAdmin = useIsAdmin();
  const { data: listUser } = useUserIdentity(initialFilterUser, isAdmin);
  const { data: listTask, isLoading } = useGetAllTask(filter);
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

  const userOptions = useMemo(() => {
    const defaultOptions = {
      value: '',
      label: FilterAll.USER,
    };

    const options =
      listUser?.items?.map(({ email }) => ({
        value: email,
        label: email,
      })) ?? [];

    return [defaultOptions, ...options];
  }, [listUser]);

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
  const onTemplateStatusChange = (key: TFilterTask, value?: string) => {
    setFilter({ ...filter, [key]: value });
  };

  if (isLoading || !listTask) {
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
              <Select
                styles={{
                  control: (baseStyles) => ({
                    ...baseStyles,
                    borderRadius: '0.375rem',
                    borderColor: 'inherit',
                    paddingBottom: 1,
                    fontSize: 14,
                  }),
                }}
                value={{
                  value: filter.email,
                  label: filter.email || FilterAll.USER,
                }}
                options={userOptions}
                onChange={(e) => onTemplateStatusChange('email', e?.value)}
              />
            </Box>
          )}
        </Flex>
        <IconButton
          isRound={true}
          variant="solid"
          aria-label="Done"
          fontSize="20px"
          icon={<AiOutlineReload />}
          onClick={() => setFilter(initialFilter)}
        />
      </Flex>

      {!isLoading && (
        <Boards data={listTask.items} totalCount={listTask.totalCount} />
      )}
    </Box>
  );
};
