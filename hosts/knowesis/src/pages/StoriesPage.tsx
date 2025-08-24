import React, { Suspense } from 'react';
import { useNavigate } from 'react-router-dom';

const Stories = React.lazy(() => import('stories/Stories'));

export function StoriesPage() {
  const navigate = useNavigate();

  return (
    <div>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px' }}>Stories</h1>
      <Suspense fallback={<div>Loading Stories Component...</div>}>
        <Stories navigate={navigate} />
      </Suspense>
    </div>
  );
}
