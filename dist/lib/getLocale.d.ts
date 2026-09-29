import type { SanitizedConfig } from "payload";
/**
 * Extracts the type of locale codes dynamically from the Payload config.
 */
type ExtractLocaleCodes<T extends SanitizedConfig> = T["localization"] extends {
    localeCodes: readonly (infer L)[];
} ? L : never;
/**
 * Validates and returns the locale.
 * @param config - The Payload config object.
 * @param locale - The locale string to validate.
 * @returns The validated locale.
 */
export declare const getLocale: <T extends SanitizedConfig>(config: T, locale: null | string | undefined) => ExtractLocaleCodes<T>;
export {};
