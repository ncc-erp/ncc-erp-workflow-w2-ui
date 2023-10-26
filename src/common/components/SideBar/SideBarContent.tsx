import {
  HStack,
  Heading,
  Image,
  VStack,
  Text,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Icon,
  IconButton,
  Link,
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  useColorModeValue,
  Button,
  useColorMode,
} from '@chakra-ui/react';
import { NavLink } from 'common/components/SideBar/NavLink';
import {
  TbAppsFilled,
  TbArticleFilledFilled,
  TbLayoutBoard,
  TbBrandMastercard,
  TbSpeakerphone,
  TbUserCog,
  TbHomeEdit,
} from 'react-icons/tb';
import { BiLogOutCircle } from 'react-icons/bi';
import { VscKebabVertical } from 'react-icons/vsc';
import { useRecoilValue } from 'recoil';
import { userState } from 'stores/user';
import { useSetAppConfig } from 'stores/appConfig';
import { useNavigate } from 'react-router-dom';
import { useIsAdmin } from 'hooks/useIsAdmin';
import Logo from 'assets/images/ncc_logo.png';
import { ColorThemeMode, LinkDocRedirect } from 'common/constants';
import { removeItem } from 'utils';
import { LocalStorageKeys } from 'common/enums';
import {
  HiOutlineDocumentArrowUp,
  HiOutlineDocumentText,
  HiOutlineMoon,
} from 'react-icons/hi2';
import { FaSun } from 'react-icons/fa';
import { useMediaQuery } from 'hooks/useMediaQuery';

