// packages/types/src/index.ts

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

export interface PaginatedStoriesResponse {
  items: Story[];
  total: number;
  page: number;
  page_size: number;
}

export interface ConversationSummary {
  id: string;
  thread_id: string;
  user_id: string;
  title: string | null;
  created_at: string;
  updated_at: string;
  story_id?: string | null;
}

export interface PaginatedConversationsResponse {
  items: ConversationSummary[];
  total: number;
  page: number;
  page_size: number;
}

export type SqlQueryEvent = { sql_query: string };
export type SqlResultEvent = { sql_query_result: Record<string, any>[] };
export type ChartBuilderResultEvent = { chart_builder_result: Record<string, any> };
export type AnswerChunkEvent = { answer_chunk: string };
export type FinalAnswerEvent = { answer: string };
export type StreamedEvent =
  | SqlQueryEvent
  | SqlResultEvent
  | ChartBuilderResultEvent
  | AnswerChunkEvent
  | FinalAnswerEvent;

export interface ChatMessageContent {
  type: 'text';
  text: {
    value: string;
  };
}

export interface ChatMessage {
  role: 'user' | 'bot' | 'system';
  content: string | ChatMessageContent[];
  generated_sql?: string | null;
  sql_result?: Record<string, any>[] | null;
  chart_config?: Record<string, any> | null;
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

export type FeedbackType = 'thumb_up' | 'thumb_down';

export interface FeedbackRequest {
  message_id: string;
  feedback_type: FeedbackType;
  reason?: string;
  details?: string;
}

export interface FeedbackResponse {
  id: string;
  message_id: string;
  feedback_type: FeedbackType;
  reason: string | null;
  details: string | null;
  created_at: string;
  updated_at: string;
}

export * from './chat';
export * from './ui'; // <-- ADD THIS
export * from './analytics'; // <-- ADD THIS
