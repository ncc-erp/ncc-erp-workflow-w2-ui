import { Box, Flex, Skeleton } from '@chakra-ui/react';
import { useReleaseContent } from 'api/apiHooks/releaseContentHooks';
import { useCallback, useMemo } from 'react';
import { ReleaseItem } from './ReleaseItem';
import { IReleaseContent } from 'models/request';
import { useTranslation } from 'react-i18next';

export const ReleaseContentBody = () => {
  const { t } = useTranslation();
  const { data: releaseContent, isLoading } = useReleaseContent();

  const mergeSections = useCallback(
    (text?: string): string => {
      const whatsChangedKey = t('RELEASE_CONTENT.WHATS_CHANGED');
      const newContributorsKey = t('RELEASE_CONTENT.NEW_CONTRIBUTORS');
      const fullChangelogKey = t('RELEASE_CONTENT.FULL_CHANGELOG');
      if (!text) {
        return '';
      }

      return (
        text
          .replace(/## What's Changed/g, `## ${whatsChangedKey}`)
          .replace(/## New Contributors/g, `## ${newContributorsKey}`)
          .replace(/\*\*Full Changelog\*\*/g, `**${fullChangelogKey}**`) || ''
      );
    },
    [t]
  );

  const releaseData = useMemo(() => {
    if (releaseContent?.length) {
      const map = new Map();
      releaseContent.forEach((item) => {
        if (!map.has(item.tag_name)) {
          const translatedItem = {
            ...item,
            body: mergeSections(item.body),
          };
          map.set(item.tag_name, translatedItem);
        } else {
          const existingItem = map.get(item.tag_name);
          const fullChangelogText = t('RELEASE_CONTENT.FULL_CHANGELOG');
          const existed = existingItem.body.split(`**${fullChangelogText}**:`);
          const incoming = item?.body?.split('**Full Changelog**:');

          existingItem.body = mergeSections(
            `${existed[0]} \r\n${incoming?.[0]}`
          );

          // if existed have change log
          if (existed[1] || incoming?.[1]) {
            existingItem.body += ` \n\n**${fullChangelogText}**: `;
            if (existed[1]) existingItem.body += ` \r\n* ${existed[1]}`;
            if (incoming?.[1]) existingItem.body += ` \r\n* ${incoming?.[1]}`;
          }
        }
      });

      const mergedArray: IReleaseContent[] = Array.from(map.values());
      return mergedArray.sort((a, b) => {
        if (!a?.created_at) return 1;
        if (!b?.created_at) return -1;
        return (
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      });
    }

    return [];
  }, [releaseContent, t, mergeSections]);

  if (isLoading) {
    return (
      <Flex flexDirection={'column'} gap={2}>
        <Flex gap={4} flexDirection={'column'} justifyContent="space-between">
          {new Array(8).fill(null).map((_, ind) => (
            <Skeleton key={ind} height="100px" w={'100%'} />
          ))}
        </Flex>
      </Flex>
    );
  }

  return (
    <Flex flexDirection={'column'} gap={2}>
      <Flex gap={2} flexDirection={'column'} justifyContent="space-between">
        {releaseData?.map((x, index) => (
          <Box key={index}>
            <ReleaseItem data={x} />
          </Box>
        ))}
      </Flex>
    </Flex>
  );
};
