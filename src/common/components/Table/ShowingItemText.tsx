import { Text } from '@chakra-ui/react';

interface ShowingItemTextProps {
  skipCount: number;
  maxResultCount: number;
  totalCount: number;
}

export const ShowingItemText = ({
  skipCount,
  maxResultCount,
  totalCount,
}: ShowingItemTextProps) => {
  const from = skipCount + 1;
  const to =
    maxResultCount + skipCount > totalCount
      ? totalCount
      : maxResultCount + skipCount;

  return (
    <Text whiteSpace="nowrap" fontSize="xs">
      {`showing ${from} to ${to} of ${totalCount} entries`}
    </Text>
  );
};
