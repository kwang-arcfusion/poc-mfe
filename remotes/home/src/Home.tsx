import React from 'react';

interface HomeProps {
  navigate: (path: string) => void;
}

export default function Home({ navigate }: HomeProps) {
  return (
    <section className="space-y-4">
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
