import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
// 1. ลบ import Link ออกไป เราไม่ได้ใช้มันแล้ว

// 2. สร้าง Interface สำหรับ Props เพื่อให้ TypeScript รู้จัก
interface HomeProps {
  navigate: (path: string) => void;
}

// 3. รับ prop navigate เข้ามาใน Component
export default function Home({ navigate }: HomeProps) {
  const { isAuthenticated, user } = useAuth0();

  return (
    <section className="space-y-4">
      {isAuthenticated ? (
        <h2 className="text-lg font-medium">Welcome back, {user?.name}!</h2>
      ) : (
        <h2 className="text-lg font-medium">Home</h2>
      )}

      <p className="text-sm text-neutral-600">This is the public content area.</p>

      {/* 4. เปลี่ยน <Link> เป็น <button> ที่มี onClick และเรียกใช้ navigate() */}
      <nav className="flex flex-col items-start gap-2">
        <h3 className="font-semibold">Navigate to other pages:</h3>
        <button
          onClick={() => navigate('/ask_ai')}
          className="text-blue-600 hover:underline text-left"
        >
          Go to Ask AI
        </button>
        <button
          onClick={() => navigate('/stories')}
          className="text-blue-600 hover:underline text-left"
        >
          Go to Stories
        </button>
        <button
          onClick={() => navigate('/overview')}
          className="text-blue-600 hover:underline text-left"
        >
          Go to Overview
        </button>
      </nav>
    </section>
  );
}
