import {
  Menu,
  MenuButton,
  IconButton,
  MenuList,
  MenuItem,
  Icon,
  useColorModeValue,
} from '@chakra-ui/react';
import { RiSettings4Fill, RiDeleteBin6Fill } from 'react-icons/ri';
import { MdCancel } from 'react-icons/md';
import { ColorThemeMode } from 'common/constants';

interface RowActionProps {
  onCancel: () => void;
  onDelete: () => void;
}

export const RowAction = ({ onCancel, onDelete }: RowActionProps) => {
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
        <MenuItem color={color} display="flex" gap="12px" onClick={onDelete}>
          <Icon color="gray.500" as={RiDeleteBin6Fill} />
          Delete
        </MenuItem>
        <MenuItem color={color} display="flex" gap="12px" onClick={onCancel}>
          <Icon color="gray.500" as={MdCancel} />
          Cancel
        </MenuItem>
      </MenuList>
    </Menu>
  );
};
