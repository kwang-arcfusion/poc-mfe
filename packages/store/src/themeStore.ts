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
        set((state) => {
          const newTheme = state.theme === 'light' ? 'dark' : 'light';
          return { theme: newTheme };
        });
      },
    }),
    {
      name: 'arcfusion-theme-storage', // local storage key
    }
  )
);
