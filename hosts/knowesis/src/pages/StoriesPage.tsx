// hosts/knowesis/src/pages/StoriesPage.tsx
import React, { Suspense } from 'react';
import { useNavigate } from 'react-router-dom';

const Stories = React.lazy(() => import('stories/Stories'));

export function StoriesPage() {
  const navigate = useNavigate();

  return (
    <div>
      <Suspense>
        <Stories navigate={navigate} /> 
      </Suspense>
    </div>
  );
}
