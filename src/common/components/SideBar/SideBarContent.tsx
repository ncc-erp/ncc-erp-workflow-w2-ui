import {
  Avatar,
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
} from '@chakra-ui/react';
import { NavLink } from 'common/components/SideBar/NavLink';
import {
  TbAppsFilled,
  TbArticleFilledFilled,
  TbSettingsBolt,
  TbUserCircle,
  TbBrandMastercard,
  TbChevronUp,
  TbChevronDown,
  TbLayoutBoard,
} from 'react-icons/tb';
import { BiLogOutCircle } from 'react-icons/bi';
import { HiUser } from 'react-icons/hi2';
import { VscKebabVertical } from 'react-icons/vsc';
import { useRecoilValue } from 'recoil';
import { userState } from 'stores/user';
import { useSetAppConfig } from 'stores/appConfig';
import { useNavigate } from 'react-router-dom';
import { useIsAdmin } from 'hooks/useIsAdmin';
import { useState } from 'react';

export const SideBarContent = () => {
  const isAdmin = useIsAdmin();
  const [isSubMenuOpen, setSubMenuOpen] = useState(false);
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
      icon: isSubMenuOpen ? TbChevronUp : TbChevronDown,
      subMenu: [
        {
          to: '/tenant-management',
          text: 'Tenant management',
          icon: TbUserCircle,
        },
        {
          to: '/identity-management',
          text: 'Identity management',
          icon: TbBrandMastercard,
        },
        {
          to: '/settings',
          text: 'Settings',
          icon: TbSettingsBolt,
        },
      ],
    },
  ];

  const user = useRecoilValue(userState);
  const navigate = useNavigate();
  const { onCloseSideBar } = useSetAppConfig();
  const userName = [user.name, user.surname].join(' ');

  const onNavigate = (to: string, logout?: boolean) => () => {
    logout;
    navigate(to);
  };

  return (
    <VStack bgColor="gray.50" h="100vh" alignItems="stretch" spacing={0}>
      <HStack alignItems="center" py="20px" px="16px" spacing="12px">
        <Image h="24px" src="/logo.png" />
        <Heading fontSize="sm">NCC Workflow</Heading>
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
            <NavLink
              key={AdminNavList[0].to}
              {...AdminNavList[0]}
              onClick={() => setSubMenuOpen(!isSubMenuOpen)}
            />
            {isSubMenuOpen &&
              AdminNavList[0].subMenu.map((subNavItem) => (
                <HStack px="10px">
                  <NavLink
                    key={subNavItem.to}
                    {...subNavItem}
                    onClick={onCloseSideBar}
                  />
                </HStack>
              ))}
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
        <Avatar size="sm" name={userName} />
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
