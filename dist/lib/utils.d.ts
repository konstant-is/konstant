import type { InferTranslationKeys, InferTranslationLocales, TranslationConfig, TranslationFn } from '../types.js';
type Locale<L extends string, K extends string> = TranslationConfig<L, K>['defaultLocale'];
export declare const setLocales: <L extends string, K extends string>(config: TranslationConfig<L, K>) => void;
/**
 * Checks if a given string is a valid locale.
 * @param locale The locale string to validate.
 * @returns The validated locale if valid, otherwise throws an error.
 */
export declare const isLocale: (locale: string) => boolean;
/**
 * Validates and returns the locale.
 * @param locale The locale string to validate.
 * @returns The validated locale.
 */
export declare const getLocale: <L extends string, K extends string>(locale?: string) => Locale<L, K>;
/**
 * Creates a translation function (`t`) from a dictionary.
 * This function can be used both on the server and in a client provider.
 */
export declare function createTranslation<T>(locale: string, config: T): TranslationFn<InferTranslationLocales<T>, InferTranslationKeys<T>>;
export declare function entriesOf<T extends Record<string, any>>(obj: T): [keyof T, T[keyof T]][];
export {};
