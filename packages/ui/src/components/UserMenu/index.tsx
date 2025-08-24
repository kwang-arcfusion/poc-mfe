// packages/ui/src/UserMenu.tsx
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
  RadioGroup,
  Radio,
  MenuCheckedValueChangeData,
} from '@fluentui/react-components';
import { useThemeStore } from '@arcfusion/store';
import { SignOut24Regular, Color24Regular } from '@fluentui/react-icons';

// สร้าง Props Interface สำหรับ UserMenu
export interface UserMenuProps {
  // รับ object user ทั้งหมดมาเลยจะยืดหยุ่นกว่า
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

export function UserMenu({ user, onLogout }: UserMenuProps) {
  // State สำหรับควบคุมการเปิด/ปิด Dialog
  const [isThemeDialogOpen, setIsThemeDialogOpen] = useState(false);
  const { theme, toggleTheme } = useThemeStore();

  const handleCheckedChange = (_e: React.SyntheticEvent, data: MenuCheckedValueChangeData) => {
    if (data.name !== 'theme') return;
    // MenuItemRadio เป็น single-select => index 0
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
          <Avatar color="brand" name={user?.name || undefined} aria-label="User menu">
            {getInitials(user?.name)}
          </Avatar>
        </MenuTrigger>

        <MenuPopover>
          <MenuList>
            {user?.email && <MenuItem disabled>{user.email}</MenuItem>}
            <MenuItem
              icon={<Color24Regular />}
              onClick={() => setIsThemeDialogOpen(true)} // <-- คลิกแล้วให้เปิด Dialog
            >
              Change Theme
            </MenuItem>
            <MenuItem icon={<SignOut24Regular />} onClick={onLogout}>
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
        <DialogSurface>
          <DialogBody>
            <DialogTitle>Select a Theme</DialogTitle>
            <MenuList
              // คุม state ที่นี่ (record<string, string[]>)
              checkedValues={{ theme: [theme] }}
              onCheckedValueChange={handleCheckedChange}
            >
              <MenuItemRadio name="theme" value="light">
                Light
              </MenuItemRadio>
              <MenuItemRadio name="theme" value="dark">
                Dark
              </MenuItemRadio>

              {/* รายการเมนูอื่น ๆ */}
            </MenuList>
            <DialogActions>
              <DialogTrigger disableButtonEnhancement>
                <Button appearance="secondary">Close</Button>
              </DialogTrigger>
            </DialogActions>
          </DialogBody>
        </DialogSurface>
      </Dialog>
    </>
  );
}
