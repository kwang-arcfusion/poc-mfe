import React, { Suspense, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTopbarStore } from '../stores/topbarStore';

const Overview = React.lazy(() => import('overview/Overview'));

export function OverviewPage() {
  const navigate = useNavigate();
  const { setActions } = useTopbarStore();

  useEffect(() => {
    setActions({});
    return () => setActions({});
  }, [setActions]);

  return (
    <div>
      <Suspense>
        <Overview navigate={navigate} />
      </Suspense>
    </div>
  );
}
