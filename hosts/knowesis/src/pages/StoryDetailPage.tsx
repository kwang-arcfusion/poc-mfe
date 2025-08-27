// hosts/knowesis/src/pages/StoryDetailPage.tsx
import React, { Suspense } from 'react';
import { Spinner } from '@fluentui/react-components';

const StoryDetailRemotePage = React.lazy(() => import('stories/StoryDetailPage'));

export function StoryDetailPage() {
  return (
    <Suspense fallback={<Spinner size="huge" />}>
      <StoryDetailRemotePage />
    </Suspense>
  );
}
