import { Box, Flex, Heading } from '@chakra-ui/react';
import { useCurrentUser } from 'hooks/useCurrentUser';
import { Avatar } from '@chakra-ui/react';

interface CurrentUserProps {
  isMobile?: boolean;
}

export const CurrentUser = ({ isMobile }: CurrentUserProps) => {
  const currentUser = useCurrentUser();
  return (
    <Flex
      gap={'10px'}
      flexDirection={isMobile ? 'row-reverse' : 'row'}
      alignItems={'center'}
      justifyContent={'center'}
    >
      <Flex direction={'column'}>
        <Flex
          direction={'column'}
          alignItems={isMobile ? 'flex-start' : 'flex-end'}
        >
          <Heading
            as="h2"
            fontSize={'16px'}
            fontWeight={600}
            lineHeight={'24px'}
            fontFamily={'Montserrat'}
            color={isMobile ? '#ffffff' : undefined}
          >
            {currentUser?.given_name || ''}
          </Heading>
        </Flex>
        <Box
          fontSize={'12px'}
          fontWeight={400}
          lineHeight={'14.4px'}
          color={isMobile ? '#ffffff' : undefined}
          alignItems={isMobile ? 'flex-start' : 'flex-end'}
        >
          {currentUser?.email}
        </Box>
      </Flex>
      <Avatar
        name={currentUser?.given_name || currentUser?.email}
        src={currentUser?.avatar || ''}
        w="54px"
        h="54px"
      />
    </Flex>
  );
};
