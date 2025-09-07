// packages/store/src/chatSessionStore.ts
import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { getApiBaseUrl, getConversationByThreadId } from '@arcfusion/client';
import { useChatHistoryStore } from './chatHistoryStore';
import type {
  ConversationResponse,
  StreamedEvent,
  AssetGroup,
  Block,
  TextBlock,
} from '@arcfusion/types';

type StreamStatus = 'idle' | 'streaming' | 'completed' | 'error';
type AiTask =
  | 'thinking'
  | 'creating sql'
  | 'creating table'
  | 'creating chart'
  | 'answering'
  | null;

// (โค้ดส่วน transformConversationResponseToBlocks เหมือนเดิม)
function transformConversationResponseToBlocks(response: ConversationResponse): Block[] {
  if (!response || !response.messages) {
    return [];
  }
  const blocks: Block[] = [];
  let idCounter = Date.now();
  for (const message of response.messages) {
    if (message.role === 'system') continue;
    if (message.role === 'bot') {
      const assetGroup: AssetGroup = { id: uuidv4(), sqls: [], dataframes: [], charts: [] };
      let hasAssets = false;
      if (message.generated_sql) {
        assetGroup.sqls.push({
          id: `sql-${idCounter}`,
          title: 'Generated SQL',
          sql: message.generated_sql,
        });
        hasAssets = true;
      }
      if (message.sql_result && message.sql_result.length > 0) {
        assetGroup.dataframes.push({
          id: `df-${idCounter}`,
          title: 'Query Result',
          columns: Object.keys(message.sql_result[0]),
          rows: message.sql_result.map((row: Record<string, any>) => Object.values(row)),
        });
        hasAssets = true;
      }
      if (message.chart_config) {
        assetGroup.charts.push({
          id: `chart-${idCounter}`,
          title: message.chart_config.title?.text || 'Chart',
          config: message.chart_config,
        });
        hasAssets = true;
      }
      if (hasAssets) {
        blocks.push({
          kind: 'assets',
          id: idCounter++,
          messageId: (message as any).id,
          group: assetGroup,
        });
      }
    }
    const textContent = typeof message.content === 'string' ? message.content : '';
    if (textContent) {
      blocks.push({
        kind: 'text',
        id: idCounter++,
        messageId: (message as any).id,
        sender: message.role === 'bot' ? 'ai' : 'user',
        content: textContent,
      });
    }
  }
  return blocks;
}

export interface ChatSessionState {
  threadId?: string;
  streamingThreadId?: string;
  blocks: Block[];
  status: StreamStatus;
  error: string | null;
  activePrompt: string | null;
  isLoadingHistory: boolean;
  currentAiTask: AiTask;
  pendingAssets: AssetGroup;
  loadConversation: (threadId: string) => Promise<void>;
  sendMessage: (text: string, currentThreadId?: string, storyId?: string) => Promise<string>;
  clearChat: () => void;
  updateLastMessageWithData: (threadId: string) => Promise<void>;
}

const initialPendingAssets = (): AssetGroup => ({
  id: uuidv4(),
  sqls: [],
  dataframes: [],
  charts: [],
});

// ✨ [Best Practice] 1. สร้าง initialState object เพื่อใช้ในการรีเซ็ต
const initialState: Omit<
  ChatSessionState,
  'loadConversation' | 'sendMessage' | 'clearChat' | 'updateLastMessageWithData'
> = {
  threadId: undefined,
  streamingThreadId: undefined,
  blocks: [],
  status: 'idle',
  error: null,
  activePrompt: null,
  isLoadingHistory: false,
  currentAiTask: null,
  pendingAssets: initialPendingAssets(),
};

