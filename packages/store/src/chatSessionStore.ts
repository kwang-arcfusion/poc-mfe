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
  AssetsBlock,
  ChatMessage, // 👈 1. Import ChatMessage
} from '@arcfusion/types';

type StreamStatus = 'idle' | 'streaming' | 'completed' | 'error';
type AiTask =
  | 'thinking'
  | 'creating sql'
  | 'creating table'
  | 'creating chart'
  | 'answering'
  | null;

type StreamMode = 'default' | 'dynamic';

function transformConversationResponseToBlocks(response: ConversationResponse): Block[] {
  if (!response || !response.messages) {
    return [];
  }
  const blocks: Block[] = [];
  let idCounter = Date.now();
  for (const message of response.messages) {
    if (message.role === 'system') continue;

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
        const hasSeries = message.chart_config.series?.length > 0;
        const hasGraphic = message.chart_config.graphic?.length > 0;

        if (hasSeries || hasGraphic) {
          assetGroup.charts.push({
            id: `chart-${idCounter}`,
            title: message.chart_config.title?.text || 'Chart',
            config: message.chart_config,
          });
          hasAssets = true;
        }
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
  }
  return blocks;
}

export interface ChatSessionState {
  threadId?: string;
  streamingThreadId?: string;
  streamingMessageId?: string;
  blocks: Block[];
  rawMessages: ChatMessage[];
  status: StreamStatus;
  error: string | null;
  activePrompt: string | null;
  isLoadingHistory: boolean;
  currentAiTask: AiTask;
  pendingAssets: AssetGroup;
  streamMode: StreamMode;
  loadConversation: (threadId: string) => Promise<void>;
  sendMessage: (text: string, currentThreadId?: string, storyId?: string) => Promise<string>;
  clearChat: () => void;
}

const initialPendingAssets = (): AssetGroup => ({
  id: uuidv4(),
  sqls: [],
  dataframes: [],
  charts: [],
});

const initialState: Omit<ChatSessionState, 'loadConversation' | 'sendMessage' | 'clearChat'> = {
  threadId: undefined,
  streamingThreadId: undefined,
  streamingMessageId: undefined,
  blocks: [],
  rawMessages: [],
  status: 'idle',
  error: null,
  activePrompt: null,
  isLoadingHistory: false,
  currentAiTask: null,
  pendingAssets: initialPendingAssets(),
  streamMode: 'default',
};

