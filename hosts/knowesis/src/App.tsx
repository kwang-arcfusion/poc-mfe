// hosts/knowesis/src/App.tsx
import React, { Suspense, useEffect } from 'react';
import { Routes, Route, Navigate, BrowserRouter, useNavigate } from 'react-router-dom';
import { withAuthenticationRequired } from '@auth0/auth0-react';
import {
  FluentProvider,
  Spinner,
  Toaster,
  useId,
  useToastController,
  Toast,
  ToastTitle,
  ToastBody,
  Button,
  ToastFooter,
  tokens,
  ToastTrigger, // ✨ 1. Import ToastTrigger
} from '@fluentui/react-components';
import { CheckmarkCircle24Filled, Dismiss24Regular } from '@fluentui/react-icons'; // ✨ 2. Import Dismiss24Regular
import { useThemeStore, useChatHistoryStore } from '@arcfusion/store';
import { useGlobalStyles, arcusionLightTheme, arcusionDarkTheme, ASSETS } from '@arcfusion/ui';
import { AppLayout } from './layouts/AppLayout';

// Import all Pages
import { HomePage } from './pages/HomePage';
import { AskAiPage } from './pages/AskAiPage';
import { StoriesPage } from './pages/StoriesPage';
import { OverviewPage } from './pages/OverviewPage';
import { StoryDetailPage } from './pages/StoryDetailPage';

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
  const navigate = useNavigate();
  const { theme } = useThemeStore();
  const fluentTheme = theme === 'dark' ? arcusionDarkTheme : arcusionLightTheme;

  // Logic for Toaster
  const toasterId = useId('toaster');
  const { dispatchToast } = useToastController(toasterId);
  const { unreadResponseInfo, setUnreadResponseInfo } = useChatHistoryStore();

  useEffect(() => {
    if (unreadResponseInfo) {
      const { threadId, storyId, title } = unreadResponseInfo;

      const handleNavigate = () => {
        if (storyId) {
          navigate(`/stories/${storyId}?thread=${threadId}`);
        } else {
          navigate(`/ask_ai/${threadId}`);
        }
      };

      dispatchToast(
        <Toast>
          <ToastTitle
            media={<CheckmarkCircle24Filled style={{ color: tokens.colorStatusSuccessForeground2 }} />}
            // ✨ 3. เพิ่ม action prop พร้อม ToastTrigger สำหรับปุ่มปิด
            action={
              <ToastTrigger>
                <Button
                  appearance="transparent"
                  icon={<Dismiss24Regular />}
                  aria-label="Close"
                />
              </ToastTrigger>
            }
          >
            New Response Received
          </ToastTitle>
          <ToastBody subtitle={`Your question has been answered.`}></ToastBody>
          <ToastFooter>
            <Button size="small" appearance="secondary" onClick={handleNavigate}>
              View Chat
            </Button>
          </ToastFooter>
        </Toast>,
        { intent: 'success', position: 'bottom-end', timeout: 8000 }
      );
      setUnreadResponseInfo(null);
    }
  }, [unreadResponseInfo, dispatchToast, setUnreadResponseInfo, navigate]);

  return (
    <FluentProvider theme={fluentTheme}>
      <Toaster toasterId={toasterId} />
      <Suspense fallback={<div style={{ padding: '24px' }}>Loading Page...</div>}>
        <Routes>
          <Route element={<ProtectedApp />}>
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