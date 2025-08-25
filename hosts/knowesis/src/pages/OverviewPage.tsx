import React, { Suspense, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@fluentui/react-components';
import { Filter24Regular } from '@fluentui/react-icons';
import { useTopbarStore } from '../stores/topbarStore';

const Overview = React.lazy(() => import('overview/Overview'));

// 1. สร้าง Component สำหรับปุ่ม Action ที่จะแสดงบน Topbar
const OverviewTopbarActions = ({ onFilterClick }: { onFilterClick: () => void }) => {
  return (
    <Button icon={<Filter24Regular />} onClick={onFilterClick}>
      Filter
    </Button>
  );
};

export function OverviewPage() {
  const navigate = useNavigate();
  const { setActions } = useTopbarStore();

  // 2. ย้าย State การเปิด/ปิด Panel มาไว้ที่นี่
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // 3. ใช้ useEffect เพื่อกำหนด Action ให้กับ Topbar
  useEffect(() => {
    setActions({
      left: <OverviewTopbarActions onFilterClick={() => setIsFilterOpen(true)} />,
    });
    // Cleanup เมื่อออกจากหน้านี้
    return () => setActions({});
  }, [setActions, setIsFilterOpen]);

  return (
    <div>
      <Suspense>
        {/* 4. ส่ง State และฟังก์ชัน Setter ลงไปเป็น Props ให้ Component */}
        <Overview
          navigate={navigate}
          isFilterOpen={isFilterOpen}
          setIsFilterOpen={setIsFilterOpen}
        />
      </Suspense>
    </div>
  );
}
