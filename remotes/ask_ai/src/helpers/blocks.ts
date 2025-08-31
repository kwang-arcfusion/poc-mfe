// remotes/ask_ai/src/helpers/blocks.ts
import type { AssetGroup } from '../types';
import type { ConversationResponse } from '@arcfusion/types';

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

export function findLastAiTextIndex(blocks: Block[]): number {
  for (let i = blocks.length - 1; i >= 0; i--) {
    const b = blocks[i];
    if (b.kind === 'text' && b.sender === 'ai') return i;
  }
  return -1;
}

export function transformConversationResponseToBlocks(response: ConversationResponse): Block[] {
  if (!response || !response.messages) {
    return [];
  }

  const blocks: Block[] = [];
  let idCounter = Date.now();

  for (const message of response.messages) {
    if (message.role === 'system') {
      continue;
    }

    let combinedText = '';

    if (typeof message.content === 'string') {
      combinedText = message.content;
    } else if (Array.isArray(message.content)) {
      combinedText = message.content
        .filter((c) => c.type === 'text' && c.text?.value)
        .map((c) => c.text.value)
        .join('\n');
    }

    if (combinedText) {
      blocks.push({
        kind: 'text',
        id: idCounter++,
        // ✨ START: EDIT THIS LINE ✨
        sender: message.role === 'bot' ? 'ai' : 'user', // ตรวจสอบหา 'bot' แทน 'assistant'
        // ✨ END: EDIT THIS LINE ✨
        content: combinedText,
      });
    }
  }

  return blocks;
}
