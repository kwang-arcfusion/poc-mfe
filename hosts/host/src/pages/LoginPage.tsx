import { useAuth0 } from '@auth0/auth0-react';

export function LoginPage() {
  const { loginWithRedirect } = useAuth0();
  return (
    <div className="text-center">
      <h1 className="text-2xl font-bold mb-4">Welcome</h1>
      <p className="mb-6">Please log in to continue to the services dashboard.</p>
      <button
        onClick={() => loginWithRedirect()}
        className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        Log In
      </button>
    </div>
  );
}
