// hosts/host/src/bootstrap.tsx
import './styles.css';
import { createRoot } from 'react-dom/client';
import React, { Suspense, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Auth0Provider, useAuth0 } from '@auth0/auth0-react';

// Import pages and components
import { LoginPage } from './pages/LoginPage';
import { ServicesPage } from './pages/ServicesPage';
import { ProtectedRoute } from './components/ProtectedRoute';

const Header = React.lazy(() => import('header/Header'));
const Home = React.lazy(() => import('home/Home'));

function App() {
  const { isAuthenticated } = useAuth0();

  useEffect(() => {
    console.log('bootstrap.tsx:20 |isAuthenticated| : ', isAuthenticated);
  }, []);
  return (
    <div className="min-h-dvh bg-neutral-50 text-neutral-900">
      <div>{`${isAuthenticated}`}</div>
      <Suspense fallback={<div className="p-6">Loading Header...</div>}>
        <Header />
      </Suspense>
      <main className="p-6">
        <Suspense fallback={<div className="p-6">Loading Page...</div>}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={isAuthenticated ? <ServicesPage /> : <LoginPage />} />
            <Route path="/services" element={<ProtectedRoute component={ServicesPage} />} />
          </Routes>
        </Suspense>
      </main>
    </div>
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
