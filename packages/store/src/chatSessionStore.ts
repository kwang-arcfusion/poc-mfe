// packages/store/src/chatSessionStore.ts
import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { getApiBaseUrl, getConversationByThreadId } from '@arcfusion/client';
import type { ConversationResponse, StreamedEvent, ChatMessage as ApiChatMessage } from '@arcfusion/types';

// Helper types and functions previously in AskAi remote
type Asset = { id: string; title: string; [key: string]: any };
type AssetGroup = {
  id: string;
  sqls: Asset[];
  dataframes: Asset[];
  charts: Asset[];
};

type TextBlock = {
  kind: 'text';
  id: number;
  sender: 'user' | 'ai';
  content: string;
};

type AssetsBlock = {
  kind: 'assets';
  id: number;
  group: AssetGroup;
};

type Block = TextBlock | AssetsBlock;

type StreamStatus = 'idle' | 'streaming' | 'completed' | 'error';

// ✨ START: REWRITE THIS ENTIRE FUNCTION ✨
function transformConversationResponseToBlocks(response: ConversationResponse): Block[] {
    if (!response || !response.messages) {
        return [];
    }
    const blocks: Block[] = [];
    let idCounter = Date.now();

    for (const message of response.messages) {
        if (message.role === 'system') continue;

        // For bot messages, check for assets first and create an AssetsBlock if they exist.
        if (message.role === 'bot') {
            const assetGroup: AssetGroup = { id: uuidv4(), sqls: [], dataframes: [], charts: [] };
            let hasAssets = false;

            if (message.generated_sql) {
                assetGroup.sqls.push({ id: `sql-${idCounter}`, title: 'Generated SQL', sql: message.generated_sql });
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
            // TODO: Add logic for chart_config if needed in the future

            if (hasAssets) {
                blocks.push({
                    kind: 'assets',
                    id: idCounter++,
                    group: assetGroup,
                });
            }
        }

        // After handling assets, always add the text content as a TextBlock.
        // This applies to both 'user' and 'bot' roles.
        const textContent = (typeof message.content === 'string') ? message.content : '';
        if (textContent) {
            blocks.push({
                kind: 'text',
                id: idCounter++,
                sender: message.role === 'bot' ? 'ai' : 'user',
                content: textContent,
            });
        }
    }
    return blocks;
}
// ✨ END: REWRITE THIS ENTIRE FUNCTION ✨


// Store State and Actions
export interface ChatSessionState {
  // State
  threadId?: string;
  blocks: Block[];
  status: StreamStatus;
  error: string | null;
  activePrompt: string | null;
  isLoadingHistory: boolean;
  
  // Internal state for streaming logic
  processedEventsCount: number;
  pendingAssets: AssetGroup;

  // Actions
  loadConversation: (threadId: string) => Promise<void>;
  sendMessage: (text: string, currentThreadId?: string) => Promise<string>;
  clearChat: () => void;
}

const initialPendingAssets = (): AssetGroup => ({
  id: uuidv4(),
  sqls: [],
  dataframes: [],
  charts: [],
});

export const useChatSessionStore = create<ChatSessionState>((set, get) => ({
  // Initial State
  threadId: undefined,
  blocks: [],
  status: 'idle',
  error: null,
  activePrompt: null,
  isLoadingHistory: false,
  processedEventsCount: 0,
  pendingAssets: initialPendingAssets(),

  // Actions
  clearChat: () => {
    set({ 
      threadId: undefined, 
      blocks: [], 
      activePrompt: null, 
      status: 'idle', 
      error: null, 
      processedEventsCount: 0,
      pendingAssets: initialPendingAssets(),
    });
  },

  loadConversation: async (threadId) => {
    if (get().isLoadingHistory) return;
    set({ 
      isLoadingHistory: true, 
      status: 'idle', 
      error: null,
      processedEventsCount: 0,
      pendingAssets: initialPendingAssets(),
    });
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
      set({ error: err.message, isLoadingHistory: false });
    }
  },

  sendMessage: async (text, currentThreadId) => {
    if (get().status === 'streaming') return currentThreadId || '';

    const newThreadId = currentThreadId || uuidv4();
    
    set((state) => ({
        threadId: newThreadId,
        status: 'streaming',
        error: null,
        activePrompt: state.activePrompt || text,
        blocks: [
            ...state.blocks,
            { kind: 'text', id: Date.now(), sender: 'user', content: text },
            { kind: 'text', id: Date.now() + 1, sender: 'ai', content: '' },
        ],
        processedEventsCount: 0,
        pendingAssets: initialPendingAssets(),
    }));
    
    // --- Full Streaming Logic ---
    try {
      const API_BASE_URL = getApiBaseUrl();
      if (!API_BASE_URL) throw new Error('API Client not initialized.');
      
      const response = await fetch(`${API_BASE_URL}/v1/chat/ask`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: text, thread_id: newThreadId }),
      });

      if (!response.ok || !response.body) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }
      
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let allEvents: StreamedEvent[] = [];

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
            allEvents.push(eventData);
          } catch (e) {
            console.warn('Could not parse SSE JSON part:', part);
          }
        }
        
        const { processedEventsCount } = get();
        const newEvents = allEvents.slice(processedEventsCount);

        if (newEvents.length > 0) {
            const blocksFromNewEvents: Block[] = [];
            let { pendingAssets } = get();

            const processPendingAssets = () => {
                if (pendingAssets.sqls.length > 0 || pendingAssets.dataframes.length > 0 || pendingAssets.charts.length > 0) {
                    blocksFromNewEvents.push({ kind: 'assets', id: Date.now(), group: { ...pendingAssets } });
                    pendingAssets = initialPendingAssets();
                }
            };
            
            newEvents.forEach((event, index) => {
                if ('sql_query' in event) {
                    pendingAssets.sqls.push({ id: `sql-${index}`, title: 'Generated SQL', sql: event.sql_query });
                } else if ('sql_query_result' in event) {
                    const df = event.sql_query_result;
                    if (df && df.length > 0) {
                        pendingAssets.dataframes.push({ id: `df-${index}`, title: 'Query Result', columns: Object.keys(df[0]), rows: df.map((row) => Object.values(row)) });
                    }
                } else if ('answer_chunk' in event || 'answer' in event) {
                    processPendingAssets();
                    const textContent = (event as any).answer_chunk || (event as any).answer;
                    if (textContent) {
                        blocksFromNewEvents.push({ kind: 'text', id: Date.now() + index, sender: 'ai', content: textContent });
                    }
                }
            });

            processPendingAssets();
            set({ pendingAssets });

            set(state => {
                const updatedBlocks = [...state.blocks];
                const lastBlock = updatedBlocks[updatedBlocks.length - 1];
                if (lastBlock?.kind === 'text' && lastBlock.sender === 'ai' && lastBlock.content === '') {
                    updatedBlocks.pop();
                }

                for (const newBlock of blocksFromNewEvents) {
                    const lastPrevBlock = updatedBlocks[updatedBlocks.length - 1];
                    if (newBlock.kind === 'text' && lastPrevBlock?.kind === 'text' && lastPrevBlock.sender === 'ai') {
                        (lastPrevBlock as TextBlock).content += (newBlock as TextBlock).content;
                    } else {
                        updatedBlocks.push(newBlock);
                    }
                }
                return { blocks: updatedBlocks };
            });

            set({ processedEventsCount: allEvents.length });
        }
      }
    } catch (err: any) {
      console.error('Streaming failed:', err);
      set({ error: err.message, status: 'error' });
    } finally {
      set({ status: 'completed' });
    }

    return newThreadId;
  },
}));