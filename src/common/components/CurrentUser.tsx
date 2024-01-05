import { Heading } from '@chakra-ui/react';
import { useCurrentUser } from 'hooks/useCurrentUser';
import { useMediaQuery } from 'hooks/useMediaQuery';

export const CurrentUser = () => {
  const isLargeScreen = useMediaQuery('(min-width: 1024px)');
  const currentUser = useCurrentUser();
  return (
    <Heading
      as="h2"
      fontSize={{ base: 'sm', sm: 'sm', md: 'md' }}
      fontWeight={300}
      display="flex"
      position="absolute"
      top="30px"
      right={isLargeScreen ? '225px' : '54px'}
    >
      {currentUser?.given_name[0] || currentUser?.email}
    </Heading>
  );
};
