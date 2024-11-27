import { Box, Button, Flex, Heading, Text } from '@chakra-ui/react';
import { MaxReleaseContentLine } from 'common/constants';
import Markdown from 'markdown-to-jsx';
import { IReleaseContent } from 'models/request';
import moment from 'moment';
import { Children, useEffect, useRef, useState } from 'react';

export const ReleaseItem = ({ data }: { data: IReleaseContent }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current) {
      // Check line height of the box
      const contentHeight = contentRef.current.scrollHeight;
      const maxHeight =
        parseFloat(getComputedStyle(contentRef.current).lineHeight || '0') *
        MaxReleaseContentLine;
      setIsOverflowing(contentHeight > maxHeight);
    }
  }, [data]);

  return (
    <Box p={6} borderRadius="md" border="1px" borderColor="gray.400">
      <Box
        ref={contentRef}
        overflow="hidden"
        textOverflow="ellipsis"
        whiteSpace="pre-wrap"
        style={{
          display: '-webkit-box',
          WebkitBoxOrient: 'vertical',
          WebkitLineClamp: isExpanded ? undefined : MaxReleaseContentLine, // Adjust the line clamp
        }}
      >
        <Flex alignItems="center" justifyContent="space-between">
          <Heading size="lg" fontWeight="semibold">
            {data.tag_name}
          </Heading>
          <Text>{moment(data.created_at).format('DD-MM-YYYY')}</Text>
        </Flex>

        {data?.body ? (
          <Markdown
            options={{
              overrides: {
                a: {
                  component: (props) => (
                    <a
                      href={props.href}
                      target="_blank"
                      rel="noreferrer noopener"
                      style={{ color: '#0969DA', textDecoration: 'underline' }}
                    >
                      #{props.href?.match(/pull\/(\d+)/)?.[1] || props.href}
                    </a>
                  ),
                },
                p: {
                  component: (props) => (
                    <Box mt="1rem">
                      <Text size="md">{props.children}</Text>
                    </Box>
                  ),
                },
                h2: {
                  component: (props) => (
                    <Box mt="1rem" mb="1rem">
                      <Heading pb="1rem" size="md">
                        {props.children}
                      </Heading>
                      <Box borderTop="1px" borderColor="gray.200" />
                    </Box>
                  ),
                },

                li: {
                  component: ({ children }: { children: React.ReactNode }) => {
                    // Handles children to make text starting with "@" bold
                    const processedChildren = Children.map(
                      children,
                      (child) => {
                        if (typeof child === 'string') {
                          // Split words and wrap words starting with "@"
                          const regex = /(@[\w-]+)/g;
                          const parts = child
                            .split(regex)
                            .map((part, index) => {
                              if (part.startsWith('@')) {
                                const username = part.slice(1); // Remove @ sign
                                return (
                                  <a
                                    key={index}
                                    href={`https://github.com/${username}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{
                                      fontWeight: '600',
                                      textDecoration: 'underline',
                                      color: 'none',
                                    }}
                                  >
                                    {part}
                                  </a>
                                );
                              }

                              return part;
                            });

                          return <>{parts}</>;
                        }

                        // Keep non-string nodes
                        return child;
                      }
                    );

                    return <li>{processedChildren}</li>;
                  },
                },
              },
            }}
            children={data.body}
          />
        ) : (
          <></>
        )}
      </Box>

      {isOverflowing && (
        <Box>
          <Button
            size="sm"
            mt="4"
            onClick={() => setIsExpanded(!isExpanded)}
            colorScheme="blue"
            variant="link"
          >
            {isExpanded ? 'Read Less' : 'Read More'}
          </Button>
        </Box>
      )}
    </Box>
  );
};
