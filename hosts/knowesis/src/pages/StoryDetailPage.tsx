import React, { Suspense } from 'react';
import { Spinner } from '@fluentui/react-components';
import { useParams, useSearchParams } from 'react-router-dom';

const StoryDetailRemotePage = React.lazy(() => import('stories/StoryDetailPage'));

export function StoryDetailPage() {
  const { storyId } = useParams<{ storyId: string }>();
  const [searchParams] = useSearchParams();
  const threadId = searchParams.get('thread');

  return (
    <Suspense fallback={<Spinner size="huge" />}>
      <StoryDetailRemotePage storyId={storyId} threadId={threadId} />
    </Suspense>
  );
}
