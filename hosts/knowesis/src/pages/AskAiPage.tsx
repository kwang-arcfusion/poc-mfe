// hosts/knowesis/src/pages/AskAiPage.tsx
import React, { Suspense } from 'react';

const AskAi = React.lazy(() => import('ask_ai/AskAi'));

export function AskAiPage() {
  return (
    <div>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px' }}>Ask AI</h1>
      <Suspense fallback={<div>Loading AskAI Component...</div>}>
        <AskAi />
      </Suspense>
    </div>
  );
}
