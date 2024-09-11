import {
  Menu,
  MenuButton,
  IconButton,
  MenuList,
  MenuItem,
  Icon,
  useColorModeValue,
} from '@chakra-ui/react';
import { ColorThemeMode } from 'common/constants';
import { RiSettings4Fill, RiEdit2Fill, RiDeleteBin6Fill } from 'react-icons/ri';

interface RowActionProps {
  onEdit?: () => void;
  onDelete: () => void;
  disableDeleteButton?: boolean;
}

export const RowAction = ({
  onEdit,
  onDelete,
  disableDeleteButton,
}: RowActionProps) => {
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
      >
        Actions
      </MenuButton>
      <MenuList minW="100px" bg={bg}>
        {onEdit && (
          <MenuItem color={color} display="flex" gap="12px" onClick={onEdit}>
            <Icon color="gray.500" as={RiEdit2Fill} />
            Edit
          </MenuItem>
        )}

        <MenuItem
          color={color}
          display="flex"
          gap="12px"
          onClick={onDelete}
          isDisabled={disableDeleteButton}
        >
          <Icon color="gray.500" as={RiDeleteBin6Fill} />
          Delete
        </MenuItem>
      </MenuList>
    </Menu>
  );
};
