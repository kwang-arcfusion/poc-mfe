// remotes/header/src/Header.tsx
import React from 'react';
import '@material/web/button/filled-button.js';
import '@material/web/button/outlined-button.js';
import './styles.css';
import { useAuth0 } from '@auth0/auth0-react';
import { useEffect } from 'react';

export default function Header() {
  // 1. ดึงฟังก์ชัน `logout` และสถานะ `isAuthenticated` มาจาก useAuth0 hook
  const { isAuthenticated, loginWithRedirect, logout, isLoading, user } = useAuth0();

  const handleLogin = () => {
    loginWithRedirect({
      appState: { returnTo: '/services' },
    });
  };

  // 2. สร้างฟังก์ชัน handleLogout เพื่อเรียกใช้คำสั่ง logout
  const handleLogout = () => {
    logout({
      logoutParams: {
        // บอก Auth0 ว่าหลังจาก logout สำเร็จแล้ว ให้กลับมาที่หน้าแรก (http://localhost:3000)
        returnTo: window.location.origin,
      },
    });
  };

  useEffect(() => {
    console.log('Header.tsx:30 |isAuthenticated| : ', isAuthenticated);
  }, []);

  return (
    <header className="w-full border-b border-neutral-200 bg-white">
      <div className="mx-auto max-w-5xl p-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold">
          <a href="/" className="hover:underline">
            Microfrontend App {`${isAuthenticated}`}
          </a>
        </h1>

        <div className="flex items-center gap-4">
          {isAuthenticated && <span className="text-sm">Welcome, {user?.name}</span>}

          {!isLoading && !isAuthenticated && (
            <md-filled-button onClick={handleLogin}>Log In</md-filled-button>
          )}

          {/* 3. ปุ่ม "Log Out" จะแสดงผลก็ต่อเมื่อ `isAuthenticated` เป็น true */}
          {isAuthenticated && (
            <md-outlined-button onClick={handleLogout}>Log Out</md-outlined-button>
          )}
        </div>
      </div>
    </header>
  );
}
