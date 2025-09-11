// hosts/knowesis/src/bootstrap.tsx
import { createRoot } from 'react-dom/client';
import { Auth0Provider } from '@auth0/auth0-react';
import { App } from './App';

import { initApiClient } from '@arcfusion/client';

// ---- Main Application Setup ----
const domain = process.env.AUTH0_DOMAIN;
const clientId = process.env.AUTH0_CLIENT_ID;

const apiUrl = process.env.REACT_APP_API_BASE_URL;
console.log('bootstrap.tsx:15 |apiUrl| : ', apiUrl);
if (!domain || !clientId) {
  throw new Error('Auth0 domain and client ID must be set in .env file');
}

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
  root.render(
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: window.location.origin,
      }}
    >
      <App />
    </Auth0Provider>
  );
}
