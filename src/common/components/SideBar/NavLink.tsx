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
      color="stone.500"
      onClick={onClick}
      border="1px transparent solid"
      _hover={{
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        color: 'stone.100',
        borderColor: 'stoneAlpha.200/20',
      }}
      _activeLink={{
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        color: 'stone.100',
        borderColor: 'stoneAlpha.200/20',
      }}
    >
      <Icon as={icon} fontSize="xl" />
      {text}
    </Link>
  );
};
