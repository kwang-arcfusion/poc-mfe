// packages/store/src/layoutStore.ts
import { create } from 'zustand';

// กำหนด Type ของ Overflow ที่เราจะใช้
export type MainOverflow = 'auto' | 'visible' | 'hidden';

export interface LayoutState {
  mainOverflow: MainOverflow;
  setMainOverflow: (overflow: MainOverflow) => void;
}

// สร้าง Store
export const useLayoutStore = create<LayoutState>((set) => ({
  // ค่าเริ่มต้นของ overflow ใน <main> คือ 'auto'
  mainOverflow: 'auto',
  // Action สำหรับเปลี่ยนค่า
  setMainOverflow: (overflow) => set({ mainOverflow: overflow }),
}));