export const SideBarContent = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const bg = useColorModeValue(ColorThemeMode.LIGHT, ColorThemeMode.DARK);
  const color = useColorModeValue(ColorThemeMode.DARK, ColorThemeMode.LIGHT);
  const isLargeScreen = useMediaQuery('(min-width: 768px)');

  const isAdmin = useIsAdmin();
  const NavList = [
    {
      to: '/request-templates',
      text: 'Request templates',
      icon: TbAppsFilled,
    },
    {
      to: '/my-requests',
      text: isAdmin ? 'Requests' : 'My requests',
      icon: TbArticleFilledFilled,
    },
    {
      to: '/tasks',
      text: 'Tasks',
      icon: TbLayoutBoard,
    },
  ];

  const AdminNavList = [
    {
      to: '/administration',
      text: 'Administration',
      icon: TbUserCog,
      subMenu: [
        {
          to: '/administration/user-management',
          text: 'User management',
          icon: TbBrandMastercard,
        },
        // {
        //   to: '/settings',
        //   text: 'Settings',
        //   icon: TbSettingsBolt,
        // },
      ],
    },
    {
      to: '/report',
      text: 'Report',
      icon: TbSpeakerphone,
      subMenu: [
        {
          to: '/report-wfh',
          text: 'Report WFH',
          icon: TbHomeEdit,
        },
      ],
    },
  ];

  const user = useRecoilValue(userState);
  const navigate = useNavigate();
  const { onCloseSideBar } = useSetAppConfig();

  const onNavigate = (to: string, logout?: boolean) => () => {
    if (logout) {
      removeItem(LocalStorageKeys.accessToken);
    }
    navigate(to);
  };

  return (
    <VStack bg={bg} h="100vh" alignItems="stretch" spacing={0}>
      <HStack
        cursor="pointer"
        alignItems="center"
        py="20px"
        px="16px"
        spacing="12px"
        onClick={onNavigate('/')}
      >
        <Image h="40px" src={Logo} />
        <Heading fontSize="18px">NCC Workflow</Heading>
      </HStack>
      <VStack
        p="12px"
        align="flex-start"
        spacing="4px"
        overflowY="auto"
        flex={1}
        sx={{
          '&::-webkit-scrollbar': {
            width: '0',
          },
        }}
      >
        {NavList.map((nav) => (
          <NavLink key={nav.to} {...nav} onClick={onCloseSideBar} />
        ))}
        {isAdmin && (
          <>
            {AdminNavList?.map((adminNav) => {
              return (
                <Accordion
                  allowToggle
                  borderColor={'transparent'}
                  w={'100%'}
                  key={adminNav.to}
                >
                  <AccordionItem>
                    <AccordionButton
                      borderRadius={'0.375rem'}
                      p={0}
                      _hover={{
                        backgroundColor: 'gray.200',
                        color: 'gray.700',
                      }}
                      _activeLink={{
                        backgroundColor: 'gray.200',
                        color: 'gray.700',
                      }}
                    >
                      <Link
                        px="8px"
                        py="6px"
                        w="full"
                        fontWeight="600"
                        display="flex"
                        alignItems="center"
                        gap="12px"
                        fontSize="sm"
                        rounded="md"
                        textDecoration="none !important"
                      >
                        <Icon
                          textColor="gray.500"
                          fontSize="xl"
                          as={adminNav.icon}
                        />
                        {adminNav.text}
                      </Link>
                      <AccordionIcon />
                    </AccordionButton>
                    <AccordionPanel p={0} pl={7}>
                      {adminNav.subMenu.map((item) => {
                        return (
                          <Box mt={1} key={item.to}>
                            <NavLink {...item} onClick={onCloseSideBar} />
                          </Box>
                        );
                      })}
                    </AccordionPanel>
                  </AccordionItem>
                </Accordion>
              );
            })}
          </>
        )}
        <HStack borderTopColor="gray.200" hidden={isLargeScreen} w={'100%'}>
          <Button
            bg={bg}
            px={'8px'}
            py={'6px'}
            size={'20px'}
            leftIcon={
              colorMode === 'light' ? (
                <HiOutlineMoon
                  size={'20px'}
                  color="var(--chakra-colors-gray-500)"
                  stroke-width="2"
                />
              ) : (
                <FaSun
                  size={'20px'}
                  color="var(--chakra-colors-gray-500)"
                  stroke-width="2"
                />
              )
            }
            w={'100%'}
            justifyContent={'start'}
            iconSpacing={3}
            onClick={() => toggleColorMode()}
          >
            <Text fontSize={'14px'}>
              {' '}
              {colorMode === 'light' ? 'Dark' : 'Light'}{' '}
            </Text>
          </Button>
        </HStack>
        <HStack borderTopColor="gray.200" hidden={isLargeScreen} w={'100%'}>
          <Button
            bg={bg}
            px={'8px'}
            py={'6px'}
            size={'20px'}
            leftIcon={
              <HiOutlineDocumentArrowUp
                size={'20px'}
                color="var(--chakra-colors-gray-500)"
                stroke-width="2"
              />
            }
            w={'100%'}
            justifyContent={'start'}
            iconSpacing={3}
            onClick={() => {
              window.open(LinkDocRedirect.RELEASE_DOCS, '_blank');
            }}
          >
            <Text fontSize={'14px'}>Release note</Text>
          </Button>
        </HStack>
        <HStack borderTopColor="gray.200" hidden={isLargeScreen} w={'100%'}>
          <Button
            bg={bg}
            px={'8px'}
            py={'6px'}
            size={'20px'}
            leftIcon={
              <HiOutlineDocumentText
                size={'20px'}
                color="var(--chakra-colors-gray-500)"
                stroke-width="2"
              />
            }
            w={'100%'}
            justifyContent={'start'}
            iconSpacing={3}
            onClick={() => {
              window.open(LinkDocRedirect.USER_GUIDE_DOCS, '_blank');
            }}
          >
            <Text fontSize={'14px'}>User guide</Text>
          </Button>
        </HStack>
      </VStack>
      <HStack borderTopColor="gray.200" px="12px" py="16px" spacing="12px">
        <Text fontSize="sm" fontWeight={600} noOfLines={1}>
          {user.email}
        </Text>
        <Menu autoSelect={false} placement="top-end">
          <MenuButton
            ml="auto"
            as={IconButton}
            variant="ghost"
            size="sm"
            icon={<Icon as={VscKebabVertical} />}
          />
          <MenuList bg={bg} minW="140px">
            {/* <MenuItem
              color={color}
              display="flex"
              gap="12px"
              onClick={onNavigate('/my-profile')}
            >
              <Icon as={HiUser} fontSize="xl" color="gray.500" />
              <Text fontSize="sm">My profile</Text>
            </MenuItem> */}
            <MenuItem
              color={color}
              display="flex"
              gap="12px"
              onClick={onNavigate('/login', true)}
            >
              <Icon as={BiLogOutCircle} fontSize="xl" color="gray.500" />
              <Text fontSize="sm">Log out</Text>
            </MenuItem>
          </MenuList>
        </Menu>
      </HStack>
    </VStack>
  );
};
