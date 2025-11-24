import type {
  InferTranslationKeys,
  InferTranslationLocales,
  TranslationConfig,
  TranslationFn,
  TranslationKey,
} from '../types.js'

let locales: string[] = []
let defaultLocale: string = ''
type Locale<L extends string, K extends string> = TranslationConfig<L, K>['defaultLocale']

export const setLocales = <L extends string, K extends string>(config: TranslationConfig<L, K>) => {
  locales = Object.keys(config.locales)
  defaultLocale = config.defaultLocale
}
/**
 * Checks if a given string is a valid locale.
 * @param locale The locale string to validate.
 * @returns The validated locale if valid, otherwise throws an error.
 */
export const isLocale = (locale: string): boolean => {
  if ((locales as readonly string[]).includes(locale)) {
    return true
  }

  return false
}

/**
 * Validates and returns the locale.
 * @param locale The locale string to validate.
 * @returns The validated locale.
 */
export const getLocale = <L extends string, K extends string>(
  locale = defaultLocale,
): Locale<L, K> => {
  if (isLocale(locale)) {
    return locale as Locale<L, K>
  } else {
    console.error(
      `Invalid locale "${locale}" received. Falling back to default locale "${defaultLocale}".`,
    )
    return defaultLocale as Locale<L, K> // Fallback to default locale
  }
}

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
