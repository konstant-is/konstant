export { }; // export type TranslationConfig<TLocales extends string, TKeys extends string> = {
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

//# sourceMappingURL=types.js.map