import { defineConfig } from 'tsdown'

export default defineConfig([
  {
    entry: ['src/exports/client.ts'],
    outDir: 'dist/client',
    platform: 'browser',
    format: ['esm'],
    clean: true,
    dts: true,
    deps: {
      alwaysBundle: ['@konstant/utils'],
      dts: { alwaysBundle: ['@konstant/utils'] },
    },
    sourcemap: true,
    banner: {
      js: "'use client';",
    },
  },
  {
    entry: ['src/exports/server.ts'],
    outDir: 'dist/server',
    platform: 'node',
    format: ['esm'],
    clean: true,
    dts: true,
    deps: {
      alwaysBundle: ['@konstant/utils'],
      dts: { alwaysBundle: ['@konstant/utils'] },
    },
    sourcemap: true,
  },
])
