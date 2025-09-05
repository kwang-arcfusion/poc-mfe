// remotes/home/src/Home.tsx

import React from 'react';
// ✨ 1. ลบ import useAuth0 ออก
// import { useAuth0 } from '@auth0/auth0-react';

// 2. Create an interface for props so TypeScript recognizes it
interface HomeProps {
  navigate: (path: string) => void;
}

// 3. Accept the navigate prop in the component
export default function Home({ navigate }: HomeProps) {
  // ✨ 4. ลบการเรียกใช้ useAuth0 ออก
  // const { isAuthenticated, user } = useAuth0();

  return (
    <section className="space-y-4">
      {/* ✨ 5. ลบเงื่อนไขและเปลี่ยนเป็นข้อความต้อนรับทั่วไป */}
      <h2 className="text-lg font-medium">Welcome to the Dashboard!</h2>

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
