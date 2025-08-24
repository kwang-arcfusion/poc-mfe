import React from 'react';

interface OverviewProps {
  navigate: (path: string) => void;
}

export default function Overview({ navigate }: OverviewProps) {
  return (
    <div>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>Overview Page (from Remote)</h1>
      <p>Content for the dashboard overview will go here.</p>
      {/* ตัวอย่างการใช้ navigate ที่รับมา */}
      <button
        onClick={() => navigate('/')}
        style={{ color: 'blue', textDecoration: 'underline', marginTop: '1rem' }}
      >
        Go back to Home
      </button>
    </div>
  );
}
