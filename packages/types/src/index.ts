// packages/types/src/index.ts
// ตรงกับ StoryResponse ใน schemas.py
export interface Story {
  id: string;
  user_id: string | null;
  title: string;
  type: string;
  story_content: string;
  metric: string;
  metric_label: string;
  about: string;
  headline: string | null;
  narrative_markdown: string | null;
  trigger_point: Record<string, any>;
  top_movers: Record<string, any>[] | null;
  recommended_actions: Record<string, any>[] | null;
  echart_config: Record<string, any> | null;
  notes: string[] | null;
  sql_query: string;
  metadata_info: Record<string, any> | null;
  created_at: string; // ISO date string
  updated_at: string; // ISO date string
}

// ตรงกับ PaginatedStoriesResponse
export interface PaginatedStoriesResponse {
  items: Story[];
  total: number;
  page: number;
  page_size: number;
}

// ตรงกับ ConversationSummary
export interface ConversationSummary {
  id: string;
  thread_id: string;
  user_id: string;
  title: string | null;
  created_at: string;
  updated_at: string;
}

// ตรงกับ PaginatedConversationsResponse
export interface PaginatedConversationsResponse {
  items: ConversationSummary[];
  total: number;
  page: number;
  page_size: number;
}

// Event types ที่จะได้รับจาก SSE stream ของ /chat/ask
export type SqlQueryEvent = { sql_query: string };
export type SqlResultEvent = { sql_query_result: Record<string, any>[] };
export type ChartConfigEvent = { chart_builder_result: Record<string, any> };
export type AnswerChunkEvent = { answer_chunk: string };
export type FinalAnswerEvent = { answer: string };
export type StreamedEvent =
  | SqlQueryEvent
  | SqlResultEvent
  | ChartConfigEvent
  | AnswerChunkEvent
  | FinalAnswerEvent;

// ✨ START: ADD NEW TYPES FOR CONVERSATION DETAIL ✨
export interface ChatMessageContent {
  type: 'text';
  text: {
    value: string;
    // Potentially other annotations in the future
  };
  // This could be a union with other types like 'sql_result', 'chart', etc.
  // to represent complex messages. For now, we only handle text.
}

export interface ChatMessage {
  role: 'user' | 'bot' | 'system';
  content: string | ChatMessageContent[];
  // ✨ START: ADD NEW PROPERTIES ✨
  // These fields are populated for historical messages from the API
  generated_sql?: string | null;
  sql_result?: Record<string, any>[] | null;
  chart_config?: Record<string, any> | null;
  // ✨ END: ADD NEW PROPERTIES ✨
}

export interface ConversationResponse {
  id: string;
  thread_id: string;
  user_id: string;
  title: string;
  created_at: string;
  updated_at: string;
  messages: ChatMessage[];
}
// ✨ END: ADD NEW TYPES FOR CONVERSATION DETAIL ✨
export * from './chat';
