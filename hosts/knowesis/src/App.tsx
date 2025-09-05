import React, { Suspense } from 'react';
import { Routes, Route, Navigate, BrowserRouter } from 'react-router-dom';
import { FluentProvider, Spinner } from '@fluentui/react-components';
import { useThemeStore } from '@arcfusion/store';
import { useGlobalStyles, arcusionLightTheme, arcusionDarkTheme, ASSETS } from '@arcfusion/ui';
import { AppLayout } from './layouts/AppLayout';

import { HomePage } from './pages/HomePage';
import { AskAiPage } from './pages/AskAiPage';
import { StoriesPage } from './pages/StoriesPage';
import { OverviewPage } from './pages/OverviewPage';
import { StoryDetailPage } from './pages/StoryDetailPage';

function ThemedApp() {
  useGlobalStyles();
  const { theme } = useThemeStore();
  const fluentTheme = theme === 'dark' ? arcusionDarkTheme : arcusionLightTheme;

  return (
    <FluentProvider theme={fluentTheme}>
      <Suspense fallback={<div style={{ padding: '24px' }}>Loading Page...</div>}>
        <Routes>
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

export function App() {
  return (
    <BrowserRouter>
      <ThemedApp />
    </BrowserRouter>
  );
}
