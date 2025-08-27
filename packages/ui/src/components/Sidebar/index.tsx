// packages/ui/src/Sidebar.tsx
import React from 'react';
import { makeStyles, tokens, TabList, Tab } from '@fluentui/react-components';
import type { TabListProps } from '@fluentui/react-components';

const useStyles = makeStyles({
  root: {
    minWidth: '160px',
    backgroundColor: tokens.colorNeutralBackground3,
    display: 'flex',
    flexDirection: 'column',
    padding: `${tokens.spacingVerticalL} ${tokens.spacingHorizontalS}`,
    gap: tokens.spacingVerticalXXL,
    paddingLeft: '24px',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: tokens.spacingHorizontalM,
    paddingLeft: tokens.spacingHorizontalM,
    paddingRight: tokens.spacingHorizontalM,
  },
  menuGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalL,
  },
  groupTitle: {
    fontSize: tokens.fontSizeBase300,
    fontWeight: tokens.fontWeightRegular,
    paddingLeft: tokens.spacingHorizontalM,
    paddingRight: tokens.spacingHorizontalM,
    color: tokens.colorNeutralForeground4,
  },
  tabList: {
    width: '100%',
    // --- Styles for Active Tab (same as before) ---
    '& [aria-selected="true"] .fui-Tab__content': {
      color: tokens.colorBrandForeground1,
    },
    '& [aria-selected="true"]::before': {
      backgroundColor: tokens.colorBrandStroke1,
    },

    // --- V V V Add styles for Hover V V V ---
    // Select a tab that is not active (:not) and is being hovered
    '& [role="tab"]:hover .fui-Tab__content': {
      color: tokens.colorCompoundBrandForeground1Hover, // <-- Use color for Hover state
    },
  },
});

// --- Data Structures (from step 1) ---
export interface SidebarNavItem {
  value: string;
  label: string;
  icon: React.ReactElement;
}

export interface SidebarNavGroup {
  title: string;
  items: SidebarNavItem[];
}

export interface SidebarProps {
  logo: string;
  appIcon: React.ReactNode;
  menuGroups: SidebarNavGroup[];
  selectedValue: string;
  onTabSelect: (value: string) => void;
}
// ------------------------------------

export function Sidebar({ logo, appIcon, menuGroups, selectedValue, onTabSelect }: SidebarProps) {
  const styles = useStyles();

  const handleTabSelect: TabListProps['onTabSelect'] = (_event, data) => {
    onTabSelect(data.value as string);
  };

  return (
    <nav className={styles.root}>
      <div className={styles.header}>
        <img src={logo} alt="" width={48} height={48} />
        {appIcon}
      </div>

      {menuGroups.map((group) => (
        <div key={group.title} className={styles.menuGroup}>
          <div className={styles.groupTitle}>{group.title}</div>
          <TabList
            vertical
            className={styles.tabList}
            selectedValue={selectedValue}
            onTabSelect={handleTabSelect}
          >
            {group.items.map((item) => (
              <Tab key={item.value} value={item.value} icon={item.icon}>
                {item.label}
              </Tab>
            ))}
          </TabList>
        </div>
      ))}
    </nav>
  );
}
