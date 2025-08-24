// hosts/knowesis/src/pages/AskAiPage.tsx
import React, { Suspense } from 'react';

const AskAi = React.lazy(() => import('ask_ai/AskAi'));

export function AskAiPage() {
  return (
    <div>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px' }}>Ask AI</h1>
      <Suspense fallback={<div>Loading AskAI Component...</div>}>
        {/* ที่จริงแล้ว AskAi ของคุณตอนนี้คือ Header เราอาจจะต้องสร้าง component ใหม่ในอนาคต */}
        {/* แต่ตอนนี้ใช้ไปก่อนได้ครับ */}
        <AskAi />
      </Suspense>
    </div>
  );
}
