// remotes/ask_ai/src/AskAi.tsx
import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
// import { ThemeToggle } from '@arcfusion/ui'; // <-- ลบบรรทัดนี้

export default function AskAi() {
  const { isAuthenticated, logout, user } = useAuth0();
  const handleLogout = () => {
    /*...*/
  };

  return (
    <header className="w-full border-b border-neutral-200 bg-white dark:bg-neutral-800 dark:border-neutral-700 transition-colors">
      <div className="mx-auto max-w-5xl p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* <ThemeToggle /> <-- ลบ Component นี้ออก */}
          {isAuthenticated && <span className="text-sm">Welcome, {user?.name}</span>}
          {/* ... ปุ่ม Logout ... */}
        </div>
      </div>
    </header>
  );
}
