import { config } from '@repo/eslint-config/base'

export default [
  ...config,
  {
    ignores: ['**/.next/**', '**/dist/**', '**/node_modules/**', '**/*.json', '**/.prettierrc'],
  },
]
