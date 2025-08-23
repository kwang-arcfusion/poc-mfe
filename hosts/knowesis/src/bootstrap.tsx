// hosts/knowesis/src/bootstrap.tsx

import { createRoot } from 'react-dom/client';
import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Auth0Provider, withAuthenticationRequired } from '@auth0/auth0-react';
import { FluentProvider, webLightTheme, webDarkTheme } from '@fluentui/react-components';
import { useThemeStore } from '@arcfusion/store';

// Import AppShell จาก UI Library ของเรา
import { AppShell } from '@arcfusion/ui';

// Import Pages และ MFE Components
import { ServicesPage } from './pages/ServicesPage';
const AskAi = React.lazy(() => import('ask_ai/AskAi'));
const Home = React.lazy(() => import('home/Home'));

// --- START: ส่วนที่ปรับแก้ ---

// AppLayout ตอนนี้จะทำหน้าที่แค่ "ประกอบร่าง" โดยใช้ AppShell
const AppLayout = () => {
  return (
    <AppShell
      // ส่ง AskAi remote เข้าไปเป็น prop `header`
      header={
        <Suspense fallback={<div style={{ padding: '24px' }}>Loading AskAi...</div>}>
          <AskAi />
        </Suspense>
      }
    >
      {/* ส่ง Routes เข้าไปเป็น prop `children` (เนื้อหาหลัก) */}
      <Suspense fallback={<div style={{ padding: '24px' }}>Loading Page...</div>}>
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

// Component ศูนย์กลางควบคุม Theme (ไม่เปลี่ยนแปลง)
function ThemedApp() {
  const { theme } = useThemeStore();
  const fluentTheme = theme === 'dark' ? webDarkTheme : webLightTheme;

  // `useEffect` ที่เคยอยู่ที่นี่ถูกย้ายเข้าไปใน AppShell แล้ว
  // ทำให้ ThemedApp เหลือหน้าที่แค่ส่ง Theme ให้ FluentProvider
  return (
    <FluentProvider theme={fluentTheme}>
      <ProtectedAppLayout />
    </FluentProvider>
  );
}

// --- END: ส่วนที่ปรับแก้ ---

// ---- ส่วนการ Render หลักของแอปพลิเคชัน ----
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