export const createChatSessionStore = () =>
  create<ChatSessionState>((set, get) => ({
    ...initialState,

    clearChat: () => {
      set(initialState);
    },

    loadConversation: async (threadId) => {
      set({ ...initialState, isLoadingHistory: true });
      try {
        const conversationData = await getConversationByThreadId(threadId);
        const loadedBlocks = transformConversationResponseToBlocks(conversationData);
        set({
          blocks: loadedBlocks,
          rawMessages: conversationData.messages,
          activePrompt: conversationData.title || 'Conversation',
          threadId: conversationData.thread_id,
          isLoadingHistory: false,
        });
      } catch (err: any) {
        console.error('Failed to load conversation:', err);
        set({
          ...initialState,
          error: err.message,
          activePrompt: 'Error Loading Chat',
        });
      }
    },

    sendMessage: async (text, currentThreadId, storyId) => {
      if (get().status === 'streaming') return currentThreadId || '';

      if (!currentThreadId) {
        set(initialState);
      }

      const newThreadId = currentThreadId || uuidv4(); // 👈 2. สร้างข้อความ User เพื่อเตรียมเพิ่มเข้า rawMessages

      const userMessage: ChatMessage = {
        id: `user-${Date.now()}`,
        role: 'user',
        content: text,
      };

      set((state) => ({
        threadId: newThreadId,
        streamingThreadId: newThreadId,
        status: 'streaming',
        currentAiTask: 'thinking',
        error: null,
        activePrompt: state.activePrompt || text,
        blocks: [...state.blocks, { kind: 'text', id: Date.now(), sender: 'user', content: text }], // 👈 3. เพิ่มข้อความ User เข้าไปใน State
        rawMessages: [...state.rawMessages, userMessage],
        pendingAssets: initialPendingAssets(),
        streamMode: 'default',
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
              const eventData: StreamedEvent & {
                message_id?: string;
                response_type?: string;
              } = JSON.parse(part.trim()); // 👈 4. เมื่อได้ message_id ให้สร้าง placeholder ของ AI ใน rawMessages

              if (eventData.message_id) {
                const botMessagePlaceholder: ChatMessage = {
                  id: eventData.message_id,
                  role: 'bot',
                  content: '',
                };
                set((state) => ({
                  streamingMessageId: eventData.message_id,
                  rawMessages: [...state.rawMessages, botMessagePlaceholder],
                }));
                continue;
              }

              if (eventData.response_type === 'dynamic_response') {
                set({ streamMode: 'dynamic' });
                continue;
              } // 👈 5. อัปเดต rawMessages เมื่อได้รับข้อมูลแต่ละส่วน

              if ('sql_query' in eventData) {
                set((state) => ({
                  pendingAssets: {
                    ...state.pendingAssets,
                    sqls: [
                      ...state.pendingAssets.sqls,
                      { id: `sql-${Date.now()}`, title: 'Generated SQL', sql: eventData.sql_query },
                    ],
                  },
                  currentAiTask: 'creating sql',
                  rawMessages: state.rawMessages.map((msg, index) =>
                    index === state.rawMessages.length - 1
                      ? { ...msg, generated_sql: eventData.sql_query }
                      : msg
                  ),
                }));
                useChatHistoryStore.getState().startStreaming(newThreadId, 'creating sql');
              } else if ('sql_query_result' in eventData) {
                const df = eventData.sql_query_result;
                if (df && df.length > 0) {
                  set((state) => ({
                    pendingAssets: {
                      ...state.pendingAssets,
                      dataframes: [
                        ...state.pendingAssets.dataframes,
                        {
                          id: `df-${Date.now()}`,
                          title: 'Query Result',
                          columns: Object.keys(df[0]),
                          rows: df.map((row) => Object.values(row)),
                        },
                      ],
                    },
                    currentAiTask: 'creating table',
                    rawMessages: state.rawMessages.map((msg, index) =>
                      index === state.rawMessages.length - 1
                        ? { ...msg, sql_result: eventData.sql_query_result }
                        : msg
                    ),
                  }));
                  useChatHistoryStore.getState().startStreaming(newThreadId, 'creating table');
                }
              } else if ('chart_builder_result' in eventData) {
                const chartConfig = eventData.chart_builder_result;
                if (chartConfig) {
                  const hasSeries = chartConfig.series?.length > 0;
                  const hasGraphic = chartConfig.graphic?.length > 0;

                  if (hasSeries || hasGraphic) {
                    set((state) => ({
                      pendingAssets: {
                        ...state.pendingAssets,
                        charts: [
                          ...state.pendingAssets.charts,
                          {
                            id: `chart-${Date.now()}`,
                            title: chartConfig.title?.text || 'Chart',
                            config: chartConfig,
                          },
                        ],
                      },
                      currentAiTask: 'creating chart',
                      rawMessages: state.rawMessages.map((msg, index) =>
                        index === state.rawMessages.length - 1
                          ? { ...msg, chart_config: eventData.chart_builder_result }
                          : msg
                      ),
                    }));
                    useChatHistoryStore.getState().startStreaming(newThreadId, 'creating chart');
                  }
                }
              }

              if ('answer_chunk' in eventData) {
                const { streamMode, pendingAssets, streamingMessageId } = get();

                if (
                  streamMode === 'dynamic' &&
                  (pendingAssets.sqls.length > 0 ||
                    pendingAssets.dataframes.length > 0 ||
                    pendingAssets.charts.length > 0)
                ) {
                  set((state) => ({
                    blocks: [
                      ...state.blocks,
                      {
                        kind: 'assets',
                        id: Date.now(),
                        group: pendingAssets,
                        messageId: streamingMessageId,
                      },
                    ],
                    pendingAssets: initialPendingAssets(),
                  }));
                }

                set((state) => {
                  const newBlocks = [...state.blocks];
                  const lastBlock = newBlocks[newBlocks.length - 1];
                  const textContent = eventData.answer_chunk;

                  if (lastBlock?.kind === 'text' && lastBlock.sender === 'ai') {
                    (lastBlock as TextBlock).content += textContent;
                  } else {
                    newBlocks.push({
                      kind: 'text',
                      id: Date.now(),
                      sender: 'ai',
                      content: textContent,
                      messageId: streamingMessageId,
                    });
                  }
                  useChatHistoryStore.getState().startStreaming(newThreadId, 'answering'); // 👈 6. อัปเดต content ใน rawMessages ด้วย

                  const updatedRawMessages = state.rawMessages.map((msg, index) => {
                    if (index === state.rawMessages.length - 1 && typeof msg.content === 'string') {
                      return { ...msg, content: msg.content + eventData.answer_chunk };
                    }
                    return msg;
                  });

                  return {
                    blocks: newBlocks,
                    currentAiTask: 'answering',
                    rawMessages: updatedRawMessages,
                  };
                });
              } else if ('answer' in eventData) {
                set((state) => {
                  const newBlocks = [...state.blocks];
                  const lastBlock = newBlocks[newBlocks.length - 1];
                  const textContent = eventData.answer;

                  if (lastBlock?.kind === 'text' && lastBlock.sender === 'ai') {
                    (lastBlock as TextBlock).content = textContent;
                  } else {
                    newBlocks.push({
                      kind: 'text',
                      id: Date.now(),
                      sender: 'ai',
                      content: textContent,
                      messageId: get().streamingMessageId,
                    });
                  } // 👈 7. อัปเดต content สุดท้ายใน rawMessages

                  const updatedRawMessages = state.rawMessages.map((msg, index) => {
                    if (index === state.rawMessages.length - 1) {
                      return { ...msg, content: eventData.answer };
                    }
                    return msg;
                  });

                  return { blocks: newBlocks, rawMessages: updatedRawMessages };
                });
              }
            } catch (e) {
              console.warn('Could not parse SSE JSON part:', part);
            }
          }
        }
      } catch (err: any) {
        console.error('Streaming failed:', err);
        set({ error: err.message, status: 'error' });
      } finally {
        const { pendingAssets, blocks, streamMode, streamingMessageId } = get();

        if (
          streamMode === 'default' &&
          (pendingAssets.sqls.length > 0 ||
            pendingAssets.dataframes.length > 0 ||
            pendingAssets.charts.length > 0)
        ) {
          const newAssetsBlock: AssetsBlock = {
            kind: 'assets',
            id: Date.now(),
            group: pendingAssets,
            messageId: streamingMessageId,
          };
          set({ blocks: [...blocks, newAssetsBlock] });
        }

        set({
          status: 'completed',
          currentAiTask: null,
          streamingThreadId: undefined,
          streamingMessageId: undefined,
        });
        useChatHistoryStore.getState().stopStreaming(newThreadId);
      }
      return newThreadId;
    },
  }));
