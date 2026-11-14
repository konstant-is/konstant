import eslintReact from '@eslint-react/eslint-plugin'
import pluginReactHooks from 'eslint-plugin-react-hooks'
import globals from 'globals'

import { config as baseConfig } from './base.js'

/** @type {import('eslint').Linter.Config[]} */
export const config = [
  ...baseConfig,
  {
    ...eslintReact.configs['recommended-typescript'],
    files: ['**/*.{js,jsx,mjs,cjs,ts,tsx}'],
    languageOptions: {
      ...eslintReact.configs['recommended-typescript'].languageOptions,
      globals: {
        ...globals.serviceworker,
        ...globals.browser,
      },
    },
  },
  {
    files: ['**/*.{js,jsx,mjs,cjs,ts,tsx}'],
    plugins: { 'react-hooks': pluginReactHooks },
    rules: {
      ...pluginReactHooks.configs.recommended.rules,
      // Keep the official Hooks rules as the source for overlapping checks.
      '@eslint-react/rules-of-hooks': 'off',
      '@eslint-react/exhaustive-deps': 'off',
    },
  },
]
