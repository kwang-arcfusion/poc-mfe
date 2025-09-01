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

export type TextBlock = {
  kind: 'text';
  id: number;
  sender: 'user' | 'ai';
  content: string;
};

export type AssetsBlock = {
  kind: 'assets';
  id: number;
  group: AssetGroup;
};

export type Block = TextBlock | AssetsBlock;