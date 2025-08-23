// remotes/home/src/standalone.tsx

(async () => {
  // 1. เริ่มต้น handshake เพื่อเตรียม shared modules
  // @ts-ignore
  await __webpack_init_sharing__('default');

  // 2. หลังจาก handshake สำเร็จ ค่อย import ทุกอย่างแบบ async
  const React = (await import('react')).default;
  const { createRoot } = await import('react-dom/client');
  const { Auth0Provider, withAuthenticationRequired } = await import('@auth0/auth0-react');
  const Home = (await import('./Home')).default;

  // 3. สร้าง component ที่ถูกป้องกันแล้ว
  const ProtectedHome = withAuthenticationRequired(Home, {
    onRedirecting: () => <div>Redirecting to login...</div>,
  });

  const domain = process.env.AUTH0_DOMAIN;
  const clientId = process.env.AUTH0_CLIENT_ID;

  if (!domain || !clientId) {
    throw new Error('Auth0 domain and client ID must be set in .env file');
  }

  // 4. Render แอปพลิเคชัน
  const root = document.getElementById('root')!;
  createRoot(root).render(
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: window.location.origin,
      }}
    >
      <ProtectedHome />
    </Auth0Provider>
  );
})();
