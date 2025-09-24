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
  // Home32Color, // 🗑️ ลบออก
  Library28Color,
} from '@fluentui/react-icons';
import { useTopbarStore } from '../stores/topbarStore';

// Data for Sidebar
const menuGroups: SidebarNavGroup[] = [
  {
    title: 'MAIN',
    items: [
      // { value: '/', label: 'Home', icon: <Home32Color /> }, // 🗑️ ลบออก
      { value: '/overview', label: 'Overview', icon: <DataPie32Color /> },
      { value: '/ask_ai', label: 'Ask AI', icon: <ChatMultiple24Color /> },
      { value: '/stories', label: 'Stories', icon: <Library28Color /> },
    ],
  },
  // TODO: next features
  // {
  //   title: 'DASHBOARD',
  //   items: [{ value: '/overview', label: 'Overview', icon: <DataPie32Color /> }],
  // },
];

export function AppLayout() {
  useGlobalStyles();
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth0();
  const { actions } = useTopbarStore();

  const allMenuItems = menuGroups.flatMap((g) => g.items);

  const matchingPage = allMenuItems
    .filter((item) => location.pathname.startsWith(item.value))
    .sort((a, b) => b.value.length - a.value.length)[0];

  const pageTitle = matchingPage ? matchingPage.label : 'Page Not Found';

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
