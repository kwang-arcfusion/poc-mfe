// ตัวอย่างไฟล์ tailwind.config.mjs ของแต่ละแอป (knowesis, ask_ai, home)
import path from 'path';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{ts,tsx}',
    // เพิ่มบรรทัดนี้เข้าไปในทุกไฟล์ config
    path.join(path.dirname(require.resolve('@arcfusion/ui')), '**/*.{ts,tsx}'),
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
