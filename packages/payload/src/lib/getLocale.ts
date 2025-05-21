import type { SanitizedConfig } from "payload";

/**
 * Extracts the type of locale codes dynamically from the Payload config.
 */
type ExtractLocaleCodes<T extends SanitizedConfig> = T["localization"] extends {
  localeCodes: readonly (infer L)[];
}
  ? L
  : never;

/**
 * Checks if a given locale is valid based on the available locale codes.
 * @param locale - The locale string to validate.
 * @param localeCodes - The list of valid locale codes.
 * @returns True if the locale is valid, otherwise false.
 */
const isLocale = <T extends string>(
  locale: null | string | undefined,
  localeCodes: readonly T[]
): locale is T => {
  return !!locale && localeCodes.includes(locale as T);
};

/**
 * Validates and returns the locale.
 * @param config - The Payload config object.
 * @param locale - The locale string to validate.
 * @returns The validated locale.
 */
export const getLocale = <T extends SanitizedConfig>(
  config: T,
  locale: null | string | undefined
): ExtractLocaleCodes<T> => {
  const { localization } = config;
  if (!localization) {
    throw new Error(`Localization is not supported by Payload`);
  }

  const { defaultLocale, localeCodes } = localization;

  if (isLocale(locale, localeCodes)) {
    return locale as ExtractLocaleCodes<T>;
  }

  return defaultLocale as ExtractLocaleCodes<T>;
};
