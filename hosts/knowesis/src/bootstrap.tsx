import { createRoot } from 'react-dom/client';
import { App } from './App';

import { initApiClient } from '@arcfusion/client';

const apiUrl = process.env.REACT_APP_API_BASE_URL;
console.log('bootstrap.tsx:15 |apiUrl| : ', apiUrl);

if (!apiUrl) {
 throw new Error('REACT_APP_API_BASE_URL is not defined in .env file.');
}

console.log(
 `%c[knowesis/bootstrap] Attempting to initialize API client...`,
 'color: blue; font-weight: bold;'
);
initApiClient(apiUrl);

const container = document.getElementById('root');
if (container) {
 const root = createRoot(container);
 root.render(<App />);
}