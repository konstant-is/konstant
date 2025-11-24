'use client'

import {
  createTranslationContext,
  createTranslationProvider,
  createUseTranslation,
} from 'plugin-payload-translations/client'

import type { Translation } from './payload-types.js'

// derive locale + key unions from payload

type Locales = Translation['defaultLocale']
type Keys = keyof Translation['translations']

// typed instances:
export const TranslationContext = createTranslationContext<Locales, Keys>()
export const TranslationProvider = createTranslationProvider<Locales, Keys>(TranslationContext)
export const useTranslation = createUseTranslation<Locales, Keys>(TranslationContext)
