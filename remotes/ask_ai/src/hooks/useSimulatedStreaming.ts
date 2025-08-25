// remotes/ask_ai/src/hooks/useSimulatedStreaming.ts
import { useState, useCallback, useRef, useEffect } from 'react';

type StreamStatus = 'idle' | 'streaming' | 'completed' | 'error';

// ประโยคจำลองสำหรับ AI response
const MOCK_RESPONSE =
  'Based on the data from last week, the Click-Through Rate (CTR) saw a significant increase of 15% on Wednesday, primarily driven by the "Summer Sale" campaign on social media channels. However, there was a noticeable dip of 8% over the weekend, which correlates with reduced ad spend on search platforms. The top-performing creative was video ad variant C, achieving a 2.5% CTR, well above the 1.8% average.';

export function useSimulatedStreaming() {
  const [response, setResponse] = useState('');
  const [status, setStatus] = useState<StreamStatus>('idle');
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const startStreaming = useCallback(() => {
    // Reset state ก่อนเริ่มใหม่
    setResponse('');
    setStatus('streaming');

    let index = 0;
    intervalRef.current = setInterval(() => {
      if (index < MOCK_RESPONSE.length) {
        setResponse((prev) => prev + MOCK_RESPONSE[index]);
        index++;
      } else {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        setStatus('completed');
      }
    }, 30); // ความเร็วในการแสดงผล (ms)
  }, []);

  const reset = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setResponse('');
    setStatus('idle');
  }, []);

  // Cleanup effect
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return { response, status, startStreaming, reset };
}
