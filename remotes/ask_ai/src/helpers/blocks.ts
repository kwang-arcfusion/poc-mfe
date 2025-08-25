import type { AssetGroup } from '../types';

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

/** find index of block data AI latest (such as typing indicator) */
export function findLastAiTextIndex(blocks: Block[]): number {
  for (let i = blocks.length - 1; i >= 0; i--) {
    const b = blocks[i];
    if (b.kind === 'text' && b.sender === 'ai') return i;
  }
  return -1;
}
