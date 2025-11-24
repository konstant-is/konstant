// contextFactory.ts
import { createContext } from 'react'

import type { TranslationContextValue } from '../types.js'

export function createTranslationContext<TLocales extends string, TKeys extends string>() {
  return createContext<TranslationContextValue<TLocales, TKeys> | undefined>(undefined)
}
