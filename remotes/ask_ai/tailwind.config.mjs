// remotes/ask_ai/tailwind.config.mjs
import path from 'path';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{ts,tsx}',
    // เพิ่ม path ไปยัง UI package ของเรา
    path.join(path.dirname(require.resolve('@arcfusion/ui')), '**/*.{ts,tsx}'),
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
