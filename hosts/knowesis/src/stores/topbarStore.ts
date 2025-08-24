// hosts/knowesis/src/stores/topbarStore.ts
import { create } from 'zustand';

// กำหนด Type ของ Actions
export interface TopbarActions {
  left?: React.ReactNode;
  right?: React.ReactNode;
}

// กำหนด Type ของ State และ Actions ภายใน Store
export interface TopbarState {
  // ✨ แก้ไขโดยการเพิ่ม export
  actions: TopbarActions;
  setActions: (actions: TopbarActions) => void;
}

// สร้าง Zustand store
export const useTopbarStore = create<TopbarState>((set) => ({
  // ค่าเริ่มต้นของ state
  actions: {},
  // Action สำหรับอัปเดต state
  setActions: (newActions) => set({ actions: newActions }),
}));
