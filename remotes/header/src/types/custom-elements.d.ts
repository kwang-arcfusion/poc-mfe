// src/types/custom-elements.d.ts
import type * as React from 'react';

declare global {
  // อนุญาต custom elements (มีเครื่องหมาย -)
  namespace JSX {
    interface IntrinsicElements {
      [tagName: `${string}-${string}`]: React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      > & { [key: string]: any }; // เผื่อ prop เฉพาะของ lib นั้น ๆ
    }
  }
}

export {};
