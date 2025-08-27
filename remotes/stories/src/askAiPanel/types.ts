// remotes/stories/src/askAiPanel/types.ts
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
