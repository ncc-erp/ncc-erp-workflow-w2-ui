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
import { useTranslation } from 'react-i18next';

interface IRowActionProps {
  onViewDetails: () => void;
}

export const RowAction = ({ onViewDetails }: IRowActionProps) => {
  const bg = useColorModeValue(ColorThemeMode.LIGHT, ColorThemeMode.DARK);
  const color = useColorModeValue(ColorThemeMode.DARK, ColorThemeMode.LIGHT);
  const { t } = useTranslation();
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
          {t('REPORT_PAGE.VIEW')}
        </MenuItem>
      </MenuList>
    </Menu>
  );
};
