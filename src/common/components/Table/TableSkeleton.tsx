import { Stack, StackDivider, Box, Skeleton } from '@chakra-ui/react';

interface TableSkeletonProps {
  width?: string | number;
}

const TableSkeleton = ({ width = '100%' }: TableSkeletonProps): JSX.Element => {
  return (
    <Stack divider={<StackDivider />}>
      <Box>
        <Skeleton
          height="15px"
          borderRadius="10px"
          width={width} // dùng width cố định thay vì minW
        />
      </Box>
    </Stack>
  );
};

export default TableSkeleton;
