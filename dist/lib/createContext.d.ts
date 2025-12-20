import type { TranslationContextValue } from '../types.js';
export declare function createTranslationContext<TLocales extends string, TKeys extends string>(): import("react").Context<TranslationContextValue<TLocales, TKeys> | undefined>;
