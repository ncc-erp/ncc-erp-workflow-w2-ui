import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  HStack,
  Heading,
  Icon,
  Image,
  Link,
  Text,
  VStack,
  useColorMode,
} from '@chakra-ui/react';
import Logo from 'assets/images/ncc_logo.png';
import { NavLink } from 'common/components/SideBar/NavLink';
import { LinkDocRedirect, Permissions } from 'common/constants';
import { LocalStorageKeys } from 'common/enums';
import { useUserPermissions } from 'hooks/useUserPermissions';
import { FaMoon, FaQuestionCircle, FaSun } from 'react-icons/fa';
import { HiDocumentArrowUp } from 'react-icons/hi2';
import { MdLogout } from 'react-icons/md';
import {
  TbAppsFilled,
  TbArticleFilledFilled,
  TbBrandMastercard,
  TbHomeEdit,
  TbLayoutBoard,
  TbReportSearch,
  TbSettingsBolt,
  TbShieldLock,
  TbUserCog,
  TbUserShield,
} from 'react-icons/tb';
import { useNavigate } from 'react-router-dom';
import { useSetAppConfig } from 'stores/appConfig';
import { removeItem } from 'utils';
import { CurrentUser } from '../CurrentUser';

interface SideBarContentProps {
  isLargeScreen: boolean;
}

export const SideBarContent = ({ isLargeScreen }: SideBarContentProps) => {
  const { colorMode, toggleColorMode } = useColorMode();
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
    {
      to: '/report',
      text: 'Report',
      icon: TbReportSearch,
      subMenu: [
        {
          to: '/report/report-wfh',
          text: 'Report WFH',
          icon: TbHomeEdit,
          permission: Permissions.WFH_REPORTS,
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
    <VStack
      bg={'#45263A'}
      h="100vh"
      alignItems="stretch"
      display={'flex'}
      flexDirection={'column'}
      justifyContent={'space-between'}
      spacing={0}
    >
      <Box>
        <Box width={'100%'} padding={'8px 16px 20px 16px'}>
          {isLargeScreen ? (
            <HStack
              cursor="pointer"
              alignItems="center"
              py="20px"
              px="16px"
              spacing="12px"
              onClick={onNavigate('/')}
            >
              <Image h="40px" src={Logo} />
              <Heading color={'#ffffff'} fontSize="18px">
                NCC Workflow
              </Heading>
            </HStack>
          ) : (
            <CurrentUser isMobile={true} />
          )}
        </Box>

        <VStack
          p="12px"
          align="flex-start"
          spacing="4px"
          overflowY="auto"
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
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        color: '#F0F1F5',
                      }}
                      _activeLink={{
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        color: '#F0F1F5',
                      }}
                      color={'#BEC0C9'}
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
                        <Icon fontSize="xl" as={adminNav.icon} />
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
        </VStack>
      </Box>

      <VStack
        width={'100%'}
        px="12px"
        py="16px"
        spacing="12px"
        display={'flex'}
        flexDirection={'column'}
        gap={'12px'}
      >
        <Box
          width={'100%'}
          display={'flex'}
          flexDirection={'column'}
          gap={'4px'}
        >
          <Button
            mr={2}
            onClick={onNavigate('/release-content')}
            title="Release note"
            color={'#F0F1F5'}
            bg="transparent"
            _hover={{
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
            }}
            justifyContent={'flex-start'}
            gap={'8px'}
            alignItems={'center'}
            fontSize={'14px'}
            fontWeight={500}
            padding={'4px 8px'}
          >
            <HiDocumentArrowUp size="17px" />
            <Text>Release note</Text>
          </Button>

          <Button
            mr={2}
            onClick={() => {
              window.open(LinkDocRedirect.USER_GUIDE_DOCS, '_blank');
            }}
            color={'#F0F1F5'}
            title="User guide"
            _hover={{
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
            }}
            gap={'8px'}
            bg="transparent"
            justifyContent={'flex-start'}
            alignItems={'center'}
            fontWeight={500}
            padding={'4px 8px'}
            fontSize={'14px'}
          >
            <FaQuestionCircle size="17px" />
            <Text>User guide</Text>
          </Button>
        </Box>
        <Box
          display={'flex'}
          justifyContent={'space-between'}
          width={'100%'}
          flexDirection={'row'}
        >
          <Box>
            <Button
              borderRadius={20}
              onClick={onNavigate('/login', true)}
              bg="transparent"
              color={'#E53E3E'}
              gap={'4px'}
              padding={'4px 8px'}
              alignItems={'center'}
              _hover={{
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
              }}
            >
              <MdLogout size={16} />
              <Text fontWeight={500} fontSize={14}>
                Log out
              </Text>
            </Button>
          </Box>
          <Button size="md" borderRadius={20} onClick={() => toggleColorMode()}>
            {colorMode === 'light' ? (
              <>
                <FaMoon />
                <Text ml={2}>Dark</Text>
              </>
            ) : (
              <>
                <FaSun />
                <Text ml={2}>Light</Text>
              </>
            )}
          </Button>
        </Box>
      </VStack>
    </VStack>
  );
};
