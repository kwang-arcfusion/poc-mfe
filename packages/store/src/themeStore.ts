// packages/store/src/themeStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ThemeState = {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
};

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: 'light', // Default theme
      toggleTheme: () => {
        console.log('ACTION: Toggling theme...'); // <-- Log ที่ 1
        set((state) => {
          const newTheme = state.theme === 'light' ? 'dark' : 'light';
          console.log(`STATE: Theme changed from ${state.theme} to ${newTheme}`); // <-- Log ที่ 2
          return { theme: newTheme };
        });
      },
    }),
    {
      name: 'arcfusion-theme-storage', // local storage key
    }
  )
);
