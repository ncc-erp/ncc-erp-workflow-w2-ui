import { Stack, StackDivider, Box, Skeleton } from '@chakra-ui/react';

const TableSkeleton = (): JSX.Element => {
  return (
    <Stack divider={<StackDivider />}>
      <Box>
        <Skeleton
          height="15px"
          borderRadius="10px"
          minW={{ base: '120px', md: '42px', lg: 'auto' }}
        />
      </Box>
    </Stack>
  );
};

export default TableSkeleton;
