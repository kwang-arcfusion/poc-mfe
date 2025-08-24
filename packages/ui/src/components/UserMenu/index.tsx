import React, { useState } from 'react';
import {
  Avatar,
  Button,
  Dialog,
  DialogActions,
  DialogBody,
  DialogSurface,
  DialogTitle,
  DialogTrigger,
  Menu,
  MenuItem,
  MenuItemRadio,
  MenuList,
  MenuPopover,
  MenuTrigger,
  MenuCheckedValueChangeData,
  makeStyles,
  tokens,
} from '@fluentui/react-components';
import { useThemeStore } from '@arcfusion/store';
import { SignOut24Regular, Color24Regular } from '@fluentui/react-icons';

// Props Interface สำหรับ UserMenu
export interface UserMenuProps {
  user?: {
    name?: string | null;
    email?: string | null;
  };
  onLogout: () => void;
}

// ฟังก์ชันช่วยหาชื่อย่อ
const getInitials = (name?: string | null) => {
  if (!name) return '??';
  const parts = name.split(' ');
  if (parts.length > 1) {
    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
};

// Styles ทั้งหมดที่ใช้ใน Component นี้
const useStyles = makeStyles({
  fitContentSurface: {
    width: 'fit-content',
    minWidth: '200px',
  },
  flexBody: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM,
  },
  growList: {
    flexGrow: 1,
    width: '100%',
  },
  pointerCursor: {
    cursor: 'pointer',
  },
});

export function UserMenu({ user, onLogout }: UserMenuProps) {
  const styles = useStyles();

  // State สำหรับควบคุม Dialog ทั้งสอง
  const [isThemeDialogOpen, setIsThemeDialogOpen] = useState(false);
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);

  const { theme, toggleTheme } = useThemeStore();

  const handleCheckedChange = (_e: React.SyntheticEvent, data: MenuCheckedValueChangeData) => {
    if (data.name !== 'theme') return;
    const newTheme = (data.checkedItems[0] ?? 'light') as 'light' | 'dark';
    if (newTheme !== theme) {
      toggleTheme();
    }
  };

  return (
    <>
      {/* 1. Menu หลักที่ถูก Trigger ด้วย Avatar */}
      <Menu>
        <MenuTrigger disableButtonEnhancement>
          <Avatar
            className={styles.pointerCursor}
            color="brand"
            name={user?.name || undefined}
            aria-label="User menu"
          >
            {getInitials(user?.name)}
          </Avatar>
        </MenuTrigger>

        <MenuPopover>
          <MenuList>
            {user?.email && <MenuItem disabled>{user.email}</MenuItem>}
            <MenuItem icon={<Color24Regular />} onClick={() => setIsThemeDialogOpen(true)}>
              Change Theme
            </MenuItem>
            <MenuItem icon={<SignOut24Regular />} onClick={() => setIsLogoutDialogOpen(true)}>
              Log out
            </MenuItem>
          </MenuList>
        </MenuPopover>
      </Menu>

      {/* 2. Dialog สำหรับเปลี่ยน Theme */}
      <Dialog
        open={isThemeDialogOpen}
        onOpenChange={(_event, data) => setIsThemeDialogOpen(data.open)}
      >
        <DialogSurface className={styles.fitContentSurface}>
          <DialogBody className={styles.flexBody}>
            <DialogTitle>Select a Theme</DialogTitle>
            <MenuList
              className={styles.growList}
              checkedValues={{ theme: [theme] }}
              onCheckedValueChange={handleCheckedChange}
            >
              <MenuItemRadio name="theme" value="light">
                Light
              </MenuItemRadio>
              <MenuItemRadio name="theme" value="dark">
                Dark
              </MenuItemRadio>
            </MenuList>
          </DialogBody>
        </DialogSurface>
      </Dialog>

      {/* 3. Dialog สำหรับยืนยันการ Logout */}
      <Dialog
        open={isLogoutDialogOpen}
        onOpenChange={(_event, data) => setIsLogoutDialogOpen(data.open)}
      >
        <DialogSurface>
          <DialogBody>
            <DialogTitle>Confirm Log Out</DialogTitle>
            Are you sure you want to log out?
            <DialogActions>
              <DialogTrigger disableButtonEnhancement>
                <Button appearance="secondary">Cancel</Button>
              </DialogTrigger>
              <Button appearance="primary" onClick={onLogout}>
                Confirm
              </Button>
            </DialogActions>
          </DialogBody>
        </DialogSurface>
      </Dialog>
    </>
  );
}
