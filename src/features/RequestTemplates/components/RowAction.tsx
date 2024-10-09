/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Icon,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  useColorModeValue,
} from '@chakra-ui/react';
import { ColorThemeMode } from 'common/constants';
import { FaEye, FaRegMap } from 'react-icons/fa';
import { RiDeleteBin6Fill, RiSettings4Fill } from 'react-icons/ri';

interface RowActionProps {
  onDefineInput: () => void;
  onDelete: () => void;
  onViewWorkflow: () => void;
}

export const RowAction = ({
  onDelete,
  onDefineInput,
  onViewWorkflow,
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
          onClick={onDefineInput}
        >
          <Icon color="gray.500" as={FaEye} />
          Define Input
        </MenuItem>
        <MenuItem
          color={color}
          display="flex"
          gap="12px"
          onClick={onViewWorkflow}
        >
          <Icon color="gray.500" as={FaRegMap} />
          Edit Workflow
        </MenuItem>
        <MenuItem color={color} display="flex" gap="12px" onClick={onDelete}>
          <Icon color="gray.500" as={RiDeleteBin6Fill} />
          Delete
        </MenuItem>
      </MenuList>
    </Menu>
  );
};
