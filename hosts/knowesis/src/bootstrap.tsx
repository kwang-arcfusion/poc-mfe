// hosts/knowesis/src/bootstrap.tsx

import { createRoot } from 'react-dom/client';
import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Auth0Provider, withAuthenticationRequired, useAuth0 } from '@auth0/auth0-react';

// Import จาก Fluent UI
import {
  FluentProvider,
  Button as FluentButton,
  RadioGroup,
  Radio,
  tokens,
  Spinner,
} from '@fluentui/react-components';

// Import Icons ที่จะใช้ใน Sidebar
import {
  Apps24Regular,
  Apps28Color,
  ArrowTrendingLines24Color,
  Book24Regular,
  ChatMultiple24Color,
  DataPie32Color,
  Home28Color,
  Home32Color,
  Library28Color,
} from '@fluentui/react-icons';

// Import ทุกอย่างที่เราต้องการจาก local packages
import { useThemeStore } from '@arcfusion/store';
import {
  AppShell,
  Sidebar,
  Topbar,
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

// --- สร้างข้อมูลสำหรับ Sidebar ---
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

// ไอคอนตัวอย่าง

// Component Layout หลัก ทำหน้าที่ประกอบร่าง UI
const AppLayout = () => {
  useGlobalStyles();
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth0(); // <-- ดึง logout function มาด้วย

  // 1. หา Page Title จาก menuGroups
  const currentPage = menuGroups.flatMap((g) => g.items).find((i) => i.value === location.pathname);
  const pageTitle = currentPage ? currentPage.label : 'Page Not Found';

  // 2. (ตัวอย่าง) สร้าง Methods ที่จะแสดงในแต่ละหน้า
  let actionsLeft: React.ReactNode = null;
  let actionsRight: React.ReactNode = null;

  if (location.pathname === '/') {
    actionsLeft = (
      <RadioGroup layout="horizontal">
        <Radio value="A" label="Method A" />
        <Radio value="B" label="Method B" />
      </RadioGroup>
    );
  } else if (location.pathname === '/ask_ai') {
    actionsRight = <FluentButton appearance="primary">Special Action</FluentButton>;
  }

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
          user={user} // <-- ส่ง user object ทั้งหมด
          onLogout={handleLogout} // <-- ส่ง logout function
          methodsLeft={actionsLeft}
          methodsRight={actionsRight}
        />
      }
    >
      {/* ThemeToggle ถูกย้ายเข้าไปอยู่ใน UserMenu ภายใน Topbar แล้ว จึงไม่จำเป็นต้องมีตรงนี้ */}
      <Suspense fallback={<div style={{ padding: '24px' }}>Loading Page...</div>}>
        <Routes>
          <Route path="/" element={<Home navigate={navigate} />} />
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
        flexDirection: 'column', // จัดเรียงในแนวตั้ง
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        gap: '60px',
      }}
    >
      <img src={ASSETS.ARCFUSION_LOGO_MINIMSL} alt="arcfusion logo" />
      <Spinner size="huge" />
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