export const createChatSessionStore = () =>
  create<ChatSessionState>((set, get) => ({
    ...initialState,

    // ✨ [Best Practice] 2. แก้ไข clearChat ให้รีเซ็ต State ทั้งหมด
    clearChat: () => {
      set(initialState);
    },

    loadConversation: async (threadId) => {
      // ✨ [Best Practice] 3. รีเซ็ต State เก่าก่อนโหลดข้อมูลใหม่เสมอ
      set({ ...initialState, isLoadingHistory: true });

      try {
        const conversationData = await getConversationByThreadId(threadId);
        const loadedBlocks = transformConversationResponseToBlocks(conversationData);
        set({
          blocks: loadedBlocks,
          activePrompt: conversationData.title || 'Conversation',
          threadId: conversationData.thread_id,
          isLoadingHistory: false,
        });
      } catch (err: any) {
        console.error('Failed to load conversation:', err);
        set({
          ...initialState, // รีเซ็ตเมื่อเกิด Error
          error: err.message,
          activePrompt: 'Error Loading Chat',
        });
      }
    },

    updateLastMessageWithData: async (threadId) => {
      try {
        const fullConversation = await getConversationByThreadId(threadId);
        const lastBotMessageFromApi = fullConversation.messages.filter((m) => m.role === 'bot').pop();
        if (!lastBotMessageFromApi || !(lastBotMessageFromApi as any).id) return;
        const newMessageId = (lastBotMessageFromApi as any).id;
        set((state) => {
          const newBlocks = [...state.blocks];
          let lastUserIndex = -1;
          for (let i = newBlocks.length - 1; i >= 0; i--) {
            const block = newBlocks[i];
            if (block.kind === 'text' && block.sender === 'user') {
              lastUserIndex = i;
              break;
            }
          }
          if (lastUserIndex !== -1) {
            for (let i = lastUserIndex + 1; i < newBlocks.length; i++) {
              newBlocks[i] = { ...newBlocks[i], messageId: newMessageId };
            }
          }
          return { blocks: newBlocks };
        });
      } catch (error) {
        console.error('Failed to update last message with data:', error);
      }
    },

    sendMessage: async (text, currentThreadId, storyId) => {
      if (get().status === 'streaming') return currentThreadId || '';

      // ✨ [Best Practice] 4. ถ้าเป็นการเริ่มแชทใหม่ ให้รีเซ็ต State ก่อน
      if (!currentThreadId) {
          set(initialState);
      }
      
      const newThreadId = currentThreadId || uuidv4();

      set((state) => ({
        threadId: newThreadId,
        streamingThreadId: newThreadId,
        status: 'streaming',
        currentAiTask: 'thinking',
        error: null,
        activePrompt: state.activePrompt || text,
        blocks: [...state.blocks, { kind: 'text', id: Date.now(), sender: 'user', content: text }],
        pendingAssets: initialPendingAssets(),
      }));

      useChatHistoryStore.getState().startStreaming(newThreadId, 'thinking');

      useChatHistoryStore.getState().addOptimisticConversation({
        thread_id: newThreadId,
        title: text,
        story_id: storyId,
      });

      try {
        const API_BASE_URL = getApiBaseUrl();
        if (!API_BASE_URL) throw new Error('API Client not initialized.');
        const requestBody: any = { query: text, thread_id: newThreadId };
        if (storyId) {
          requestBody.story_id = storyId;
        }
        const response = await fetch(`${API_BASE_URL}/v1/chat/ask`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestBody),
        });
        if (!response.ok || !response.body)
          throw new Error(`API error: ${response.status} ${response.statusText}`);

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const parts = buffer.split('data:');
          buffer = parts.pop() || '';
          for (const part of parts) {
            if (part.trim() === '' || part.trim() === '[DONE]') continue;
            try {
              const eventData: StreamedEvent = JSON.parse(part.trim());
              if ('answer_chunk' in eventData || 'answer' in eventData) {
                const { pendingAssets } = get();
                if (
                  pendingAssets.sqls.length > 0 ||
                  pendingAssets.dataframes.length > 0 ||
                  pendingAssets.charts.length > 0
                ) {
                  set((state) => ({
                    blocks: [
                      ...state.blocks,
                      { kind: 'assets', id: Date.now(), group: pendingAssets },
                    ],
                    pendingAssets: initialPendingAssets(),
                  }));
                }
              }
              set((state) => {
                const newBlocks = [...state.blocks];
                if ('sql_query' in eventData) {
                  const newPendingAssets = { ...state.pendingAssets };
                  newPendingAssets.sqls.push({
                    id: `sql-${Date.now()}`,
                    title: 'Generated SQL',
                    sql: eventData.sql_query,
                  });
                  useChatHistoryStore.getState().startStreaming(newThreadId, 'creating sql');
                  return { pendingAssets: newPendingAssets, currentAiTask: 'creating sql' };
                }
                if ('sql_query_result' in eventData) {
                  const newPendingAssets = { ...state.pendingAssets };
                  const df = eventData.sql_query_result;
                  if (df && df.length > 0) {
                    newPendingAssets.dataframes.push({
                      id: `df-${Date.now()}`,
                      title: 'Query Result',
                      columns: Object.keys(df[0]),
                      rows: df.map((row) => Object.values(row)),
                    });
                  }
                  useChatHistoryStore.getState().startStreaming(newThreadId, 'creating table');
                  return { pendingAssets: newPendingAssets, currentAiTask: 'creating table' };
                }
                if ('chart_builder_result' in eventData) {
                  const newPendingAssets = { ...state.pendingAssets };
                  const chartConfig = eventData.chart_builder_result;
                  if (chartConfig) {
                    newPendingAssets.charts.push({
                      id: `chart-${Date.now()}`,
                      title: chartConfig.title?.text || 'Chart',
                      config: chartConfig,
                    });
                  }
                  useChatHistoryStore.getState().startStreaming(newThreadId, 'creating chart');
                  return { pendingAssets: newPendingAssets, currentAiTask: 'creating chart' };
                }
                if ('answer_chunk' in eventData || 'answer' in eventData) {
                  const textContent = (eventData as any).answer_chunk || (eventData as any).answer;
                  const lastBlock = newBlocks[newBlocks.length - 1];
                  if (lastBlock?.kind === 'text' && lastBlock.sender === 'ai') {
                    (lastBlock as TextBlock).content += textContent;
                  } else {
                    newBlocks.push({
                      kind: 'text',
                      id: Date.now(),
                      sender: 'ai',
                      content: textContent,
                    });
                  }
                  useChatHistoryStore.getState().startStreaming(newThreadId, 'answering');
                  return { blocks: newBlocks, currentAiTask: 'answering' };
                }
                return state;
              });
            } catch (e) {
              console.warn('Could not parse SSE JSON part:', part);
            }
          }
        }
      } catch (err: any) {
        console.error('Streaming failed:', err);
        set({ error: err.message, status: 'error' });
      } finally {
        set({ status: 'completed', currentAiTask: null, streamingThreadId: undefined });
        useChatHistoryStore.getState().stopStreaming(newThreadId);
      }
      return newThreadId;
    },
  }));