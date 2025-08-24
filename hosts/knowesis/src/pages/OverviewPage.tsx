import React, { Suspense } from 'react';
import { useNavigate } from 'react-router-dom';

// 1. Lazy load a 'Overview' component from the 'overview' remote
const Overview = React.lazy(() => import('overview/Overview'));

export function OverviewPage() {
  const navigate = useNavigate();

  return (
    <div>
      {/* 2. H1 และ Layout อื่นๆ จะอยู่ที่ "Page Wrapper" นี้ */}
      <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px' }}>Overview</h1>

      {/* 3. ใช้ Suspense เพื่อรอ Remote Component โหลด */}
      <Suspense fallback={<div>Loading Overview Component...</div>}>
        {/* 4. Render Remote Component และส่ง props ที่จำเป็นลงไป */}
        <Overview navigate={navigate} />
      </Suspense>
    </div>
  );
}
