// remotes/ask_ai/src/types.ts

export type { SqlAsset, DataframeAsset, ChartAsset, AssetGroup } from '@arcfusion/types';

export interface BaseBlock {
  id: number; // ID ที่สร้างจาก Frontend (Date.now()) สำหรับ React key
  messageId?: string; // ID จริงจาก Backend (UUID) สำหรับ API calls
}

export interface TextBlock extends BaseBlock {
  kind: 'text';
  sender: 'user' | 'ai';
  content: string;
}

export interface AssetsBlock extends BaseBlock {
  kind: 'assets';
  group: import('@arcfusion/types').AssetGroup;
}

export type Block = TextBlock | AssetsBlock;
