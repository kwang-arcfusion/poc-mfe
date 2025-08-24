// hosts/knowesis/src/pages/AskAiPage.tsx
import React, { Suspense, useEffect } from 'react';
import { Button as FluentButton } from '@fluentui/react-components';
import { useTopbar } from '../hooks/useTopbar';

const AskAi = React.lazy(() => import('ask_ai/AskAi'));

export function AskAiPage() {
  const { setActions } = useTopbar();

  useEffect(() => {
    // กำหนด actions สำหรับหน้านี้
    setActions({ right: <FluentButton appearance="primary">Special Action</FluentButton> });

    // Cleanup
    return () => setActions({});
  }, [setActions]);

  return (
    <div>
      <Suspense fallback={<div>Loading AskAI Component...</div>}>
        <AskAi />
      </Suspense>
    </div>
  );
}
