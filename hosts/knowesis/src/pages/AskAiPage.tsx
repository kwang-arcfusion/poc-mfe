// hosts/knowesis/src/pages/AskAiPage.tsx
import React, { Suspense } from 'react';
import { Spinner } from '@fluentui/react-components';
import { useNavigate, useParams } from 'react-router-dom'; // ✨ 1. Import hooks ที่นี่

// Lazy load the remote component
const AskAi = React.lazy(() => import('ask_ai/AskAi'));

export function AskAiPage() {
  const navigate = useNavigate(); // ✨ 2. เรียกใช้ hooks ใน page wrapper
  const { chatId } = useParams<{ chatId: string }>();

  return (
    <Suspense fallback={<Spinner size="huge" />}>
      {/* ✨ 3. ส่ง navigate และ chatId เป็น props ลงไป */}
      <AskAi navigate={navigate} chatId={chatId} />
    </Suspense>
  );
}
