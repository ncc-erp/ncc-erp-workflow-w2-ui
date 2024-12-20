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
import { ColorThemeMode, Permissions } from 'common/constants';
import { useUserPermissions } from 'hooks/useUserPermissions';
import { FaCheckCircle, FaRegEyeSlash, FaEye, FaRegMap } from 'react-icons/fa';
import { HiDotsVertical } from 'react-icons/hi';
import { RiDeleteBin6Fill } from 'react-icons/ri';
import theme from 'themes/theme';

interface RowActionProps {
  onDefineInput: () => void;
  onDelete: () => void;
  onViewWorkflow: () => void;
  isPublished: boolean;
  onTogglePublish: () => void;
}

export const RowAction = ({
  onDelete,
  onDefineInput,
  onViewWorkflow,
  isPublished,
  onTogglePublish,
}: RowActionProps) => {
  const bg = useColorModeValue(ColorThemeMode.LIGHT, ColorThemeMode.DARK);
  const { renderIfAllowed } = useUserPermissions();
  const bgMenuItem = useColorModeValue(
    theme.colors.actionMenuDarkBg,
    theme.colors.actionMenuLightBg
  );
  const hoverBgMenuItem = useColorModeValue(
    theme.colors.actionMenuBgDarkHover,
    theme.colors.actionMenuBgLightHover
  );
  const textColerMenuItem = useColorModeValue(
    theme.colors.actionMenuDarkText,
    theme.colors.actionMenuLightText
  );

  return (
    <Menu>
      <MenuButton
        as={IconButton}
        aria-label=""
        variant="ghost"
        size="md"
        icon={
          <Icon
            height={'24px'}
            width={'24px'}
            color="gray.500"
            fontSize="lg"
            as={HiDotsVertical}
          />
        }
      />
      <MenuList minW="100px" bg={bg}>
        {renderIfAllowed(
          Permissions.DEFINE_INPUT,
          <MenuItem
            display="flex"
            gap="12px"
            background={bgMenuItem}
            color={textColerMenuItem}
            _hover={{
              bg: hoverBgMenuItem,
              color: textColerMenuItem,
            }}
            onClick={onDefineInput}
          >
            <Icon color="gray.500" as={FaEye} />
            Define Input
          </MenuItem>
        )}
        {renderIfAllowed(
          Permissions.EDIT_WORKFLOW_DEFINITION,
          <MenuItem
            display="flex"
            gap="12px"
            onClick={onViewWorkflow}
            background={bgMenuItem}
            color={textColerMenuItem}
            _hover={{
              bg: hoverBgMenuItem,
              color: textColerMenuItem,
            }}
          >
            <Icon color="gray.500" as={FaRegMap} />
            Edit Workflow
          </MenuItem>
        )}
        {renderIfAllowed(
          Permissions.UPDATE_WORKFLOW_DEFINITION_STATUS,
          <MenuItem
            display="flex"
            gap="12px"
            onClick={onTogglePublish}
            background={bgMenuItem}
            color={textColerMenuItem}
            _hover={{
              bg: hoverBgMenuItem,
              color: textColerMenuItem,
            }}
          >
            <Icon
              color="gray.500"
              as={isPublished ? FaRegEyeSlash : FaCheckCircle}
            />
            {isPublished ? 'Unpublish' : 'Publish'}
          </MenuItem>
        )}
        {renderIfAllowed(
          Permissions.DELETE_WORKFLOW_DEFINITION,
          <MenuItem
            display="flex"
            gap="12px"
            onClick={onDelete}
            background={bgMenuItem}
            color={textColerMenuItem}
            _hover={{
              bg: hoverBgMenuItem,
              color: textColerMenuItem,
            }}
          >
            <Icon color="gray.500" as={RiDeleteBin6Fill} />
            Delete
          </MenuItem>
        )}
      </MenuList>
    </Menu>
  );
};
