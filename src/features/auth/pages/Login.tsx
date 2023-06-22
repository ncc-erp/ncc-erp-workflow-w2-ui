import { Button, Flex } from '@chakra-ui/react';
import { useGoogleLogin } from '@react-oauth/google';

const Login = () => {
  const login = useGoogleLogin({
    onSuccess: (codeResponse) => console.log(codeResponse),
    flow: 'auth-code',
    ux_mode: 'redirect',
    redirect_uri: import.meta.env.VITE_GOOGLE_LOGIN_REDIRECT,
  });

  return (
    <Flex
      height='100vh'
      alignItems='center'
      justifyContent='center'
    >
      <Button onClick={login}>login</Button>
    </Flex>
  );
};

export default Login;
