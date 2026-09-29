import type { PropsWithChildren } from 'react';
import React from 'react';
import type { InferTranslationKeys, InferTranslationLocales, TranslationContextValue } from '../types.js';
export declare function createTranslationContext<T>(): React.Context<TranslationContextValue<InferTranslationLocales<T>, InferTranslationKeys<T>> | undefined>;
export type ProviderProps<T> = React.PropsWithChildren<{
    config: T;
    locale: string;
}>;
export declare function createTranslationProvider<T>(TranslationContext: React.Context<TranslationContextValue<InferTranslationLocales<T>, InferTranslationKeys<T>> | undefined>): ({ children, config, locale: initialLocale, }: PropsWithChildren<{
    config: T;
    locale: string;
}>) => React.JSX.Element;
export declare function createUseTranslation<T>(TranslationContext: React.Context<TranslationContextValue<InferTranslationLocales<T>, InferTranslationKeys<T>> | undefined>): () => TranslationContextValue<InferTranslationLocales<T>, InferTranslationKeys<T>>;
export declare function typedEntries<T extends Record<string, string>>(obj: T): [keyof T & string, string][];
