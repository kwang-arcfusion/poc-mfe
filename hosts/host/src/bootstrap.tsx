import './styles.css';
import { createRoot } from 'react-dom/client';
import React, { Suspense } from 'react';

const Header = React.lazy(() => import('header/Header'));
const Home = React.lazy(() => import('home/Home'));

function App() {
  return (
    <div className="min-h-dvh bg-neutral-50 text-neutral-900">
      <Suspense fallback={<div className="p-6">Loading…</div>}>
        <Header />
        <main className="p-6">
          <Home />
        </main>
      </Suspense>
    </div>
  );
}

createRoot(document.getElementById('root')!).render(<App />);
