import { Box, Center, HStack, Spinner } from '@chakra-ui/react';
import { useRequestTemplates } from 'api/apiHooks/requestHooks';
import { useAllTask } from 'api/apiHooks/taskHooks';
import Boards from 'common/components/Boards';
import { SelectField } from 'common/components/SelectField';
import { BoardColumnStatus } from 'common/constants';
import { FilterTasks } from 'models/task';
import { ChangeEvent, useMemo, useState } from 'react';

const initialFilter: FilterTasks = {
  skipCount: 0,
  maxResultCount: 1000,
};

export const TasksBoard = () => {
  const [filter, setFilter] = useState<FilterTasks>(initialFilter);

  const { data: listTask, isLoading } = useAllTask(filter);
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
      label: 'All status',
    };

    const options = Object.entries(BoardColumnStatus).map(([key, value]) => ({
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

  const onTemplateStatusChange =
    (key: 'status' | 'WorkflowDefinitionId') =>
    (event: ChangeEvent<HTMLSelectElement>) => {
      const value = event.target.value;
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
      <HStack w="full" pl="24px" pb="8px" alignItems="flex-end" flexWrap="wrap">
        <Box w="220px">
          <SelectField
            cursor="pointer"
            value={''}
            size="sm"
            rounded="md"
            onChange={onTemplateStatusChange('WorkflowDefinitionId')}
            options={requestTemplateOtions}
          />
        </Box>
        <Box w="112px">
          <SelectField
            value={filter.status}
            size="sm"
            rounded="md"
            cursor="pointer"
            onChange={onTemplateStatusChange('status')}
            options={statusOptions}
          />
        </Box>
      </HStack>

      {!isLoading && <Boards data={listTask} />}
    </Box>
  );
};
