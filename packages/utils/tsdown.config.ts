import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['src/exports/index.ts'],
  format: ['esm'],
  platform: 'neutral',
  target: 'es2022',
  dts: true,
  clean: true,
  sourcemap: true,
  outDir: 'dist',
})
