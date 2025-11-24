import type { PropsWithChildren } from 'react'

// types.ts
export type TranslationConfig<TLocales extends string, TKeys extends string> = {
  defaultLocale: TLocales
  locales: Record<TLocales, string>
  translations: Record<TKeys, { [L in TLocales]?: null | string } & { key: TKeys }>
}

export type TranslationKey<TLocales extends string, TKeys extends string> = keyof TranslationConfig<
  TLocales,
  TKeys
>['translations']

export type TranslationFn<TLocales extends string, TKeys extends string> = (
  key: TranslationKey<TLocales, TKeys>,
  params?: Record<string, any>,
) => string

export interface TranslationContextValue<TLocales extends string, TKeys extends string> {
  attributes: Record<string, string>
  currentLocale: string
  defaultLocale: TLocales
  isMounted: () => boolean
  locales: { code: TLocales; label: string }[]
  setAttributes: (values: Record<string, string>) => void
  setLocale: (locale: TLocales) => void
  t: TranslationFn<TLocales, TKeys>
}

export type ProviderProps<TLocales extends string, TKeys extends string> = PropsWithChildren<{
  config: TranslationConfig<TLocales, TKeys>
  locale: TLocales
}>
// export type TranslationConfig<TLocales extends string, TKeys extends string> = {
//   defaultLocale: TLocales
//   locales: Record<TLocales, string> // full locale list (optional friendly names)
//   translations: Record<
//     TKeys,
//     {
//       [L in TLocales]?: null | string
//     } & {
//       key: TKeys
//     }
//   >
// }

// export type TranslationKey<L extends string, K extends string> = keyof TranslationConfig<
//   L,
//   K
// >['translations']

// export type Locales<L extends string, K extends string> = TranslationConfig<L, K>['defaultLocale']

// export type TranslationFn<L extends string, K extends string> = (
//   key: TranslationKey<L, K>,
//   params?: Record<string, any>,
// ) => string
