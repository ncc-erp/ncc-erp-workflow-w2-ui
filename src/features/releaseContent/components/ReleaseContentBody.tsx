import { Box, Flex, Skeleton } from '@chakra-ui/react';
import { useReleaseContent } from 'api/apiHooks/releaseContentHooks';
import { useMemo } from 'react';
import { ReleaseItem } from './ReleaseItem';
import { IReleaseContent } from 'models/request';

export const ReleaseContentBody = () => {
  const { data: releaseContent, isLoading } = useReleaseContent();

  const mergeSections = (text: string): string => {
    const sections: {
      current?: "## What's Changed" | '## New Contributors';
      "## What's Changed": string[];
      '## New Contributors': string[];
    } = {
      "## What's Changed": [],
      '## New Contributors': [],
    };

    // Split the input string line by line and process each line
    text.split('\n').forEach((line) => {
      if (line.startsWith("## What's Changed")) {
        sections.current = "## What's Changed";
      } else if (line.startsWith('## New Contributors')) {
        sections.current = '## New Contributors';
      } else if (sections.current && line.trim()) {
        sections[sections.current].push(line.trim());
      }
    });

    // Combine parts into a string
    return Object.entries(sections)
      .filter(([key, firstValue]) => key !== 'current' && firstValue.length)
      .map(([key, values]) => {
        // Cast the value as a string array
        if (Array.isArray(values)) {
          return `${key}\n${values.join('\n')}`;
        }
        return '';
      })
      .filter(Boolean) // remove empty
      .join('\n\n');
  };

  const releaseData = useMemo(() => {
    if (releaseContent?.length) {
      const map = new Map();
      releaseContent.forEach((item) => {
        if (!map.has(item.tag_name)) {
          // Initialize a new object for base on version tag_name
          map.set(item.tag_name, { ...item });
        } else {
          const existingItem = map.get(item.tag_name);
          const existed = existingItem.body.split('**Full Changelog**:');
          const incoming = item?.body?.split('**Full Changelog**:');

          existingItem.body = mergeSections(
            `${existed[0]} \r\n${incoming?.[0]}`
          );

          // if existed have change log
          if (existed[1] || incoming?.[1]) {
            existingItem.body += ` \n\n**Full Changelog**: `;
            if (existed[1]) existingItem.body += ` \r\n* ${existed[1]}`;
            if (incoming?.[1]) existingItem.body += ` \r\n* ${incoming?.[1]}`;
          }
        }
      });

      const mergedArray: IReleaseContent[] = Array.from(map.values());

      return mergedArray.sort((a, b) => {
        // If a.create_at is null, it will be ranked before b.create_at (if b.create_at is not null)
        if (!a?.created_at) return 1;
        if (!b?.created_at) return -1;

        // If both are not null, sort by time
        return (
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      });
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
