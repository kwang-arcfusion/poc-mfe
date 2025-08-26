// hosts/knowesis/src/pages/OverviewPage.tsx

import React, { Suspense, useEffect } from 'react'; // ลบ useState
import { useNavigate } from 'react-router-dom';
// import { Button } from '@fluentui/react-components'; // ไม่ใช้แล้ว
// import { Filter24Regular } from '@fluentui/react-icons'; // ไม่ใช้แล้ว
import { useTopbarStore } from '../stores/topbarStore';

const Overview = React.lazy(() => import('overview/Overview'));

// ลบ OverviewTopbarActions component ทิ้งไปทั้งหมด

export function OverviewPage() {
  const navigate = useNavigate();
  const { setActions } = useTopbarStore();

  // ไม่ต้องมี State isFilterOpen อีกต่อไป

  // useEffect จะยังคงอยู่เพื่อเคลียร์ actions ของหน้าอื่น
  useEffect(() => {
    // ไม่มีการตั้งค่า actions ใดๆ สำหรับหน้านี้
    setActions({});
    return () => setActions({});
  }, [setActions]);

  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        {/* ส่งแค่ navigate prop ลงไปพอ */}
        <Overview navigate={navigate} />
      </Suspense>
    </div>
  );
}
