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
  config: Record<string, any>;
};

export type AssetGroup = {
  id: string;
  sqls: SqlAsset[];
  dataframes: DataframeAsset[];
  charts: ChartAsset[];
};

export type TextBlock = {
  kind: 'text';
  id: number;
  messageId?: string;
  sender: 'user' | 'ai';
  content: string;
};

export type AssetsBlock = {
  kind: 'assets';
  id: number;
  messageId?: string;
  group: AssetGroup;
};

export type Block = TextBlock | AssetsBlock;
