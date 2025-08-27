// hosts/knowesis/src/stores/topbarStore.ts
import { create } from 'zustand';

// Define the type of Actions
export interface TopbarActions {
  left?: React.ReactNode;
  right?: React.ReactNode;
}

// Define the type of State and Actions within the store
export interface TopbarState {
  // ✨ Updated by adding export
  actions: TopbarActions;
  setActions: (actions: TopbarActions) => void;
}

// Create Zustand store
export const useTopbarStore = create<TopbarState>((set) => ({
  // Initial state value
  actions: {},
  // Action to update state
  setActions: (newActions) => set({ actions: newActions }),
}));
