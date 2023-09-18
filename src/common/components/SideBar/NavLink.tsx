import { As, Icon, Link } from '@chakra-ui/react';
import { NavLink as NavLinkComponent } from 'react-router-dom';

interface NavLinkProps {
  to: string;
  text: string;
  icon: As;
  onClick?: () => void;
}

export const NavLink = ({ to, text, icon, onClick }: NavLinkProps) => {
  return (
    <Link
      as={NavLinkComponent}
      to={to}
      px="8px"
      py="6px"
      w="full"
      fontWeight="600"
      display="flex"
      alignItems="center"
      gap="12px"
      fontSize="sm"
      rounded="md"
      textDecoration="none"
      onClick={onClick}
      _hover={{
        backgroundColor: 'gray.200',
        color: 'gray.700',
      }}
      _activeLink={{
        backgroundColor: 'gray.200',
        color: 'gray.700',
      }}
    >
      <Icon textColor="gray.500" as={icon} fontSize="xl" />
      {text}
    </Link>
  );
};
