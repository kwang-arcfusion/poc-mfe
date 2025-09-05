import React, { Suspense } from 'react';
import { Spinner } from '@fluentui/react-components';
import { useNavigate, useParams } from 'react-router-dom';

const AskAi = React.lazy(() => import('ask_ai/AskAi'));

export function AskAiPage() {
  const navigate = useNavigate();
  const { chatId } = useParams<{ chatId: string }>();

  return (
    <Suspense fallback={<Spinner size="huge" />}>
      <AskAi navigate={navigate} chatId={chatId} />
    </Suspense>
  );
}
