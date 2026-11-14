// @ts-check

import { nextJsConfig } from '@repo/eslint-config/next-js'
import { config as reactConfig } from '@repo/eslint-config/react-internal'

export default [
  {
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/build/**',
      '**/.next/**',
      '**/.temp/**',
      '**/temp/**',
      '**/payload-types.ts',
    ],
  },
  ...reactConfig,
  ...nextJsConfig.map((config) => ({
    ...config,
    files: ['dev/**/*.{js,jsx,ts,tsx}'],
  })),
  {
    settings: {
      next: {
        rootDir: new URL('./dev/', import.meta.url).pathname,
      },
    },
  },
]
