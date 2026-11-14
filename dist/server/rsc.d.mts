import { NextRequest, NextResponse } from "next/server.js";
export declare function createLocalizationMiddleware(opts: {
  config: {
    defaultLocale: string;
    locales: string[];
  };
  log?: boolean;
}): (request: NextRequest) => NextResponse | undefined;
type InferTranslationLocales<T> = T extends {
  translations: Record<string, infer V>;
} ? keyof Omit<V, 'id' | 'key'> : never;
type InferTranslationKeys<T> = T extends {
  translations: Record<infer K, any>;
} ? K & string : never;
type TranslationConfig<TLocales extends string, TKeys extends string> = {
  defaultLocale: TLocales;
  locales: Record<TLocales, string>;
  translations: Record<TKeys, { [L in TLocales]?: null | string; } & {
    key: TKeys;
  }>;
};
type TranslationKey<TLocales extends string, TKeys extends string> = keyof TranslationConfig<TLocales, TKeys>['translations'];
type TranslationFn<TLocales extends string, TKeys extends string> = (key: TranslationKey<TLocales, TKeys>, params?: Record<string, any>) => string;
/**
 * Creates a translation function (`t`) from a dictionary.
 * This function can be used both on the server and in a client provider.
 */
export declare function createTranslation<T>(locale: string, config: T): TranslationFn<InferTranslationLocales<T>, InferTranslationKeys<T>>;
export {};
//# sourceMappingURL=rsc.d.mts.map