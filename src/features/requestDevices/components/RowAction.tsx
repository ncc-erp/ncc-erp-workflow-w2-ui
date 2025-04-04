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
import { MdCancel } from 'react-icons/md';
import { FaEye, FaRegMap } from 'react-icons/fa';
import { ColorThemeMode, Permissions } from 'common/constants';
import { useUserPermissions } from 'hooks/useUserPermissions';

interface RowActionProps {
  onViewDetails: () => void;
  onCancel: () => void;
  onViewWorkflow?: () => void;
  actions?: {
    cancel?: boolean;
  };
}

export const RowAction = ({
  onCancel,
  onViewDetails,
  onViewWorkflow,
  actions = {
    cancel: false,
  },
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
      />
      <MenuList minW="100px" bg={bg}>
        <MenuItem
          color={color}
          display="flex"
          gap="12px"
          onClick={onViewDetails}
        >
          <Icon as={FaEye} />
          View
        </MenuItem>
        {onViewWorkflow && (
          <MenuItem
            color={color}
            display="flex"
            gap="12px"
            onClick={onViewWorkflow}
          >
            <Icon as={FaRegMap} />
            Workflow
          </MenuItem>
        )}
        {actions.cancel &&
          renderIfAllowed(
            Permissions.CANCEL_WORKFLOW_INSTANCE,
            <MenuItem
              color={color}
              display="flex"
              gap="12px"
              onClick={onCancel}
            >
              <Icon as={MdCancel} />
              Cancel
            </MenuItem>
          )}
      </MenuList>
    </Menu>
  );
};
