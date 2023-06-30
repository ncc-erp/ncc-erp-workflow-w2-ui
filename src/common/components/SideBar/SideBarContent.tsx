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
import { TbAppsFilled, TbArticleFilledFilled } from 'react-icons/tb';
import { BiLogOutCircle } from 'react-icons/bi';
import { HiUser } from 'react-icons/hi2';
import { VscKebabVertical } from 'react-icons/vsc';
import { useRecoilValue } from 'recoil';
import { userState } from 'stores/user';
import { useSetAppConfig } from 'stores/appConfig';

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
];

export const SideBarContent = () => {
  const user = useRecoilValue(userState);
  const { onCloseSideBar } = useSetAppConfig();
  const userName = [user.name, user.surname].join(' ');

  return (
    <VStack bgColor='gray.50' h='100vh' alignItems='stretch' spacing={0}>
      <HStack alignItems='center' py='20px' px='16px' spacing='12px'>
        <Image h='24px' src='/logo.png' />
        <Heading fontSize='sm'>NCC Workflow</Heading>
      </HStack>
      <VStack
        p='12px'
        align='flex-start'
        spacing='4px'
        overflowY='auto'
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
      </VStack>
      <HStack
        borderTopWidth='1px'
        borderTopColor='gray.200'
        px='12px'
        py='16px'
        spacing='12px'
      >
        <Avatar size='sm' name={userName} />
        <Text fontSize='sm' fontWeight={600} noOfLines={1}>
          {user.email}
        </Text>
        <Menu autoSelect={false} placement='top-end'>
          <MenuButton ml='auto' as={IconButton} variant='ghost' size='sm'>
            <Icon as={VscKebabVertical} />
          </MenuButton>
          <MenuList minW='200px'>
            <MenuItem>
              <NavLink text='My profile' to='/my-profile' icon={HiUser} />
            </MenuItem>
            <MenuItem>
              <NavLink text='Log out' to='/login' icon={BiLogOutCircle} />
            </MenuItem>
          </MenuList>
        </Menu>
      </HStack>
    </VStack>
  );
};
