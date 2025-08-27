// hosts/knowesis/src/pages/OverviewPage.tsx

import React, { Suspense, useEffect } from 'react'; // remove useState
import { useNavigate } from 'react-router-dom';
// import { Button } from '@fluentui/react-components'; // not used
// import { Filter24Regular } from '@fluentui/react-icons'; // not used
import { useTopbarStore } from '../stores/topbarStore';

const Overview = React.lazy(() => import('overview/Overview'));

// Remove the OverviewTopbarActions component entirely

export function OverviewPage() {
  const navigate = useNavigate();
  const { setActions } = useTopbarStore();

  // State 'isFilterOpen' is no longer needed

  // useEffect remains to clear actions from other pages
  useEffect(() => {
    // No actions are set for this page
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
