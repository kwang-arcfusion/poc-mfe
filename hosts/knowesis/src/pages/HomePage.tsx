// hosts/knowesis/src/pages/HomePage.tsx
import React, { Suspense, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { RadioGroup, Radio } from '@fluentui/react-components';
import { useTopbarStore } from '../stores/topbarStore';

const Home = React.lazy(() => import('home/Home'));

// Create page-specific Actions component
const HomeActions = () => (
  <RadioGroup layout="horizontal">
    <Radio value="A" label="Method A" />
    <Radio value="B" label="Method B" />
  </RadioGroup>
);

export function HomePage() {
  const navigate = useNavigate();
  const { setActions } = useTopbarStore();

  // useEffect runs when the component is mounted
  useEffect(() => {
    // Set actions for this page
    setActions({ left: <HomeActions /> });

    // Cleanup function: runs when the component is unmounted
    return () => setActions({});
  }, [setActions]);

  return (
    <Suspense fallback={<div style={{ padding: '24px' }}>Loading Page...</div>}>
      <Home navigate={navigate} />
    </Suspense>
  );
}
