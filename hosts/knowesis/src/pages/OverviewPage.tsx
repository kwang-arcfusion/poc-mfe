import React, { Suspense } from 'react';
import { useNavigate } from 'react-router-dom';

// 1. Lazy load a 'Overview' component from the 'overview' remote
const Overview = React.lazy(() => import('overview/Overview'));

export function OverviewPage() {
  const navigate = useNavigate();

  return (
    <div>
      {/* 3. ใช้ Suspense เพื่อรอ Remote Component โหลด */}
      <Suspense>
        {/* 4. Render Remote Component และส่ง props ที่จำเป็นลงไป */}
        <Overview navigate={navigate} />
      </Suspense>
    </div>
  );
}
