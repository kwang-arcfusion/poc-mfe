// hosts/host/src/pages/LoginPage.tsx
import { useAuth0 } from '@auth0/auth0-react';
import { Navigate } from 'react-router-dom';

export function LoginPage() {
  const { loginWithRedirect, isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  // ถ้าล็อกอินแล้ว ให้ redirect ไปหน้า services ทันที
  if (isAuthenticated) {
    return <Navigate to="/services" />;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-dvh">
      <div className="p-8 border rounded-lg shadow-md bg-white">
        <h1 className="text-2xl font-bold mb-4 text-center">Welcome</h1>
        <p className="mb-6 text-neutral-600">Please log in to continue.</p>
        <button
          onClick={() => loginWithRedirect()}
          className="w-full px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Log In
        </button>
      </div>
    </div>
  );
}
