export type InferTranslationLocales<T> = T extends {
    translations: Record<string, infer V>;
} ? keyof Omit<V, 'id' | 'key'> : never;
export type InferTranslationKeys<T> = T extends {
    translations: Record<infer K, any>;
} ? K & string : never;
export type TranslationConfig<TLocales extends string, TKeys extends string> = {
    defaultLocale: TLocales;
    locales: Record<TLocales, string>;
    translations: Record<TKeys, {
        [L in TLocales]?: null | string;
    } & {
        key: TKeys;
    }>;
};
export type TranslationKey<TLocales extends string, TKeys extends string> = keyof TranslationConfig<TLocales, TKeys>['translations'];
export type TranslationFn<TLocales extends string, TKeys extends string> = (key: TranslationKey<TLocales, TKeys>, params?: Record<string, any>) => string;
export interface TranslationContextValue<TLocales extends string, TKeys extends string> {
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
