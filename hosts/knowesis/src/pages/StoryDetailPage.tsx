// hosts/knowesis/src/pages/StoryDetailPage.tsx
import React, { Suspense } from 'react';
import { Spinner } from '@fluentui/react-components';
// ✨ 1. Import useParams hook
import { useParams } from 'react-router-dom';

const StoryDetailRemotePage = React.lazy(() => import('stories/StoryDetailPage'));

export function StoryDetailPage() {
  // ✨ 2. ดึง storyId มาจาก URL
  const { storyId } = useParams<{ storyId: string }>();

  return (
    <Suspense fallback={<Spinner size="huge" />}>
      {/* ✨ 3. ส่ง storyId เป็น prop ลงไป */}
      <StoryDetailRemotePage storyId={storyId} />
    </Suspense>
  );
}