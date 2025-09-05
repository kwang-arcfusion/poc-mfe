import type { AssetGroup, Block } from '../types';
import type { ConversationResponse } from '@arcfusion/types';

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

        messageId: (message as any).id,
        sender: message.role === 'bot' ? 'ai' : 'user',
        content: combinedText,
      });
    }
  }

  return blocks;
}
