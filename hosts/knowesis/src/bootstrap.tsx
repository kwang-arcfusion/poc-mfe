// hosts/knowesis/src/bootstrap.tsx
import './styles.css';
import { createRoot } from 'react-dom/client';
import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Auth0Provider, withAuthenticationRequired } from '@auth0/auth0-react';

// Import pages
import { ServicesPage } from './pages/ServicesPage';

// Import MFE components
const AskAi = React.lazy(() => import('ask_ai/AskAi'));
const Home = React.lazy(() => import('home/Home'));

// 1. สร้าง Layout หลักของแอปพลิเคชัน
// นี่คือสิ่งที่จะแสดงผล "หลังจาก" ที่ผู้ใช้ล็อกอินสำเร็จแล้ว
const AppLayout = () => {
  return (
    <div className="min-h-dvh bg-neutral-50 text-neutral-900">
      <Suspense fallback={<div className="p-6">Loading ASk ai...</div>}>
        <AskAi />
      </Suspense>
      <main className="p-6">
        <Suspense fallback={<div className="p-6">Loading Page...</div>}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/services" element={<ServicesPage />} />
            {/* ถ้าเข้า path ที่ไม่มีอยู่จริง ให้กลับไปหน้าแรก */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Suspense>
      </main>
    </div>
  );
};

// 2. สร้าง "ยาม" โดยใช้ HOC `withAuthenticationRequired` มาครอบ Layout ของเรา
const ProtectedApp = withAuthenticationRequired(AppLayout, {
  // ระหว่างที่กำลังจะ redirect ไป Auth0 ให้แสดงข้อความนี้
  onRedirecting: () => (
    <div className="flex items-center justify-center min-h-dvh">Arcfusion Loading...</div>
  ),
});

// ---- Main Application Setup ----
const domain = process.env.AUTH0_DOMAIN;
const clientId = process.env.AUTH0_CLIENT_ID;

if (!domain || !clientId) {
  throw new Error('Auth0 domain and client ID must be set in .env file');
}

createRoot(document.getElementById('root')!).render(
  <Auth0Provider
    domain={domain}
    clientId={clientId}
    authorizationParams={{
      // 3. เปลี่ยน redirect_uri เป็นหน้าแรกของแอป
      // Auth0 SDK จะจำหน้าที่ผู้ใช้พยายามจะเข้าไว้ให้เอง และส่งกลับมาถูกที่หลังล็อกอิน
      redirect_uri: window.location.origin,
    }}
  >
    <BrowserRouter>
      {/* 4. Render ตัวแอปที่มียามเฝ้าอยู่ */}
      <ProtectedApp />
    </BrowserRouter>
  </Auth0Provider>
);
