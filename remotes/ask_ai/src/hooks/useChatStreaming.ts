// remotes/ask_ai/src/hooks/useChatStreaming.ts
import { useState, useCallback, useRef } from 'react';

// Import getApiBaseUrl และ Type จาก package กลาง
import { getApiBaseUrl, type StreamedEvent } from '@arcfusion/client';

export type StreamStatus = 'idle' | 'streaming' | 'completed' | 'error';

export const useChatStreaming = () => {
  const [status, setStatus] = useState<StreamStatus>('idle');
  const [events, setEvents] = useState<StreamedEvent[]>([]);
  const [error, setError] = useState<string | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);

  const startStreaming = useCallback(
    async (query: string, threadId: string, storyId?: string) => {
      // ยกเลิก request เก่า (ถ้ามี) ก่อนเริ่มอันใหม่
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      abortControllerRef.current = new AbortController();

      // รีเซ็ต state สำหรับการ stream ครั้งใหม่
      setStatus('streaming');
      setEvents([]);
      setError(null);

      try {
        const API_BASE_URL = getApiBaseUrl();
        if (!API_BASE_URL) {
          throw new Error(
            'API Client has not been initialized. Please call initApiClient in the host app.'
          );
        }

        const response = await fetch(`${API_BASE_URL}/v1/chat/ask`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            query,
            thread_id: threadId,
            story_id: storyId,
          }),
          signal: abortControllerRef.current.signal,
        });

        if (!response.ok || !response.body) {
          throw new Error(`API error: ${response.status} ${response.statusText}`);
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            break;
          }

          buffer += decoder.decode(value, { stream: true });
          const parts = buffer.split('data:');

          // ส่วนสุดท้ายอาจจะยังมาไม่ครบ ให้เก็บไว้ใน buffer รอรับข้อมูลเพิ่ม
          buffer = parts.pop() || '';

          for (const part of parts) {
            if (part.trim() === '') {
              continue;
            }

            const dataStr = part.trim();

            if (dataStr === '[DONE]') {
              setStatus('completed');
              return;
            }

            try {
              const eventData = JSON.parse(dataStr);
              setEvents((prev) => [...prev, eventData]);
            } catch (e) {
              console.warn('Could not parse SSE JSON part:', dataStr);
            }
          }
        }
      } catch (err: any) {
        if (err.name === 'AbortError') {
          console.log('Stream aborted by user.');
        } else {
          console.error('Streaming failed:', err);
          setError(err.message || 'An unknown error occurred during streaming.');
          setStatus('error');
        }
      } finally {
        // บล็อกนี้จะทำงานเสมอเมื่อ stream จบ (ไม่ว่าจะสำเร็จ, error, หรือถูกยกเลิก)
        // เพื่อให้แน่ใจว่า status จะกลับไปเป็น 'completed' เสมอ
        setStatus('completed');
      }
    },
    [] // dependency array ว่าง เพื่อให้ฟังก์ชันนี้เสถียรและไม่เจอปัญหา Stale State
  );

  return { status, startStreaming, events, error };
};
