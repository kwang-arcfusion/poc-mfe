import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
// 1. Remove import Link; we no longer use it

// 2. Create an interface for props so TypeScript recognizes it
interface HomeProps {
  navigate: (path: string) => void;
}

// 3. Accept the navigate prop in the component
export default function Home({ navigate }: HomeProps) {
  const { isAuthenticated, user } = useAuth0();

  return (
    <section className="space-y-4">
      {isAuthenticated && <h2 className="text-lg font-medium">Welcome back, {user?.name}!</h2>}

      {/* 4. Replace <Link> with <button> having onClick and call navigate() */}
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
