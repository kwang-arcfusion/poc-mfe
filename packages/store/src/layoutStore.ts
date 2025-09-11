// packages/store/src/layoutStore.ts
import { create } from 'zustand';

export type MainOverflow = 'auto' | 'visible' | 'hidden';

export interface LayoutState {
  mainOverflow: MainOverflow;
  setMainOverflow: (overflow: MainOverflow) => void;
}

export const useLayoutStore = create<LayoutState>((set) => ({
  mainOverflow: 'auto',
  setMainOverflow: (overflow) => set({ mainOverflow: overflow }),
}));
