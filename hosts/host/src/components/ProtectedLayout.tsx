// hosts/host/src/components/ProtectedLayout.tsx
import { useAuth0 } from '@auth0/auth0-react';
import { Navigate, Outlet } from 'react-router-dom';
import React, { Suspense } from 'react';

// ดึง Header เข้ามาเป็นส่วนหนึ่งของ Layout นี้
const Header = React.lazy(() => import('header/Header'));

export function ProtectedLayout() {
  const { isAuthenticated, isLoading } = useAuth0();

  // 1. ระหว่างรอเช็คสถานะ ให้แสดง Loading...
  if (isLoading) {
    return <div className="flex items-center justify-center min-h-dvh">Loading session...</div>;
  }

  // 2. ถ้าเช็คแล้วพบว่า "ยังไม่ล็อกอิน" ให้ส่งไปที่หน้า /login ทันที
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // 3. ถ้า "ล็อกอินแล้ว" ให้แสดง Layout หลัก (Header + เนื้อหา)
  // โดย <Outlet /> คือตำแหน่งที่จะแสดงผล Component ลูก (เช่น Home, Services)
  return (
    <div className="min-h-dvh bg-neutral-50 text-neutral-900">
      <Suspense fallback={<div className="p-6">Loading Header...</div>}>
        <Header />
      </Suspense>
      <main className="p-6">
        <Suspense fallback={<div className="p-6">Loading Page...</div>}>
          <Outlet />
        </Suspense>
      </main>
    </div>
  );
}
