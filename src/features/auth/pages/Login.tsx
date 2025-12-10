import {
  Box,
  Image,
  VStack,
  Heading,
  Button,
  Grid,
  useColorModeValue,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import LoginBackground from 'assets/images/login_background.jpg';
import Logo from 'assets/images/w2_logo.png';
import { PasswordField } from 'common/components/PasswordField';
import { LoginParams } from 'models/user';
import { TextField } from 'common/components/TextField';
import { useMezonAuthUrl, useLogin } from 'api/apiHooks/userHooks';
import { LocalStorageKeys } from 'common/enums';
import { getItem, setItem } from 'utils/localStorage';
import { ColorThemeMode, MaxFailedAccessAttempts } from 'common/constants';
import { useEffect } from 'react';
import { toast } from 'common/components/StandaloneToast';
import SvgMezon from 'assets/svg/mezon-logo-black.svg';

const initialLoginParams: LoginParams = {
  userNameOrEmailAddress: '',
  password: '',
  rememberMe: true,
};

const Login = () => {
  const bg = useColorModeValue(ColorThemeMode.LIGHT, ColorThemeMode.DARK);

  // Mezon button styles
  const mezonBtnColor = useColorModeValue('white', 'stone.900');
  const mezonBtnBackground = useColorModeValue('stone.900', 'stone.100');
  const mezonBtnHoverBackground = useColorModeValue('stone.700', 'stone.300');

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
  const { mutateAsync: getMezonAuthUrl, isLoading: isMezonLoginLoading } =
    useMezonAuthUrl();

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

  const handleLoginWithMezon = async () => {
    const mezonAuthUrl = await getMezonAuthUrl(null);
    if (mezonAuthUrl) {
      window.location.href = mezonAuthUrl;
    }
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

          {/* Mezon Login Button */}
          <Button
            isLoading={isMezonLoginLoading}
            onClick={handleLoginWithMezon}
            w="full"
            h="50px"
            colorScheme="white"
            background={mezonBtnBackground}
            color={mezonBtnColor}
            _hover={{
              background: mezonBtnHoverBackground,
            }}
            transition="background 0.3s"
            flexDirection="row"
            gap={4}
          >
            <img src={SvgMezon} width={24} />
            Sign in with Mezon
          </Button>
        </VStack>
      </VStack>
    </Grid>
  );
};

export default Login;
