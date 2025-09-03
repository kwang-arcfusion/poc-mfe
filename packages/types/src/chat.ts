// packages/types/src/chat.ts

export type SqlAsset = { id: string; title: string; sql: string };

export type DataframeAsset = {
 id: string;
 title: string;
 columns: string[];
 rows: (string | number)[][];
};

// ✨ START: เพิ่ม Type ใหม่สำหรับ Chart Asset
export type ChartAsset = {
 id: string;
 title: string;
 config: Record<string, any>; // สำหรับเก็บ ECharts config
};
// ✨ END: สิ้นสุดการเพิ่ม

export type AssetGroup = {
 id: string;
 sqls: SqlAsset[];
 dataframes: DataframeAsset[];
 charts: ChartAsset[]; // ✨ เพิ่ม property นี้
};

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

export type Block = TextBlock | AssetsBlock;