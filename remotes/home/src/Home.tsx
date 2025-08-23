// remotes/home/src/Home.tsx (ตัวอย่างถ้าอยากให้ Home รู้จัก User)
import React from 'react';
import './styles.css';
import { useAuth0 } from '@auth0/auth0-react';

export default function Home() {
  const { isAuthenticated, user } = useAuth0();

  return (
    <section className="space-y-4">
      {isAuthenticated ? (
        <h2 className="text-lg font-medium">Welcome back, {user?.name}!</h2>
      ) : (
        <h2 className="text-lg font-medium">Home</h2>
      )}

      <p className="text-sm text-neutral-600">This is the public content area.</p>

      <div>your name</div>
    </section>
  );
}
