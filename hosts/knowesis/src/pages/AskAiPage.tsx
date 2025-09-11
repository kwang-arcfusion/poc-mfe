// hosts/knowesis/src/pages/AskAiPage.tsx
import React, { Suspense } from 'react';
import { Spinner } from '@fluentui/react-components';
import { useNavigate, useParams } from 'react-router-dom';
import { ChatSessionProvider } from '@arcfusion/store';

// Lazy load the remote component
const AskAi = React.lazy(() => import('ask_ai/AskAi'));

export function AskAiPage() {
  const navigate = useNavigate();
  const { chatId } = useParams<{ chatId: string }>();

  return (
    <ChatSessionProvider>
      <Suspense fallback={<Spinner size="huge" />}>
        <AskAi navigate={navigate} chatId={chatId} />
      </Suspense>
    </ChatSessionProvider>
  );
}
