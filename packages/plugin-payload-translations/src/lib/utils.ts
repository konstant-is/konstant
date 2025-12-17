import type {
  InferTranslationKeys,
  InferTranslationLocales,
  TranslationConfig,
  TranslationFn,
  TranslationKey,
} from '../types.js'

/**
 * Replaces placeholders (e.g., ${count}) in translation strings.
 */
const replaceParams = (template: string, params: Record<string, any> = {}) =>
  Object.entries(params).reduce(
    (result, [key, value]) => result.replace(`\${${key}}`, String(value)),
    template,
  )

/**
 * Creates a translation function (`t`) from a dictionary.
 * This function can be used both on the server and in a client provider.
 */
export function createTranslation<T>(
  locale: string,
  config: T,
): TranslationFn<InferTranslationLocales<T>, InferTranslationKeys<T>> {
  type L = InferTranslationLocales<T>
  type K = InferTranslationKeys<T>

  return (key: K, params?: Record<string, any>): string => {
    const entry = (config as any).translations[key]
    if (!entry) {
      return String(key)
    }

    const raw = entry[locale] ?? entry[(config as any).defaultLocale] ?? entry.key

    return params ? replaceParams(raw) : raw
  }
}

// export const createTranslationDepricated = <L extends string, K extends string>(
//   locale: string,
//   config: TranslationConfig<L, K>,
// ) => {
//   return (key: TranslationKey<L, K>, params?: Record<string, any>) =>
//     getTranslation({ config, key, locale, params })
// }

/**
 * Retrieves a translation with optional parameter replacement.
 */
const getTranslation = <L extends string, K extends string>({
  config,
  key,
  locale,
  params,
}: {
  config: TranslationConfig<L, K>
  key: TranslationKey<L, K>
  locale: string
  params?: Record<string, any>
}): string => {
  const entry = config.translations[key] as
    | {
        [locale: string]: null | string | undefined
        key: string
      }
    | undefined

  if (!entry) {
    return key
  }
  const template = entry[locale]

  return template ? replaceParams(template, params) : key
}

export function entriesOf<T extends Record<string, any>>(obj: T) {
  return Object.entries(obj) as [keyof T, T[keyof T]][]
}
