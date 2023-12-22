import {
  Menu,
  MenuButton,
  IconButton,
  MenuList,
  MenuItem,
  Icon,
  useColorModeValue,
} from '@chakra-ui/react';
import { RiSettings4Fill } from 'react-icons/ri';
import { FaEye } from 'react-icons/fa';
import { ColorThemeMode } from 'common/constants';

interface IRowActionProps {
  onViewDetails: () => void;
}

export const RowAction = ({ onViewDetails }: IRowActionProps) => {
  const bg = useColorModeValue(ColorThemeMode.LIGHT, ColorThemeMode.DARK);
  const color = useColorModeValue(ColorThemeMode.DARK, ColorThemeMode.LIGHT);

  return (
    <Menu>
      <MenuButton
        as={IconButton}
        aria-label=""
        variant="ghost"
        size="sm"
        icon={<Icon color="gray.500" fontSize="lg" as={RiSettings4Fill} />}
      />
      <MenuList minW="100px" bg={bg}>
        <MenuItem
          color={color}
          display="flex"
          gap="12px"
          onClick={onViewDetails}
        >
          <Icon color="gray.500" as={FaEye} />
          View
        </MenuItem>
      </MenuList>
    </Menu>
  );
};
