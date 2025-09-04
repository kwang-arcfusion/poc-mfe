// hosts/knowesis/src/pages/StoryDetailPage.tsx
import React, { Suspense } from 'react';
import { Spinner } from '@fluentui/react-components';
// ✨ 1. Import useParams และ useSearchParams จาก react-router-dom
import { useParams, useSearchParams } from 'react-router-dom';

const StoryDetailRemotePage = React.lazy(() => import('stories/StoryDetailPage'));

export function StoryDetailPage() {
  // ✨ 2. ดึง storyId จาก path parameter
  const { storyId } = useParams<{ storyId: string }>(); // ✨ 3. ดึง search parameters จาก URL
  const [searchParams] = useSearchParams(); // ✨ 4. ดึงค่าของ 'thread' ออกมา
  const threadId = searchParams.get('thread');

  return (
    <Suspense fallback={<Spinner size="huge" />}>
      {/* ✨ 5. ส่งทั้ง storyId และ threadId เป็น props ลงไป */}
      <StoryDetailRemotePage storyId={storyId} threadId={threadId} />{' '}
    </Suspense>
  );
}
