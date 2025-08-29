import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: false,
  splitting: false,
  sourcemap: true,
  clean: true,
  // เราไม่มี peerDependencies ใน package นี้
  external: [],
  tsconfig: 'tsconfig.json',
});
