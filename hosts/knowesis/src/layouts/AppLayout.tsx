// hosts/knowesis/src/layouts/AppLayout.tsx
import React from 'react';
import { useLocation, useNavigate, Outlet } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import {
  useGlobalStyles,
  AppShell,
  Sidebar,
  Topbar,
  ASSETS,
  type SidebarNavGroup,
} from '@arcfusion/ui';

// Import Icons
import {
  Apps28Color,
  ChatMultiple24Color,
  DataPie32Color,
  Home32Color,
  Library28Color,
} from '@fluentui/react-icons';
import { useTopbarStore } from '../stores/topbarStore';

// ข้อมูลสำหรับ Sidebar
const menuGroups: SidebarNavGroup[] = [
  {
    title: 'MAIN',
    items: [
      { value: '/', label: 'Home', icon: <Home32Color /> },
      { value: '/ask_ai', label: 'Ask AI', icon: <ChatMultiple24Color /> },
      { value: '/stories', label: 'Stories', icon: <Library28Color /> },
    ],
  },
  {
    title: 'DASHBOARD',
    items: [{ value: '/overview', label: 'Overview', icon: <DataPie32Color /> }],
  },
];

export function AppLayout() {
  useGlobalStyles();
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth0();
  const { actions } = useTopbarStore();

  // หา Page Title จาก menuGroups
  const currentPage = menuGroups.flatMap((g) => g.items).find((i) => i.value === location.pathname);
  const pageTitle = currentPage ? currentPage.label : 'Page Not Found';

  // Logic สำหรับ Sidebar
  const selectedValue =
    menuGroups
      .flatMap((g) => g.items)
      .find((i) => location.pathname.startsWith(i.value) && i.value !== '/')?.value ||
    (location.pathname === '/' ? '/' : location.pathname);

  const handleTabSelect = (value: string) => {
    navigate(value);
  };

  const handleLogout = () => {
    logout({ logoutParams: { returnTo: window.location.origin } });
  };

  return (
    <AppShell
      sidebar={
        <Sidebar
          logo={ASSETS.MOCK_LOGO_MINIMAL}
          appIcon={<Apps28Color />}
          menuGroups={menuGroups}
          selectedValue={selectedValue}
          onTabSelect={handleTabSelect}
        />
      }
      topbar={
        <Topbar
          pageTitle={pageTitle}
          user={user}
          onLogout={handleLogout}
          methodsLeft={actions.left}
          methodsRight={actions.right}
        />
      }
    >
      <Outlet />
    </AppShell>
  );
}
