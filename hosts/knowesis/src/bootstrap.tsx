// hosts/knowesis/src/bootstrap.tsx

import { createRoot } from 'react-dom/client';
import React, { Suspense, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Auth0Provider, withAuthenticationRequired } from '@auth0/auth0-react';
import { FluentProvider, webLightTheme, webDarkTheme } from '@fluentui/react-components';
import { useThemeStore } from '@arcfusion/store';

// Import AppShell และ Layout components ใหม่
import { AppShell, Sidebar, Topbar, ThemeToggle } from '@arcfusion/ui';

// Import Pages และ MFE Components
import { ServicesPage } from './pages/ServicesPage';
const AskAi = React.lazy(() => import('ask_ai/AskAi'));
const Home = React.lazy(() => import('home/Home'));

// AppLayout ตอนนี้จะทำหน้าที่แค่ "ประกอบร่าง" Layout ทั้งหมด
const AppLayout = () => {
  return (
    <AppShell
      sidebar={
        <Sidebar>
          {/* คุณสามารถเพิ่ม NavLink สำหรับ Router ได้ที่นี่ในอนาคต */}
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
      {/* เนื้อหาหลักของหน้าจะถูกส่งเป็น children */}
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

// Component "ยาม" เฝ้าแอป
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
  const { theme } = useThemeStore();
  const fluentTheme = theme === 'dark' ? webDarkTheme : webLightTheme;

  // useEffect ที่จัดการ dark class ยังคงจำเป็นสำหรับ Tailwind (ถ้ามี)
  // หรือสไตล์ custom อื่นๆ ที่ไม่ได้มาจาก Fluent
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

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
