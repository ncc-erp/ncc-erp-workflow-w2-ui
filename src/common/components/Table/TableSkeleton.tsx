import { Stack, StackDivider, Box, Skeleton } from '@chakra-ui/react';

const TableSkeleton = (): JSX.Element => {
  return (
    <Stack divider={<StackDivider />} spacing="">
      <Box>
        <Skeleton height="15px" borderRadius="10px" />
      </Box>
    </Stack>
  );
};

export default TableSkeleton;
