// packages/ui/src/AppShell.tsx
import React from 'react';
import { makeStyles, tokens, Button as FluentButton } from '@fluentui/react-components';
import { WeatherSunny24Regular, WeatherMoon24Regular } from '@fluentui/react-icons';
import { useThemeStore } from '@arcfusion/store';
import './styles.css';

// สร้างสไตล์สำหรับ AppShell โดยเฉพาะ
const useAppShellStyles = makeStyles({
  root: {
    minHeight: '100vh',
    backgroundColor: tokens.colorNeutralBackground1,
    color: tokens.colorNeutralForeground1,
    transitionProperty: 'background-color, color',
    transitionDuration: tokens.durationNormal,
    transitionTimingFunction: tokens.curveEasyEase,
  },
  mainContent: {
    padding: tokens.spacingHorizontalXXL,
  },
  toggleContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginBottom: tokens.spacingVerticalL,
  },
});

// สร้าง Interface สำหรับ Props ของ AppShell
export interface AppShellProps {
  header: React.ReactNode;
  children: React.ReactNode;
}

export function AppShell({ header, children }: AppShellProps) {
  const styles = useAppShellStyles();
  const { theme, toggleTheme } = useThemeStore();

  return (
    <div className={styles.root}>
      {/* 1. แสดงผล header ที่รับมาจาก props */}
      {header}

      <main className={styles.mainContent}>
        <div className={styles.toggleContainer}>
          <FluentButton
            appearance="transparent"
            icon={theme === 'dark' ? <WeatherSunny24Regular /> : <WeatherMoon24Regular />}
            onClick={toggleTheme}
            aria-label="Toggle theme"
          />
        </div>
        {children}
      </main>
    </div>
  );
}
