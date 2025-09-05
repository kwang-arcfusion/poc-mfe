// hosts/knowesis/src/App.tsx

import React, { Suspense } from 'react';
import { Routes, Route, Navigate, BrowserRouter } from 'react-router-dom';
// ✨ ลบ withAuthenticationRequired ออก
// import { withAuthenticationRequired } from '@auth0/auth0-react';
import { FluentProvider, Spinner } from '@fluentui/react-components';
import { useThemeStore } from '@arcfusion/store';
import { useGlobalStyles, arcusionLightTheme, arcusionDarkTheme, ASSETS } from '@arcfusion/ui';
import { AppLayout } from './layouts/AppLayout';

// Import all Pages
import { HomePage } from './pages/HomePage';
import { AskAiPage } from './pages/AskAiPage';
import { StoriesPage } from './pages/StoriesPage';
import { OverviewPage } from './pages/OverviewPage';
import { StoryDetailPage } from './pages/StoryDetailPage';

// ✨ ลบ ProtectedApp component ทั้งหมดออก
// const ProtectedApp = withAuthenticationRequired(AppLayout, { ... });

// Central component that assembles everything together
function ThemedApp() {
  useGlobalStyles();
  const { theme } = useThemeStore();
  const fluentTheme = theme === 'dark' ? arcusionDarkTheme : arcusionLightTheme;

  return (
    <FluentProvider theme={fluentTheme}>
      <Suspense fallback={<div style={{ padding: '24px' }}>Loading Page...</div>}>
        <Routes>
          {/* ✨ ปรับโครงสร้าง Route ใหม่ ให้ AppLayout เป็นตัวคุม layout หลักโดยตรง */}
          <Route element={<AppLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/ask_ai/:chatId?" element={<AskAiPage />} />
            <Route path="/stories" element={<StoriesPage />} />
            <Route path="/stories/:storyId" element={<StoryDetailPage />} />
            <Route path="/overview" element={<OverviewPage />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Route>
        </Routes>
      </Suspense>
    </FluentProvider>
  );
}

// Main App Component
export function App() {
  return (
    <BrowserRouter>
      <ThemedApp />
    </BrowserRouter>
  );
}
