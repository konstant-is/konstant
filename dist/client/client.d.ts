
import React, { PropsWithChildren } from "react";
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
interface TranslationContextValue<TLocales extends string, TKeys extends string> {
  attributes: Record<string, string>;
  currentLocale: string;
  defaultLocale: string;
  isMounted: () => boolean;
  locales: {
    code: string;
    label: string;
  }[];
  setAttributes: (values: Record<string, string>) => void;
  setLocale: (locale: TLocales) => void;
  t: TranslationFn<TLocales, TKeys>;
}
export declare function createTranslationContext<T>(): React.Context<TranslationContextValue<InferTranslationLocales<T>, InferTranslationKeys<T>> | undefined>;
export declare function createTranslationProvider<T>(TranslationContext: React.Context<TranslationContextValue<InferTranslationLocales<T>, InferTranslationKeys<T>> | undefined>): ({ children, config, locale: initialLocale }: PropsWithChildren<{
  config: T;
  locale: string;
}>) => React.JSX.Element;
export declare function createUseTranslation<T>(TranslationContext: React.Context<TranslationContextValue<InferTranslationLocales<T>, InferTranslationKeys<T>> | undefined>): () => TranslationContextValue<InferTranslationLocales<T>, InferTranslationKeys<T>>;
export {};
//# sourceMappingURL=client.d.ts.map