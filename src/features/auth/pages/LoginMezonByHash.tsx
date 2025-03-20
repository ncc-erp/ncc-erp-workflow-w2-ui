import { Box, Center, Heading, Image, Spinner } from '@chakra-ui/react';
import LoginBackground from 'assets/images/login_background.jpg';
import Logo from 'assets/images/w2_logo.png';
import { useMezonLogin } from 'hooks/useMezonLogin';
import React from 'react';
import theme from 'themes/theme';

const LoginMezonByHash: React.FC = () => {
  const { isLoginMezonLoading, loginMezonFailed } = useMezonLogin();

  return (
    <Box backgroundImage={`url(${LoginBackground})`} height="100dvh">
      <Box padding={8}>
        <Image h="36px" src={Logo} />
      </Box>
      <Center position={'absolute'} bottom={0} top={0} left={0} right={0}>
        {loginMezonFailed && !isLoginMezonLoading && (
          <Heading as="h1" size="xl" color={'white'}>
            Login failed. Please try again!!!
          </Heading>
        )}
        {isLoginMezonLoading && (
          <Spinner size="xl" color={theme.colors.green[700]} />
        )}
      </Center>
    </Box>
  );
};

export default LoginMezonByHash;
