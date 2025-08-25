// packages/ui/src/AppShell.tsx
import React from 'react';
import {
  makeStyles,
  tokens,
  mergeClasses, // <-- 1. Import mergeClasses
} from '@fluentui/react-components';

// (ส่วนของ Sidebar, Topbar, ThemeToggle ที่ import เข้ามาจะถูกลบออกไป เพราะ AppShell ไม่ควรรู้จักมัน)

// สไตล์ default ของ AppShell
const useAppShellStyles = makeStyles({
  root: {
    display: 'flex',
    height: '100vh',
    backgroundColor: tokens.colorNeutralBackground2,
    color: tokens.colorNeutralForeground1,
  },
  contentContainer: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    overflow: 'hidden',
    boxShadow: tokens.shadow16,
  },
  mainContent: {
    overflowY: 'auto',
    flexGrow: 1,
  },
});

// 2. กำหนด Type สำหรับ classNames prop
export type AppShellClassNames = {
  root?: string;
  contentContainer?: string;
  mainContent?: string;
};

export interface AppShellProps {
  sidebar: React.ReactNode;
  topbar: React.ReactNode;
  children: React.ReactNode;
  classNames?: AppShellClassNames; // <-- เพิ่ม prop ใหม่
}

export function AppShell({ sidebar, topbar, children, classNames }: AppShellProps) {
  const styles = useAppShellStyles();

  return (
    // 3. ใช้ mergeClasses เพื่อรวม default class กับ class ที่ส่งเข้ามา
    <div className={mergeClasses(styles.root, classNames?.root)}>
      {sidebar}
      <div className={mergeClasses(styles.contentContainer, classNames?.contentContainer)}>
        {topbar}
        <main className={mergeClasses(styles.mainContent, classNames?.mainContent)}>
          {children}
        </main>
      </div>
    </div>
  );
}
