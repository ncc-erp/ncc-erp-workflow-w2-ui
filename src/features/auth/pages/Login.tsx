import {
  Box,
  Image,
  VStack,
  Heading,
  Button,
  Grid,
  Icon,
  useColorModeValue,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import LoginBackground from 'assets/images/login_background.jpg';
import Logo from 'assets/images/w2_logo.png';
import { PasswordField } from 'common/components/PasswordField';
import { LoginExternalParams, LoginParams } from 'models/user';
import { FcGoogle } from 'react-icons/fc';
import { TextField } from 'common/components/TextField';
import { useLogin, useLoginExternal } from 'api/apiHooks/userHooks';
import { LocalStorageKeys } from 'common/enums';
import { userManager } from 'services/authService';
import { getItem, setItem } from 'utils/localStorage';
import { ColorThemeMode, MaxFailedAccessAttempts } from 'common/constants';
import { useEffect } from 'react';
import { toast } from 'common/components/StandaloneToast';

const initialLoginParams: LoginParams = {
  userNameOrEmailAddress: '',
  password: '',
  rememberMe: true,
};

const Login = () => {
  const bg = useColorModeValue(ColorThemeMode.LIGHT, ColorThemeMode.DARK);
  const redirectURL = getItem(LocalStorageKeys.prevURL)
    ? getItem(LocalStorageKeys.prevURL)
    : '/';

  useEffect(() => {
    const accessToken = getItem(LocalStorageKeys.accessToken);

    if (accessToken) {
      window.location.href = '/';
    }
  }, []);

  const { mutateAsync: loginMutate, isLoading: isLoginLoading } = useLogin();
  const {
    mutateAsync: loginExternalMutate,
    isLoading: isLoginExternalLoading,
  } = useLoginExternal();

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
    const { token, accessFailedCount } = await loginMutate({
      rememberMe,
      userNameOrEmailAddress: userNameOrEmailAddress.trim(),
      password: password.trim(),
    });

    if (token) {
      setItem(LocalStorageKeys.accessToken, token);
      setItem(LocalStorageKeys.prevURL, '');
      window.location.href = redirectURL ?? '/';
      return;
    }

    if (accessFailedCount) {
      const remainingAttempts = MaxFailedAccessAttempts - accessFailedCount;
      toast({
        title: `You have ${remainingAttempts} attempts left before your account is locked`,
        status: 'warning',
      });
      return;
    }

    toast({
      title: `User is locked out!`,
      status: 'error',
    });
  };

  const onLoginExternal = async ({
    provider,
    idToken,
  }: LoginExternalParams) => {
    const { token } = await loginExternalMutate({
      provider,
      idToken,
    });
    if (token) {
      setItem(LocalStorageKeys.accessToken, token);
    }
  };

  const handleLogin = async () => {
    const currentUser = await userManager.signinPopup();
    await onLoginExternal({
      provider: 'Google',
      idToken: currentUser.id_token,
    });
    setItem(LocalStorageKeys.prevURL, '');
    window.location.href = redirectURL ?? '/';
  };

  return (
    <Grid
      templateColumns={{ base: 'auto', xl: '780px 1fr' }}
      backgroundImage={`url(${LoginBackground})`}
      backgroundPosition="60% 50%"
    >
      <VStack
        p={{ base: '14px', md: '38px 44px' }}
        h="100vh"
        backgroundColor={bg}
        alignItems="left"
      >
        <Box width="full">
          <Image h="36px" src={Logo} />
        </Box>
        <VStack
          flex={1}
          mx="auto"
          w={{ base: 'full', md: '380px' }}
          justifyContent="center"
          spacing="20px"
        >
          <Heading as="h1" size="md" textAlign="left" w="full" fontWeight={700}>
            Sign In
          </Heading>
          {(import.meta.env.VITE_MODE == 'development' ||
            import.meta.env.MODE !== 'production') && (
            <form
              style={{ width: '100%' }}
              onSubmit={handleSubmit(onLogin)}
              data-testid="login-form"
            >
              <VStack spacing="14px">
                <TextField
                  h="50px"
                  placeholder="Username or email address"
                  fontSize="sm"
                  error={errors.userNameOrEmailAddress?.message}
                  {...register('userNameOrEmailAddress', {
                    required:
                      'The Username or email address field is required!',
                  })}
                />
                <PasswordField
                  h="50px"
                  placeholder="Password"
                  fontSize="sm"
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
                  mt="14px"
                  h="50px"
                  type="submit"
                  isLoading={isLoginLoading}
                  colorScheme="gray"
                  w="full"
                >
                  Sign in
                </Button>
              </VStack>
            </form>
          )}
          <Button
            isLoading={isLoginExternalLoading}
            onClick={handleLogin}
            w="full"
            h="50px"
            colorScheme="gray"
          >
            <Icon as={FcGoogle} mr="16px" filter="" fontSize="24px" />
            Sign in with Google
          </Button>
        </VStack>
      </VStack>
    </Grid>
  );
};

export default Login;
