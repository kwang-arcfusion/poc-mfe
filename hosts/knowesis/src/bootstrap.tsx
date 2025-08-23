// hosts/knowesis/src/bootstrap.tsx

import { createRoot } from 'react-dom/client';
import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Auth0Provider, withAuthenticationRequired } from '@auth0/auth0-react';

// Import จาก Fluent UI
import {
  FluentProvider,
  webLightTheme,
  webDarkTheme,
  Button as FluentButton,
  makeStyles,
  tokens, // <-- Import Design Tokens สำหรับการทำสไตล์
} from '@fluentui/react-components';
import { WeatherSunny24Regular, WeatherMoon24Regular } from '@fluentui/react-icons';

// Import State Store ของเรา
import { useThemeStore } from '@arcfusion/store';

// Import Pages และ MFE Components
import { ServicesPage } from './pages/ServicesPage';
const AskAi = React.lazy(() => import('ask_ai/AskAi'));
const Home = React.lazy(() => import('home/Home'));

// --- เริ่มส่วนของการตั้งค่า Theme และ Layout ---

// 1. ใช้ makeStyles เพื่อสร้างสไตล์ที่ผูกกับ Theme ของ Fluent UI
// นี่คือวิธีใหม่ในการทำสไตล์แทนที่ Tailwind class
const useAppLayoutStyles = makeStyles({
  root: {
    minHeight: '100vh',
    backgroundColor: tokens.colorNeutralBackground1,
    color: tokens.colorNeutralForeground1,
    transitionProperty: 'background-color, color',
    transitionDuration: tokens.durationNormal,
    transitionTimingFunction: tokens.curveEasyEase,
  },
  mainContent: {
    padding: tokens.spacingHorizontalXXL,
  },
  toggleContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginBottom: tokens.spacingVerticalL,
  },
});

// 2. Component Layout หลักของแอป
const AppLayout = () => {
  const styles = useAppLayoutStyles();
  const { theme, toggleTheme } = useThemeStore();

  return (
    <div className={styles.root}>
      <Suspense fallback={<div style={{ padding: '24px' }}>Loading AskAi...</div>}>
        <AskAi />
      </Suspense>
      <main className={styles.mainContent}>
        <div className={styles.toggleContainer}>
          <FluentButton
            appearance="transparent"
            icon={theme === 'dark' ? <WeatherSunny24Regular /> : <WeatherMoon24Regular />}
            onClick={toggleTheme}
            aria-label="Toggle theme"
          />
        </div>

        <Suspense fallback={<div style={{ padding: '24px' }}>Loading Page...</div>}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Suspense>
      </main>
    </div>
  );
};

// 3. Component "ยาม" เฝ้าแอป (ไม่เปลี่ยนแปลง)
const ProtectedAppLayout = withAuthenticationRequired(AppLayout, {
  onRedirecting: () => (
    // เราสามารถใช้ styling ของ Fluent ที่นี่ได้เช่นกันถ้าต้องการ
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

// 4. Component ศูนย์กลางควบคุม Theme (เรียบง่ายขึ้นมาก)
function ThemedApp() {
  const { theme } = useThemeStore();
  const fluentTheme = theme === 'dark' ? webDarkTheme : webLightTheme;

  // แค่ส่ง Theme ที่ถูกต้องให้กับ FluentProvider ก็พอ ไม่ต้องมี useEffect
  return (
    <FluentProvider theme={fluentTheme}>
      <ProtectedAppLayout />
    </FluentProvider>
  );
}

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
