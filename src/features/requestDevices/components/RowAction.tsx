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
import { ColorThemeMode } from 'common/constants';

interface RowActionProps {
  onViewDetails: () => void;
  onCancel: () => void;
  onViewWorkflow: () => void;
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
        <MenuItem
          color={color}
          display="flex"
          gap="12px"
          onClick={onViewWorkflow}
        >
          <Icon color="gray.500" as={FaRegMap} />
          Workflow
        </MenuItem>
        {actions.cancel && (
          <MenuItem color={color} display="flex" gap="12px" onClick={onCancel}>
            <Icon color="gray.500" as={MdCancel} />
            Cancel
          </MenuItem>
        )}
      </MenuList>
    </Menu>
  );
};
