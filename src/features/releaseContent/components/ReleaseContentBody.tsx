import { Box, Flex, Skeleton } from '@chakra-ui/react';
import { useReleaseContent } from 'api/apiHooks/releaseContentHooks';
import { useCallback, useMemo } from 'react';
import { ReleaseItem } from './ReleaseItem';
import { IReleaseContent } from 'models/request';
import { useTranslation } from 'react-i18next';

export const ReleaseContentBody = () => {
  const { data: releaseContent, isLoading } = useReleaseContent();
  const { t } = useTranslation();
  const mergeSections = useCallback(
    (text?: string): string => {
      const whatsChangedKey = t('RELEASE_CONTENT.WHATS_CHANGED');
      const newContributorsKey = t('RELEASE_CONTENT.NEW_CONTRIBUTORS');
      const fullChangelogKey = t('RELEASE_CONTENT.FULL_CHANGELOG');

      const sections: {
        current?: string;
        [key: string]: string[] | string | undefined;
      } = {
        [whatsChangedKey]: [],
        [newContributorsKey]: [],
      };

      const fullChangelogLinks: string[] = [];

      text?.split('\n').forEach((line) => {
        if (
          line.startsWith("## What's Changed") ||
          line.startsWith(`## ${whatsChangedKey}`)
        ) {
          sections.current = whatsChangedKey;
        } else if (
          line.startsWith('## New Contributors') ||
          line.startsWith(`## ${newContributorsKey}`)
        ) {
          sections.current = newContributorsKey;
        } else if (
          line.startsWith('## Full Changelog') ||
          line.startsWith(`## ${fullChangelogKey}`) ||
          line.startsWith('Full Changelog:')
        ) {
          sections.current = 'fullChangelog';
        } else if (sections.current && line.trim()) {
          if (sections.current === 'fullChangelog') {
            const trimmedLine = line.trim();
            if (trimmedLine.startsWith('*') || trimmedLine.startsWith('·')) {
              fullChangelogLinks.push(trimmedLine.substring(1).trim());
            } else if (trimmedLine) {
              fullChangelogLinks.push(trimmedLine);
            }
            return;
          }

          const currentSection = sections[sections.current];
          if (Array.isArray(currentSection)) {
            if (line.includes('**Full Changelog**:')) {
              const changelogMatch = line.match(
                /\*\*Full Changelog\*\*:\s*(.+)/
              );
              if (changelogMatch && changelogMatch[1]) {
                fullChangelogLinks.push(changelogMatch[1].trim());
              }

              return;
            }

            currentSection.push(line.trim());
          }
        }
      });

      // ✅ Combine sections chính
      let result = Object.entries(sections)
        .filter(
          ([key, firstValue]) =>
            key !== 'current' &&
            key !== 'fullChangelog' &&
            Array.isArray(firstValue) &&
            firstValue.length
        )
        .map(([key, values]) => {
          if (Array.isArray(values)) {
            return `## ${key}\n${values.join('\n')}`;
          }
          return '';
        })
        .filter(Boolean)
        .join('\n\n');

      if (fullChangelogLinks.length > 0) {
        const uniqueLinks = [...new Set(fullChangelogLinks)];
        result += `\n\n## ${fullChangelogKey}\n${uniqueLinks
          .map((link) => `* ${link}`)
          .join('\n')}`;
      }

      return result;
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

          const existedBody = existingItem.body
            .replace(/## Full Changelog[\s\S]*$/, '')
            .trim();
          const incomingBody = item?.body
            ?.replace(/## Full Changelog[\s\S]*$/, '')
            .trim();

          existingItem.body = mergeSections(`${existedBody}\n${incomingBody}`);
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
  }, [releaseContent, mergeSections]);

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
