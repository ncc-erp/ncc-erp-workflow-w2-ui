import { Box, Flex, Skeleton } from '@chakra-ui/react';
import { useReleaseContent } from 'api/apiHooks/releaseContentHooks';
import { useMemo } from 'react';
import { ReleaseItem } from './ReleaseItem';

export const ReleaseContentBody = () => {
  const { data: releaseContent, isLoading } = useReleaseContent();

  const releaseData = useMemo(() => {
    if (releaseContent?.length) {
      return releaseContent;
    }

    return [];
  }, [releaseContent]);

  if (isLoading) {
    return (
      <Flex flexDirection={'column'} gap={2} w={['100vw', 'auto']}>
        <Flex
          px="24px"
          gap={4}
          flexDirection={'column'}
          justifyContent="space-between"
        >
          {new Array(8).fill(null).map((_, ind) => (
            <Skeleton key={ind} height="100px" w={'100%'} />
          ))}
        </Flex>
      </Flex>
    );
  }

  return (
    <Flex flexDirection={'column'} gap={2} w={['100vw', 'auto']}>
      <Flex
        px="24px"
        gap={2}
        flexDirection={'column'}
        justifyContent="space-between"
      >
        {releaseData?.map((x, index) => (
          <Box key={index}>
            <ReleaseItem data={x} />
          </Box>
        ))}
      </Flex>
    </Flex>
  );
};
