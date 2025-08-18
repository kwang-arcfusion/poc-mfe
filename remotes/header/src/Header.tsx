import '@material/web/button/filled-button.js';
import { useState } from 'react';
import './styles.css';

export default function Header() {
  const [count, setCount] = useState(0);
  return (
    <header className="w-full border-b border-neutral-200 bg-white">
      <div className="mx-auto max-w-5xl p-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold">Microfrontend Header</h1>







        
        <md-filled-button onClick={() => setCount((c) => c + 1)}>click: {count}</md-filled-button>
      </div>
    </header>
  );
}
