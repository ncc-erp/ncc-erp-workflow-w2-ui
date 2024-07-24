import {
  Box,
  Button,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
} from '@chakra-ui/react';
import { useState } from 'react';
import SettingIcon from 'utils/icons/Setting';
import styles from './style.module.scss';
import MapIcon from 'utils/icons/Map';
import UserGuideIcon from 'utils/icons/UserGuide';
import HelpCircleIcon from 'utils/icons/HelpCircle';
import SunIcon from 'utils/icons/Sun';
import MoonIcon from 'utils/icons/Moon';
import LogoutIcon from 'utils/icons/Logout';
import ChevronRightIcon from 'utils/icons/ChevronRight';

export function Submenu() {
  const [submenuOpen, setSubmenuOpen] = useState<boolean>(false);

  const closeSubmenu = () => {
    if (submenuOpen) {
      setSubmenuOpen(false);
    }
  };

  const toggleSubmenu = () => {
    setSubmenuOpen(!submenuOpen);
  };

  return (
    <Menu>
      <MenuButton as={Button} size="md" variant={'solid'} colorScheme="red">
        Open Menu
      </MenuButton>
      <MenuList>
        <MenuItem className={styles.MenuItem}>
          <SettingIcon />
          <Box className={styles.ItemText}>Edit template</Box>
        </MenuItem>
        <MenuItem className={styles.MenuItem}>
          <MapIcon />
          <Box className={styles.ItemText}>Edit workflow</Box>
        </MenuItem>
        <MenuItem className={styles.MenuItem}>
          <HelpCircleIcon />
          <Box className={styles.ItemText}>User guide</Box>
        </MenuItem>
        <MenuItem className={styles.MenuItem}>
          <UserGuideIcon />
          <Box className={styles.ItemText}>Release note</Box>
        </MenuItem>
        <Menu
          isOpen={submenuOpen}
          placement="left-start"
          onClose={closeSubmenu}
        >
          <MenuButton
            style={{ display: 'flex' }}
            as={MenuItem}
            onClick={toggleSubmenu}
          >
            <Box className={styles.SubMenu}>
              <Box className={styles.MenuItem}>
                <SunIcon />
                <Box className={styles.ItemText}>Them: Light</Box>
              </Box>
              <ChevronRightIcon />
            </Box>
          </MenuButton>
          <MenuList>
            <MenuItem className={styles.MenuItem}>
              <SunIcon />
              <Box className={styles.ItemText}>Light Mode</Box>
            </MenuItem>
            <MenuItem className={styles.MenuItem}>
              <MoonIcon />
              <Box className={styles.ItemText}>Dark Mode</Box>
            </MenuItem>
          </MenuList>
        </Menu>
        <MenuDivider color={'#EAECF0'} />
        <MenuItem className={styles.MenuItem}>
          <LogoutIcon />
          <Box className={styles.ItemText}>Logout</Box>
        </MenuItem>
      </MenuList>
    </Menu>
  );
}
