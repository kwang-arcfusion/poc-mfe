// packages/types/src/chat.ts

export type SqlAsset = { id: string; title: string; sql: string };

export type DataframeAsset = {
  id: string;
  title: string;
  columns: string[];
  rows: (string | number)[][];
};

export type ChartAsset = {
  id: string;
  title: string;
  type: 'bar';
  labels: string[];
  values: number[];
};

export type AssetGroup = {
  id: string;
  sqls: SqlAsset[];
  dataframes: DataframeAsset[];
  charts: ChartAsset[];
};

// ✨ START: แก้ไข Type Definitions ที่นี่ ✨
export type TextBlock = {
  kind: 'text';
  id: number; // ID สำหรับ React key
  messageId?: string; // ID จริงจาก Backend (UUID)
  sender: 'user' | 'ai';
  content: string;
};

export type AssetsBlock = {
  kind: 'assets';
  id: number; // ID สำหรับ React key
  messageId?: string; // ID จริงจาก Backend (UUID)
  group: AssetGroup;
};
// ✨ END: สิ้นสุดการแก้ไข ✨

export type Block = TextBlock | AssetsBlock;
