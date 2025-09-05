// hosts/knowesis/src/bootstrap.tsx

import { createRoot } from 'react-dom/client';
import { App } from './App';

// ✨ 1. Import ฟังก์ชัน init จาก package ใหม่
import { initApiClient } from '@arcfusion/client';

// ---- Main Application Setup ----
// ✨ ลบ Auth0 domain และ clientId ออก
// const domain = process.env.AUTH0_DOMAIN;
// const clientId = process.env.AUTH0_CLIENT_ID;

// ✨ 2. ดึงค่า API URL จาก process.env
const apiUrl = process.env.REACT_APP_API_BASE_URL;
console.log('bootstrap.tsx:15 |apiUrl| : ', apiUrl);

// ✨ ลบการเช็ค Auth0 domain และ clientId ออก
// if (!domain || !clientId) {
//  throw new Error('Auth0 domain and client ID must be set in .env file');
// }

// ✨ 3. ตรวจสอบและเรียกใช้ initApiClient
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
 // ✨ Render App โดยตรงโดยไม่มี Auth0Provider
 root.render(<App />);
}