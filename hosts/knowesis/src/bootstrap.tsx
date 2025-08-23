// hosts/knowesis/src/bootstrap.tsx

import { createRoot } from 'react-dom/client';
import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Auth0Provider, withAuthenticationRequired } from '@auth0/auth0-react';

// Import จาก Fluent UI
import { FluentProvider } from '@fluentui/react-components';

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

// Component Layout หลัก ทำหน้าที่ประกอบร่าง UI
const AppLayout = () => {
  return (
    <AppShell
      sidebar={
        <Sidebar>
          <p>Navigation</p>
          <a href="/" style={{ textDecoration: 'none' }}>
            Home
          </a>
          <a href="/services" style={{ textDecoration: 'none' }}>
            Services
          </a>
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
  // --- ย้าย useGlobalStyles มาไว้ที่นี่ ---
  // นี่คือตำแหน่งที่ดีที่สุด เพราะเป็น Component ชั้นนอกสุดที่จัดการเรื่องสไตล์ทั้งหมด
  useGlobalStyles();

  const { theme } = useThemeStore();
  const fluentTheme = theme === 'dark' ? arcusionDarkTheme : arcusionLightTheme;

  // useEffect ที่จัดการ dark class ถูกย้ายเข้าไปใน AppShell แล้ว
  // ทำให้ ThemedApp เหลือหน้าที่แค่ส่ง Theme และเรียก Global Styles
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
