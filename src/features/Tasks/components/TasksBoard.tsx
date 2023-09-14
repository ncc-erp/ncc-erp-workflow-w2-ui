import { Box, Center, HStack, Spinner } from '@chakra-ui/react';
import { useMyRequests, useRequestTemplates } from 'api/apiHooks/requestHooks';
import Boards from 'common/components/Boards';
import { SelectField } from 'common/components/SelectField';
import { noOfRows } from 'common/constants';
import { RequestSortField, RequestStatus } from 'common/enums';
import { FilterRequestParams } from 'models/request';
import { ChangeEvent, useMemo, useState } from 'react';

const initialFilter: FilterRequestParams = {
  Status: '',
  WorkflowDefinitionId: '',
  sorting: [RequestSortField.createdAt, 'desc'].join(' '),
  skipCount: 0,
  maxResultCount: +noOfRows[0].value,
};

export const TasksBoard = () => {
  const [filter, setFilter] = useState<FilterRequestParams>(initialFilter);

  const { data, isLoading } = useMyRequests(filter);
  const { data: requestTemplateData } = useRequestTemplates();

  const requestTemplates = useMemo(() => {
    if (requestTemplateData?.items) {
      return requestTemplateData.items;
    }

    return [];
  }, [requestTemplateData]);

  const statusOptions = useMemo(() => {
    const defaultOptions = {
      value: '',
      label: 'All status',
    };

    const options = Object.values(RequestStatus).map((value) => ({
      value,
      label: value,
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
    (key: 'Status' | 'WorkflowDefinitionId') =>
    (event: ChangeEvent<HTMLSelectElement>) => {
      const value = event.target.value;
      setFilter({ ...filter, [key]: value });
    };

  if (isLoading || !data) {
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
            value={filter.WorkflowDefinitionId}
            cursor="pointer"
            size="sm"
            rounded="md"
            onChange={onTemplateStatusChange('WorkflowDefinitionId')}
            options={requestTemplateOtions}
          />
        </Box>
        <Box w="112px">
          <SelectField
            value={filter.Status}
            size="sm"
            rounded="md"
            cursor="pointer"
            onChange={onTemplateStatusChange('Status')}
            options={statusOptions}
          />
        </Box>
      </HStack>

      {!isLoading && <Boards data={data} />}
    </Box>
  );
};
