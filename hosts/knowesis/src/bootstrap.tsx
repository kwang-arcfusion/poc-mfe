// hosts/knowesis/src/bootstrap.tsx

import { createRoot } from 'react-dom/client';
import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Auth0Provider, withAuthenticationRequired, useAuth0 } from '@auth0/auth0-react';
import { FluentProvider, tokens } from '@fluentui/react-components';

// Import Icons ที่จะใช้ใน Sidebar
import {
  Home24Regular,
  DocumentBulletList24Regular,
  Apps24Regular,
  Bot24Regular,
  Book24Regular,
  ChartMultiple24Regular,
} from '@fluentui/react-icons';

// Import ทุกอย่างที่เราต้องการจาก local packages
import { useThemeStore } from '@arcfusion/store';
import {
  AppShell,
  Sidebar,
  Topbar,
  ThemeToggle,
  useGlobalStyles,
  arcusionLightTheme,
  arcusionDarkTheme,
  type SidebarNavGroup,
  ASSETS,
} from '@arcfusion/ui';

// Import Pages ใหม่ทั้งหมด
import { AskAiPage } from './pages/AskAiPage';
import { StoriesPage } from './pages/StoriesPage';
import { OverviewPage } from './pages/OverviewPage';
const Home = React.lazy(() => import('home/Home'));

// --- สร้างข้อมูลสำหรับ Sidebar (อัปเดตไอคอนและ value ให้ครบ) ---
const menuGroups: SidebarNavGroup[] = [
  {
    title: 'MAIN',
    items: [
      { value: '/', label: 'Home', icon: <Home24Regular /> },
      { value: '/ask_ai', label: 'Ask AI', icon: <Bot24Regular /> },
      { value: '/stories', label: 'Stories', icon: <Book24Regular /> },
      { value: '/services', label: 'Services', icon: <DocumentBulletList24Regular /> },
    ],
  },
  {
    title: 'DASHBOARD',
    items: [{ value: '/overview', label: 'Overview', icon: <ChartMultiple24Regular /> }],
  },
];

// โลโก้และไอคอนตัวอย่าง
const AppIcon = () => <Apps24Regular style={{ color: '#555' }} />;

// Component Layout หลัก ทำหน้าที่ประกอบร่าง UI
const AppLayout = () => {
  useGlobalStyles();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth0();

  // ปรับปรุง logic การหา path ที่ active ให้รองรับ nested routes ในอนาคต
  const selectedValue =
    menuGroups
      .flatMap((g) => g.items)
      .find((i) => location.pathname.startsWith(i.value) && i.value !== '/')?.value ||
    (location.pathname === '/' ? '/' : location.pathname);

  const handleTabSelect = (value: string) => {
    navigate(value);
  };

  return (
    <AppShell
      sidebar={
        <Sidebar
          logo={ASSETS.MOCK_LOGO_MINIMAL}
          appIcon={<AppIcon />}
          menuGroups={menuGroups}
          selectedValue={selectedValue}
          onTabSelect={handleTabSelect}
        />
      }
      topbar={
        // สร้าง Topbar แบบง่ายๆ ขึ้นมาใหม่
        <Topbar>
          <div style={{ flexGrow: 1 }}>{/* พื้นที่สำหรับ Search bar ในอนาคต */}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: tokens.spacingHorizontalM }}>
            <ThemeToggle />
            <span style={{ color: tokens.colorNeutralForeground1 }}>Welcome, {user?.name}</span>
          </div>
        </Topbar>
      }
    >
      {/* --- อัปเดต Routes ทั้งหมดที่นี่ --- */}
      <Suspense fallback={<div style={{ padding: '24px' }}>Loading Page...</div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/ask_ai" element={<AskAiPage />} />
          <Route path="/stories" element={<StoriesPage />} />
          <Route path="/overview" element={<OverviewPage />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Suspense>
    </AppShell>
  );
};

// Component "ยาม" เฝ้าแอป (ไม่เปลี่ยนแปลง)
const ProtectedAppLayout = withAuthenticationRequired(AppLayout, {
  onRedirecting: () => (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
      }}
    >
      Arcfusion Loading...
    </div>
  ),
});

// Component ศูนย์กลางควบคุม Theme
function ThemedApp() {
  useGlobalStyles();

  const { theme } = useThemeStore();
  const fluentTheme = theme === 'dark' ? arcusionDarkTheme : arcusionLightTheme;

  return (
    <FluentProvider theme={fluentTheme}>
      <ProtectedAppLayout />
    </FluentProvider>
  );
}

// ---- Main Application Setup ----
const domain = process.env.AUTH0_DOMAIN;
const clientId = process.env.AUTH0_CLIENT_ID;

if (!domain || !clientId) {
  throw new Error('Auth0 domain and client ID must be set in .env file');
}

createRoot(document.getElementById('root')!).render(
  <Auth0Provider
    domain={domain}
    clientId={clientId}
    authorizationParams={{
      redirect_uri: window.location.origin,
    }}
  >
    <BrowserRouter>
      <ThemedApp />
    </BrowserRouter>
  </Auth0Provider>
);
