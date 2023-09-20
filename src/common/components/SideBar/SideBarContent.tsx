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
} from '@chakra-ui/react';
import { NavLink } from 'common/components/SideBar/NavLink';
import {
  TbAppsFilled,
  TbArticleFilledFilled,
  TbSettingsBolt,
  TbLayoutBoard,
  TbBrandMastercard,
  TbSpeakerphone,
  TbUserCog,
  TbHomeEdit,
} from 'react-icons/tb';
import { BiLogOutCircle } from 'react-icons/bi';
import { HiUser } from 'react-icons/hi2';
import { VscKebabVertical } from 'react-icons/vsc';
import { useRecoilValue } from 'recoil';
import { userState } from 'stores/user';
import { useSetAppConfig } from 'stores/appConfig';
import { useNavigate } from 'react-router-dom';
import { useIsAdmin } from 'hooks/useIsAdmin';
import Logo from 'assets/images/ncc_logo.svg';

export const SideBarContent = () => {
  const isAdmin = useIsAdmin();
  const NavList = [
    {
      to: '/request-templates',
      text: 'Request templates',
      icon: TbAppsFilled,
    },
    {
      to: '/my-requests',
      text: 'My requests',
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
        {
          to: '/settings',
          text: 'Settings',
          icon: TbSettingsBolt,
        },
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
    logout;
    navigate(to);
  };

  return (
    <VStack bgColor="gray.50" h="100vh" alignItems="stretch" spacing={0}>
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
                      }}
                      _activeLink={{
                        backgroundColor: 'gray.200',
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
      </VStack>
      <HStack
        borderTopWidth="1px"
        borderTopColor="gray.200"
        px="12px"
        py="16px"
        spacing="12px"
      >
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
          <MenuList minW="140px">
            <MenuItem
              display="flex"
              gap="12px"
              onClick={onNavigate('/my-profile')}
            >
              <Icon as={HiUser} fontSize="xl" color="gray.500" />
              <Text fontSize="sm">My profile</Text>
            </MenuItem>
            <MenuItem
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
