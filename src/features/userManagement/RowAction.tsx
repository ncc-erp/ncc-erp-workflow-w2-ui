import {
  Menu,
  MenuButton,
  IconButton,
  MenuList,
  MenuItem,
  Icon,
} from '@chakra-ui/react';
import { RiSettings4Fill, RiDeleteBin6Fill } from 'react-icons/ri';
import { MdCancel } from 'react-icons/md';

interface RowActionProps {
  onEdit: () => void;
  onPermissions: () => void;
  onDelete: () => void;
}

export const RowAction = ({ onEdit, onPermissions, onDelete }: RowActionProps) => {
  return (
    <Menu>
      <MenuButton
        as={IconButton}
        aria-label=""
        variant="ghost"
        size="sm"
        icon={<Icon color="gray.500" fontSize="lg" as={RiSettings4Fill} />}
      >Actions</MenuButton>
      <MenuList minW="100px">
        <MenuItem display="flex" gap="12px" onClick={onEdit}>
          <Icon color="gray.500" as={RiDeleteBin6Fill} />
          Edit
        </MenuItem>
        <MenuItem display="flex" gap="12px" onClick={onPermissions}>
          <Icon color="gray.500" as={MdCancel} />
          Permissions
        </MenuItem>
        <MenuItem display="flex" gap="12px" onClick={onDelete}>
          <Icon color="gray.500" as={RiDeleteBin6Fill} />
          Delete
        </MenuItem>
      </MenuList>
    </Menu>
  );
};
