// hosts/knowesis/src/bootstrap.tsx

import { createRoot } from 'react-dom/client';
import React, { Suspense } from 'react';
// --- Import hooks เพิ่ม: useLocation, useNavigate, และ NavLink ---
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  NavLink,
  useLocation,
  useNavigate,
} from 'react-router-dom';
import { Auth0Provider, withAuthenticationRequired } from '@auth0/auth0-react';

// --- Import makeStyles และ tokens เพิ่ม ---
import { FluentProvider, makeStyles, tokens } from '@fluentui/react-components';

// --- Import Icons ที่จะใช้ใน Sidebar ---
import { Home24Regular, DocumentBulletList24Regular, Apps24Regular } from '@fluentui/react-icons';

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

// Import Pages และ MFE Components
import { ServicesPage } from './pages/ServicesPage';
const AskAi = React.lazy(() => import('ask_ai/AskAi'));
const Home = React.lazy(() => import('home/Home'));

// --- 1. สร้างข้อมูลสำหรับ Sidebar ---
const menuGroups: SidebarNavGroup[] = [
  {
    title: 'MAIN',
    items: [
      { value: '/', label: 'Home', icon: <Home24Regular /> },
      { value: '/ask_ai', label: 'Ask AI', icon: <DocumentBulletList24Regular /> },
      { value: '/stories', label: 'Stories', icon: <DocumentBulletList24Regular /> },
    ],
  },
  {
    title: 'DASHBOARD',
    items: [{ value: '/overview', label: 'Overview', icon: <DocumentBulletList24Regular /> }],
  },
];

// โลโก้และไอคอนตัวอย่าง
const AppIcon = () => <Apps24Regular style={{ color: '#555' }} />;

// --- 2. สร้างสไตล์สำหรับ NavLink ของเรา ---
const useNavStyles = makeStyles({
  link: {
    color: tokens.colorNeutralForeground1,
    textDecorationLine: 'none',
    padding: `${tokens.spacingVerticalS} ${tokens.spacingHorizontalM}`,
    borderRadius: tokens.borderRadiusMedium,
    ':hover': {
      backgroundColor: tokens.colorNeutralBackground1Hover,
    },
    display: 'flex', // แก้ไขเป็น flex เพื่อให้ icon กับ text อยู่ในแนวเดียวกัน
    alignItems: 'center',
    gap: tokens.spacingHorizontalS,
  },
  activeLink: {
    backgroundColor: tokens.colorNeutralBackground1Selected,
    fontWeight: tokens.fontWeightSemibold,
  },
});

// Component Layout หลัก ทำหน้าที่ประกอบร่าง UI
const AppLayout = () => {
  useGlobalStyles();
  const location = useLocation(); // Hook สำหรับดู path ปัจจุบัน
  const navigate = useNavigate(); // Hook สำหรับสั่งเปลี่ยนหน้า

  // หา path ที่ตรงกับ value ของ Tab, ถ้าไม่เจอให้ใช้ path ปัจจุบัน
  const selectedValue =
    menuGroups.flatMap((g) => g.items).find((i) => i.value === location.pathname)?.value ||
    location.pathname;

  const handleTabSelect = (value: string) => {
    navigate(value); // สั่งให้ Router เปลี่ยนหน้า
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
        <Topbar>
          <Suspense fallback={<div>Loading AskAi...</div>}>
            <AskAi />
          </Suspense>
        </Topbar>
      }
    >
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
        <ThemeToggle />
      </div>
      <Suspense fallback={<div>Loading Page...</div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<ServicesPage />} />
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
