import React from 'react';
import {
  Box,
  Flex,
  Image,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Icon,
} from '@chakra-ui/react';
import Logo from 'assets/images/ncc_logo.png';
import { UserButton } from './AccountButton';
import { TbBrandMastercard } from 'react-icons/tb';
import RequestIcon from 'utils/icons/Request';
import TaskIcon from 'utils/icons/Task';
import AdminIcon from 'utils/icons/Admin';

const NavBar = () => {
  const NavList = [
    {
      to: '/my-requests',
      text: 'Requests',
      icon: RequestIcon,
    },
    {
      to: '/tasks',
      text: 'Tasks',
      icon: TaskIcon,
    },
  ];

  const AdminNavList = [
    {
      to: '/administration',
      text: 'Administration',
      icon: AdminIcon,
      subMenu: [
        {
          to: '/administration/user-management',
          text: 'User management',
          icon: TbBrandMastercard,
        },
      ],
    },
  ];

  return (
    <NavBarContainer>
      <Box display={'flex'} gap={'8px'} alignItems={'center'}>
        <Image src={Logo} h="24px" />
        <Box lineHeight={'24px'} fontWeight={'600'} fontSize="16px">
          NCC Workflow
        </Box>
      </Box>
      <Box
        // display={{ base: isOpen ? "block" : "none", md: "block" }}
        flexBasis={{ base: '100%', md: 'auto' }}
      >
        <Breadcrumb separator=" ">
          {NavList.map((item, index) => (
            <BreadcrumbItem {...item} key={index}>
              <BreadcrumbLink
                href={item.to}
                _hover={{
                  backgroundColor: '#54374B',
                  borderColor: '#EAECF0 15%',
                }}
                _activeLink={{
                  backgroundColor: '#54374B',
                  borderColor: '#EAECF0 15%',
                }}
                padding={'8px 10px 8px 10px'}
                borderRadius={'8px'}
                border={'1px solid'}
                borderColor={'transparent'}
                display={'flex'}
                alignItems={'center'}
                textDecoration={'none'}
                gap={'4px'}
              >
                <Icon textColor="#ffffff" fontSize="xl" as={item.icon} />
                {item.text}
              </BreadcrumbLink>
            </BreadcrumbItem>
          ))}
          {AdminNavList?.map((adminNav, index) => {
            return (
              <BreadcrumbItem {...adminNav} key={index}>
                <BreadcrumbLink
                  href={adminNav.to}
                  _hover={{
                    backgroundColor: '#54374B',
                    borderColor: '#EAECF0 15%',
                  }}
                  _activeLink={{
                    backgroundColor: '#54374B',
                    borderColor: '#EAECF0 15%',
                  }}
                  padding={'8px 10px 8px 10px'}
                  borderRadius={'8px'}
                  border={'1px solid'}
                  borderColor={'transparent'}
                  display={'flex'}
                  alignItems={'center'}
                  textDecoration={'none'}
                  gap={'4px'}
                >
                  <Icon textColor="#ffffff" fontSize="xl" as={adminNav.icon} />
                  {adminNav.text}
                </BreadcrumbLink>
              </BreadcrumbItem>
            );
          })}
        </Breadcrumb>
      </Box>
      <UserButton name="User" email="a.nguyenvan@gmail.com" />
    </NavBarContainer>
  );
};

interface NavBarContainerProps {
  children: React.ReactNode;
}

const NavBarContainer = ({ children, ...props }: NavBarContainerProps) => {
  return (
    <Flex
      as="nav"
      align="center"
      justify="space-between"
      minWidth={'1280px'}
      alignItems={'center'}
      padding={'15px 20px'}
      bg={'#45263A'}
      color={['white', 'white', 'primary.700', 'primary.700']}
      {...props}
    >
      {children}
    </Flex>
  );
};

export default NavBar;
