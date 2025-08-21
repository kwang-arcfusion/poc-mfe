// hosts/host/src/bootstrap.tsx

import './styles.css';
import { createRoot } from 'react-dom/client';
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Auth0Provider } from '@auth0/auth0-react';

// Import pages and new layout
import { LoginPage } from './pages/LoginPage';
import { ServicesPage } from './pages/ServicesPage';
import { ProtectedLayout } from './components/ProtectedLayout'; // <-- Import Layout ใหม่

// Home MFE ไม่ต้องใช้ ProtectedRoute
const Home = React.lazy(() => import('home/Home'));

function App() {
  return (
    <Routes>
      {/* กลุ่มที่ 1: หน้าสาธารณะ (Public Routes) */}
      <Route path="/login" element={<LoginPage />} />

      {/* กลุ่มที่ 2: หน้าที่ต้องป้องกัน (Protected Routes) */}
      {/* ทุก Route ที่อยู่ข้างในนี้จะถูกครอบด้วย ProtectedLayout */}
      <Route element={<ProtectedLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<ServicesPage />} />
        {/* หากมีหน้าอื่นที่ต้องป้องกันในอนาคต ก็มาเพิ่มตรงนี้ */}
      </Route>
    </Routes>
  );
}

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
      redirect_uri: window.location.origin + '/services',
    }}
  >
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Auth0Provider>
);
