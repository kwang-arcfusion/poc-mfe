import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts', 'src/styles.css'],
  format: ['cjs', 'esm'],
  dts: false,
  splitting: false,
  sourcemap: true,
  clean: true,
  external: ['react'],
  // --- เพิ่มบรรทัดนี้ ---
  tsconfig: 'tsconfig.json',
});
