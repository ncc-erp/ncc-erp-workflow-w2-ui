import {
  Box,
  Image,
  VStack,
  Heading,
  Button,
  Grid,
  Icon,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { CodeResponse, useGoogleLogin } from '@react-oauth/google';
import LoginBackground from 'assets/images/login_background.jpg';
import Logo from 'assets/images/w2_logo.png';
import { PasswordField } from 'common/components/PasswordField';
import { LoginParams } from 'models/user';
import { FcGoogle } from 'react-icons/fc';
import { TextField } from 'common/components/TextField';
import { useLogin } from 'api/apiHooks/userHooks';
import { LoginStatus } from 'common/enums';
import { useNavigate } from 'react-router-dom';
import { toast } from 'common/components/StandaloneToast';

type GoogleResponse = Omit<
  CodeResponse,
  'error' | 'error_description' | 'error_uri'
>;

const initialLoginParams: LoginParams = {
  userNameOrEmailAddress: '',
  password: '',
  rememberMe: true,
};

const Login = () => {
  const navigate = useNavigate();
  const { mutateAsync: loginMutate, isLoading } = useLogin();

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<LoginParams>({ defaultValues: initialLoginParams });

  const onLogin = async ({
    userNameOrEmailAddress,
    password,
    rememberMe,
  }: LoginParams) => {
    const { result } = await loginMutate({
      rememberMe,
      userNameOrEmailAddress: userNameOrEmailAddress.trim(),
      password: password.trim(),
    });

    if (result === LoginStatus.success) {
      navigate('/');
      return;
    }

    toast({
      title: 'Login Failed!',
      description: 'Invalid username or password!',
      status: 'error',
    });
  };

  const onGoogleLogin = (codeResponse: GoogleResponse) => {
    console.log(codeResponse);
    // TODO
  };

  const login = useGoogleLogin({
    flow: 'auth-code',
    ux_mode: 'popup',
    redirect_uri: import.meta.env.VITE_GOOGLE_LOGIN_REDIRECT,
    onSuccess: onGoogleLogin,
  });

  return (
    <Grid
      templateColumns={{ base: 'auto', xl: '780px 1fr' }}
      backgroundImage={`url(${LoginBackground})`}
      backgroundPosition='60% 50%'
    >
      <VStack
        p={{ base: '14px', md: '38px 44px' }}
        h='100vh'
        backgroundColor='white'
        alignItems='left'
      >
        <Box width='full'>
          <Image
            h='36px'
            src={Logo}
          />
        </Box>
        <VStack
          flex={1}
          mx='auto'
          w={{ base: 'full', md: '380px' }}
          justifyContent='center'
          spacing='20px'
        >
          <Heading
            as='h1'
            size='md'
            textAlign='left'
            w='full'
            fontWeight={700}
          >
            Sign In
          </Heading>
          <form
            style={{ width: '100%' }}
            onSubmit={handleSubmit(onLogin)}
          >
            <VStack spacing='14px'>
              <TextField
                h='50px'
                placeholder='Username or email address'
                fontSize='sm'
                error={errors.userNameOrEmailAddress?.message}
                {...register('userNameOrEmailAddress', {
                  required: 'The Username or email address field is required!',
                })}
              />
              <PasswordField
                h='50px'
                placeholder='Password'
                fontSize='sm'
                error={errors.password?.message}
                {...register('password', {
                  required: 'The password field is required!',
                })}
                iconsProps={{
                  w: '18px',
                  h: '18px',
                }}
                buttonProps={{
                  mr: '10px',
                }}
              />
              <Button
                mt='14px'
                h='50px'
                type='submit'
                isLoading={isLoading}
                colorScheme='blackButton'
                w='full'
                textColor='white'
              >
                Sign in
              </Button>
            </VStack>
          </form>
          <Button
            onClick={login}
            w='full'
            h='50px'
          >
            <Icon
              as={FcGoogle}
              mr='16px'
              filter=''
              fontSize='24px'
            />
            Sign in with Google
          </Button>
        </VStack>
      </VStack>
    </Grid>
  );
};

export default Login;
