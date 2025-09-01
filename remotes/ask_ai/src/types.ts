// remotes/ask_ai/src/types.ts

export type {
  SqlAsset,
  DataframeAsset,
  ChartAsset,
  AssetGroup,
} from '@arcfusion/types';

// ✨ BaseBlock คือ Type หลักที่กำหนดว่าทุก Block ต้องมีอะไรบ้าง
export interface BaseBlock {
  id: number; // ID ที่สร้างจาก Frontend (Date.now()) สำหรับ React key
  messageId?: string; // ID จริงจาก Backend (UUID) สำหรับ API calls
}

// ✨ TextBlock kế thừa (extends) BaseBlock
export interface TextBlock extends BaseBlock {
  kind: 'text';
  sender: 'user' | 'ai';
  content: string;
}

// ✨ AssetsBlock kế thừa (extends) BaseBlock
export interface AssetsBlock extends BaseBlock {
  kind: 'assets';
  group: import('@arcfusion/types').AssetGroup;
}

export type Block = TextBlock | AssetsBlock;