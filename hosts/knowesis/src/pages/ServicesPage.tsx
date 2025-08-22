import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';

interface Service {
  id: string;
  name: string;
  link: string;
}

export function ServicesPage() {
  const { user } = useAuth0();
  const namespace = 'https://myapp.example.com/'; // <-- namespace จาก Action ของเรา
  const userServices: Service[] = user?.[namespace + 'services'] || [];

  const handleServiceClick = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div>
      <h2 className="text-lg font-medium mb-4">Your Services</h2>
      {userServices.length > 0 ? (
        <ul className="space-y-2">
          {userServices.map((service) => (
            <li
              key={service.id}
              className="flex justify-between items-center p-4 rounded-lg border hover:bg-neutral-100 transition-colors cursor-pointer"
              onClick={() => handleServiceClick(service.link)}
            >
              <span className="font-medium">{service.name}</span>
              <span>➔</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center text-neutral-500 py-4">You do not have access to any services.</p>
      )}
    </div>
  );
}
