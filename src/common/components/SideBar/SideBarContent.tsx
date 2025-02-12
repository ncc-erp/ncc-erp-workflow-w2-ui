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
  useColorMode,
} from '@chakra-ui/react';
import { NavLink } from 'common/components/SideBar/NavLink';
import {
  TbAppsFilled,
  TbArticleFilledFilled,
  TbLayoutBoard,
  TbBrandMastercard,
  TbUserCog,
  TbSettingsBolt,
  TbUserShield,
  TbHomeEdit,
  TbReportSearch,
  TbShieldLock,
} from 'react-icons/tb';
import { BiLogOutCircle } from 'react-icons/bi';
import { VscKebabVertical } from 'react-icons/vsc';
import { useSetAppConfig } from 'stores/appConfig';
import { useNavigate } from 'react-router-dom';
import { useUserPermissions } from 'hooks/useUserPermissions';
import Logo from 'assets/images/ncc_logo.png';
import { ColorThemeMode, LinkDocRedirect } from 'common/constants';
import { removeItem } from 'utils';
import { LocalStorageKeys } from 'common/enums';
import { Permissions } from 'common/constants';
import {
  HiOutlineDocumentArrowUp,
  HiOutlineDocumentText,
  HiOutlineMoon,
} from 'react-icons/hi2';
import { FaSun } from 'react-icons/fa';

interface SideBarContentProps {
  isLargeScreen: boolean;
}

export const SideBarContent = ({ isLargeScreen }: SideBarContentProps) => {
  const { colorMode, toggleColorMode } = useColorMode();
  const bg = useColorModeValue(ColorThemeMode.LIGHT, ColorThemeMode.DARK);
  const color = useColorModeValue(ColorThemeMode.DARK, ColorThemeMode.LIGHT);

  const { renderIfAllowed, hasPermission } = useUserPermissions();

  const NavList = [
    {
      to: '/request-templates',
      text: 'Request templates',
      icon: TbAppsFilled,
      permission: Permissions.WORKFLOW_DEFINITIONS,
    },
    {
      to: '/my-requests',
      text: hasPermission(Permissions.VIEW_ALL_WORKFLOW_INSTANCES)
        ? 'Requests'
        : 'My requests',
      icon: TbArticleFilledFilled,
      permission: Permissions.WORKFLOW_INSTANCES,
    },
    {
      to: '/tasks',
      text: hasPermission(Permissions.VIEW_ALL_TASKS) ? 'Tasks' : 'My tasks',
      icon: TbLayoutBoard,
      permission: Permissions.TASKS,
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
          permission: Permissions.USERS,
        },
        {
          to: '/administration/settings',
          text: 'Settings',
          icon: TbSettingsBolt,
          permission: Permissions.SETTINGS,
        },
        {
          to: '/administration/roles',
          text: 'Roles',
          icon: TbUserShield,
          permission: Permissions.ROLES,
        },
        {
          to: '/administration/permissions',
          text: 'Manage permissions',
          icon: TbShieldLock,
          permission: Permissions.PERMISSIONS,
        },
      ],
    },
  ];
  const ReportNavList = [
    {
      to: '/report',
      text: 'Report',
      icon: TbReportSearch,
      subMenu: [
        {
          to: '/report/report-wfh',
          text: 'Report WFH',
          icon: TbHomeEdit,
          permission: Permissions.VIEW_WFH_REPORTS,
        },
      ],
    },
  ];

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
        {NavList.map((nav) =>
          renderIfAllowed(
            nav.permission,
            <NavLink key={nav.to} {...nav} onClick={onCloseSideBar} />
          )
        )}
        <>
          {AdminNavList.map((adminNav) => {
            const hasAdminPermission = [
              Permissions.USERS,
              Permissions.SETTINGS,
              Permissions.ROLES,
              Permissions.PERMISSIONS,
            ].some(hasPermission);
            return hasAdminPermission ? (
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
                      return renderIfAllowed(
                        item.permission,
                        <Box mt={1} key={item.to}>
                          <NavLink {...item} onClick={onCloseSideBar} />
                        </Box>
                      );
                    })}
                  </AccordionPanel>
                </AccordionItem>
              </Accordion>
            ) : null;
          })}
        </>
        <>
          {ReportNavList.map((reportNav) => {
            const hasReportPermission = [Permissions.WFH_REPORTS].some(
              hasPermission
            );
            return hasReportPermission ? (
              <Accordion
                allowToggle
                borderColor="transparent"
                w="100%"
                key={reportNav.to}
              >
                <AccordionItem>
                  <AccordionButton
                    borderRadius="0.375rem"
                    p={0}
                    _hover={{
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
                        as={reportNav.icon}
                      />
                      {reportNav.text}
                    </Link>
                    <AccordionIcon />
                  </AccordionButton>
                  <AccordionPanel p={0} pl={7}>
                    {reportNav.subMenu.map((item) =>
                      renderIfAllowed(
                        item.permission,
                        <Box mt={1} key={item.to}>
                          <NavLink {...item} onClick={onCloseSideBar} />
                        </Box>
                      )
                    )}
                  </AccordionPanel>
                </AccordionItem>
              </Accordion>
            ) : null;
          })}
        </>
      </VStack>
      <HStack borderTopColor="gray.200" px="12px" py="16px" spacing="12px">
        {/* <Text fontSize="sm" fontWeight={600} noOfLines={1} isTruncated>
          {user.email}
        </Text> */}
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
              onClick={() => toggleColorMode()}
              hidden={isLargeScreen}
            >
              {colorMode === 'light' ? (
                <Icon as={HiOutlineMoon} fontSize="xl" color="gray.500" />
              ) : (
                <Icon as={FaSun} fontSize="xl" color="gray.500" />
              )}
              <Text fontSize="sm">
                {' '}
                {colorMode === 'light' ? 'Dark' : 'Light'}{' '}
              </Text>
            </MenuItem>
            <MenuItem
              color={color}
              display="flex"
              gap="12px"
              onClick={() => {
                window.open(LinkDocRedirect.RELEASE_DOCS, '_blank');
              }}
              hidden={isLargeScreen}
            >
              <Icon
                as={HiOutlineDocumentArrowUp}
                fontSize="xl"
                color="gray.500"
              />
              <Text fontSize="sm">Release note</Text>
            </MenuItem>
            <MenuItem
              color={color}
              display="flex"
              gap="12px"
              onClick={() => {
                window.open(LinkDocRedirect.USER_GUIDE_DOCS, '_blank');
              }}
              hidden={isLargeScreen}
            >
              <Icon as={HiOutlineDocumentText} fontSize="xl" color="gray.500" />
              <Text fontSize="sm">User guide</Text>
            </MenuItem>
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
