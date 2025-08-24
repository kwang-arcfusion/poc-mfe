import React from 'react';

interface StoriesProps {
  navigate: (path: string) => void;
}

export default function Stories({ navigate }: StoriesProps) {
  return (
    <div>
      <p>Content for stories will go here.</p>
      <button
        onClick={() => navigate('/')}
        style={{
          marginTop: '20px',
          color: 'blue',
          textDecoration: 'underline',
        }}
      >
        Go back to Home
      </button>
    </div>
  );
}
