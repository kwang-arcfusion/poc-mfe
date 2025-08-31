// hosts/knowesis/src/App.tsx
import React, { Suspense } from 'react';
import { Routes, Route, Navigate, BrowserRouter } from 'react-router-dom';
import { withAuthenticationRequired } from '@auth0/auth0-react';
import { FluentProvider, Spinner } from '@fluentui/react-components';
import { useThemeStore } from '@arcfusion/store';
import { useGlobalStyles, arcusionLightTheme, arcusionDarkTheme, ASSETS } from '@arcfusion/ui';
import { AppLayout } from './layouts/AppLayout';

// Import all Pages
import { HomePage } from './pages/HomePage';
import { AskAiPage } from './pages/AskAiPage';
import { StoriesPage } from './pages/StoriesPage';
import { OverviewPage } from './pages/OverviewPage';
import { StoryDetailPage } from './pages/StoryDetailPage'; // <-- Import the new page wrapper

// "Guard" component for the app
const ProtectedApp = withAuthenticationRequired(AppLayout, {
  onRedirecting: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
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

// Central component that assembles everything together
function ThemedApp() {
  useGlobalStyles();
  const { theme } = useThemeStore();
  const fluentTheme = theme === 'dark' ? arcusionDarkTheme : arcusionLightTheme;

  return (
    <FluentProvider theme={fluentTheme}>
      <Suspense fallback={<div style={{ padding: '24px' }}>Loading Page...</div>}>
        <Routes>
          <Route element={<ProtectedApp />}>
            <Route path="/" element={<HomePage />} />
            {/* ✨ START: EDIT THIS LINE ✨ */}
            <Route path="/ask_ai/:chatId?" element={<AskAiPage />} />
            {/* ✨ END: EDIT THIS LINE ✨ */}
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