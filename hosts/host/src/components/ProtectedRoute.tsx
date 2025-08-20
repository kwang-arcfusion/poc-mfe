import React from 'react';
import { withAuthenticationRequired } from '@auth0/auth0-react';

interface ProtectedRouteProps {
  component: React.ComponentType;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ component }) => {
  const Component = withAuthenticationRequired(component, {
    onRedirecting: () => <div>Loading...</div>,
  });
  return <Component />;
};
