import {
  Menu,
  MenuButton,
  IconButton,
  MenuList,
  MenuItem,
  Icon,
  useColorModeValue,
} from '@chakra-ui/react';
import { ColorThemeMode, Permissions } from 'common/constants';
import { useUserPermissions } from 'hooks/useUserPermissions';
import { RiSettings4Fill, RiEdit2Fill, RiDeleteBin6Fill } from 'react-icons/ri';

interface RowActionProps {
  onEdit?: () => void;
  onDelete?: () => void;
  disableDeleteButton?: boolean;
}

export const RowAction = ({
  onEdit,
  onDelete,
  disableDeleteButton,
}: RowActionProps) => {
  const bg = useColorModeValue(ColorThemeMode.LIGHT, ColorThemeMode.DARK);
  const color = useColorModeValue(ColorThemeMode.DARK, ColorThemeMode.LIGHT);
  const { renderIfAllowed } = useUserPermissions();

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
        {onEdit &&
          renderIfAllowed(
            Permissions.UPDATE_SETTINGS,
            <MenuItem color={color} display="flex" gap="12px" onClick={onEdit}>
              <Icon color="gray.500" as={RiEdit2Fill} />
              Edit
            </MenuItem>
          )}
        {renderIfAllowed(
          Permissions.DELETE_SETTINGS,
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
        )}
      </MenuList>
    </Menu>
  );
};
