import { ColumnDef, createColumnHelper } from '@tanstack/react-table';
import { Box, Progress, Stack } from '@chakra-ui/react';
import { IPostAndWFH } from 'models/manage';

const columnHelper = createColumnHelper<IPostAndWFH>();

export const getPercentPostWFH = (
  numOfPosts: number,
  numOfRequestWFH: number
) => {
  return (numOfPosts / numOfRequestWFH) * 100;
};

export const postAndWTFColumns = [
  columnHelper.accessor('userId', {
    id: 'userId',
    header: () => <Box pl="16px">User ID</Box>,
    enableSorting: false,
    cell: (info) => <Box pl="16px">{info.getValue()}</Box>,
  }),
  columnHelper.accessor('email', {
    id: 'email',
    header: 'Email',
    enableSorting: false,
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('numOfPosts', {
    id: 'numOfPosts',
    header: 'Number of posts',
    enableSorting: false,
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('numOfRequestWFH', {
    id: 'numOfRequestWFH',
    header: 'Number of requests for WFH',
    enableSorting: false,
    cell: (info) => info.getValue(),
  }),
  columnHelper.display({
    id: 'status',
    enableSorting: false,
    header: () => <Box pr="16px">Status</Box>,
    cell: (info) => {
      const percent = getPercentPostWFH(
        info.row.original.numOfPosts,
        info.row.original.numOfRequestWFH
      );
      return (
        <Stack minW={200} pr="16px">
          <Progress
            w={'100%'}
            colorScheme={percent >= 100 ? 'green' : 'blue'}
            size="sm"
            value={percent}
          />
        </Stack>
      );
    },
  }),
] as ColumnDef<IPostAndWFH>[];
