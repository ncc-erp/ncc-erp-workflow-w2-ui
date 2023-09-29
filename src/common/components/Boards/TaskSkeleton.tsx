import {
  Card,
  CardHeader,
  CardBody,
  Stack,
  StackDivider,
  Box,
  Skeleton,
  Flex,
} from '@chakra-ui/react';

const TaskSkeleton = (): JSX.Element => {
  return (
    <Card>
      <CardHeader>
        <Flex justifyContent={'space-between'}>
          <Skeleton height="20px" w={'50%'} />
          <Skeleton height="20px" w={'10%'} />
        </Flex>
      </CardHeader>

      <CardBody>
        <Stack divider={<StackDivider />} spacing="">
          <Box>
            <Skeleton height="20px" />
            <Skeleton height="20px" />
            <Skeleton height="20px" />
          </Box>
        </Stack>
      </CardBody>
    </Card>
  );
};

export default TaskSkeleton;
