// hosts/knowesis/src/pages/HomePage.tsx
import React, { Suspense, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { RadioGroup, Radio } from '@fluentui/react-components';
import { useTopbar } from '../hooks/useTopbar';

const Home = React.lazy(() => import('home/Home'));

// สร้าง Component ของ Actions สำหรับหน้านี้โดยเฉพาะ
const HomeActions = () => (
  <RadioGroup layout="horizontal">
    <Radio value="A" label="Method A" />
    <Radio value="B" label="Method B" />
  </RadioGroup>
);

export function HomePage() {
  const navigate = useNavigate();
  const { setActions } = useTopbar();

  // useEffect จะทำงานเมื่อ component ถูก mount
  useEffect(() => {
    // กำหนด actions สำหรับหน้านี้
    setActions({ left: <HomeActions /> });

    // Cleanup function: จะทำงานเมื่อ component ถูก unmount
    return () => setActions({});
  }, [setActions]);

  return (
    <Suspense fallback={<div style={{ padding: '24px' }}>Loading Page...</div>}>
      <Home navigate={navigate} />
    </Suspense>
  );
}
