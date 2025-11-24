'use client'

import {
  createTranslationContext,
  createTranslationProvider,
  createUseTranslation,
} from 'plugin-payload-translations/client'

import type { Translation } from './payload-types.js'

// typed instances:
export const TranslationContext = createTranslationContext<Translation>()
export const TranslationProvider = createTranslationProvider<Translation>(TranslationContext)
export const useTranslation = createUseTranslation<Translation>(TranslationContext)
