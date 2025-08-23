// hosts/knowesis/src/bootstrap.tsx

import { createRoot } from 'react-dom/client';
import React, { Suspense } from 'react';
// --- Import NavLink เพิ่มเข้ามา ---
import { BrowserRouter, Routes, Route, Navigate, NavLink } from 'react-router-dom';
import { Auth0Provider, withAuthenticationRequired } from '@auth0/auth0-react';

// --- Import makeStyles และ tokens เพิ่มเข้ามา ---
import { FluentProvider, makeStyles, tokens } from '@fluentui/react-components';

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
} from '@arcfusion/ui';

// Import Pages และ MFE Components
import { ServicesPage } from './pages/ServicesPage';
const AskAi = React.lazy(() => import('ask_ai/AskAi'));
const Home = React.lazy(() => import('home/Home'));

// --- สร้างสไตล์สำหรับ NavLink ของเรา ---
const useNavStyles = makeStyles({
  link: {
    color: tokens.colorNeutralForeground1,
    textDecorationLine: 'none',
    padding: `${tokens.spacingVerticalS} ${tokens.spacingHorizontalM}`,
    borderRadius: tokens.borderRadiusMedium,
    ':hover': {
      backgroundColor: tokens.colorNeutralBackground1Hover,
    },
    display: 'block',
  },
  activeLink: {
    backgroundColor: tokens.colorNeutralBackground1Selected,
    fontWeight: tokens.fontWeightSemibold,
  },
});

// Component Layout หลัก ทำหน้าที่ประกอบร่าง UI
const AppLayout = () => {
  const navStyles = useNavStyles();

  return (
    <AppShell
      sidebar={
        <Sidebar>
          {/* --- เปลี่ยนจาก <a> tag มาเป็น <NavLink> --- */}
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? `${navStyles.link} ${navStyles.activeLink}` : navStyles.link
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/services"
            className={({ isActive }) =>
              isActive ? `${navStyles.link} ${navStyles.activeLink}` : navStyles.link
            }
          >
            Services
          </NavLink>
        </Sidebar>
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
