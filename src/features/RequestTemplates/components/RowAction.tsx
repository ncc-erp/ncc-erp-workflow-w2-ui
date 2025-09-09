/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Icon,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from '@chakra-ui/react';
import { Permissions } from 'common/constants';
import { useUserPermissions } from 'hooks/useUserPermissions';
import { FaCheckCircle, FaRegEyeSlash, FaEye, FaRegMap } from 'react-icons/fa';
import { HiDotsVertical } from 'react-icons/hi';
import { RiDeleteBin6Fill } from 'react-icons/ri';
import { useTranslation } from 'react-i18next';

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
  const { renderIfAllowed } = useUserPermissions();
  const { t } = useTranslation();
  return (
    <Menu>
      <MenuButton
        as={IconButton}
        aria-label=""
        variant="ghost"
        size="md"
        color="paginationText"
        _hover={{
          bg: 'actionBtnBg',
        }}
        _active={{
          bg: 'actionBtnBg',
        }}
        icon={
          <Icon
            height={'24px'}
            width={'24px'}
            color="paginationText"
            fontSize="lg"
            as={HiDotsVertical}
          />
        }
      />
      <MenuList minW="100px">
        {renderIfAllowed(
          Permissions.DEFINE_INPUT,
          <MenuItem display="flex" gap="12px" onClick={onDefineInput}>
            <Icon as={FaEye} />
            {t('requestTemplates.buttons.defineInput')}
          </MenuItem>
        )}
        {renderIfAllowed(
          Permissions.EDIT_WORKFLOW_DEFINITION,
          <MenuItem display="flex" gap="12px" onClick={onViewWorkflow}>
            <Icon as={FaRegMap} />
            {t('requestTemplates.buttons.editWorkflow')}
          </MenuItem>
        )}
        {renderIfAllowed(
          Permissions.UPDATE_WORKFLOW_DEFINITION_STATUS,
          <MenuItem display="flex" gap="12px" onClick={onTogglePublish}>
            <Icon as={isPublished ? FaRegEyeSlash : FaCheckCircle} />
            {isPublished
              ? t('requestTemplates.buttons.unpublish')
              : t('requestTemplates.buttons.publish')}
          </MenuItem>
        )}
        {renderIfAllowed(
          Permissions.DELETE_WORKFLOW_DEFINITION,
          <MenuItem display="flex" gap="12px" onClick={onDelete}>
            <Icon as={RiDeleteBin6Fill} />
            {t('requestTemplates.buttons.delete')}
          </MenuItem>
        )}
      </MenuList>
    </Menu>
  );
};
