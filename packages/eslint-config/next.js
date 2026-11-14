import pluginNext from '@next/eslint-plugin-next'

import { config as reactConfig } from './react-internal.js'

/** @type {import('eslint').Linter.Config[]} */
export const nextJsConfig = [
  ...reactConfig,
  {
    plugins: { '@next/next': pluginNext },
    rules: {
      ...pluginNext.configs.recommended.rules,
      ...pluginNext.configs['core-web-vitals'].rules,
    },
  },
]
