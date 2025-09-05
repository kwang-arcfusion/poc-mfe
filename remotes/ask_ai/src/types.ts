export type {
 SqlAsset,
 DataframeAsset,
 ChartAsset,
 AssetGroup,
} from '@arcfusion/types';

export interface BaseBlock {
 id: number;
 messageId?: string;
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