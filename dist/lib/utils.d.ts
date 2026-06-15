import type { InferTranslationKeys, InferTranslationLocales, TranslationFn } from '../types.js';
/**
 * Creates a translation function (`t`) from a dictionary.
 * This function can be used both on the server and in a client provider.
 */
export declare function createTranslation<T>(locale: string, config: T): TranslationFn<InferTranslationLocales<T>, InferTranslationKeys<T>>;
export declare function entriesOf<T extends Record<string, any>>(obj: T): [keyof T, T[keyof T]][];
