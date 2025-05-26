/**
 * Checks if a given locale is valid based on the available locale codes.
 * @param locale - The locale string to validate.
 * @param localeCodes - The list of valid locale codes.
 * @returns True if the locale is valid, otherwise false.
 */ const isLocale = (locale, localeCodes)=>{
    return !!locale && localeCodes.includes(locale);
};
/**
 * Validates and returns the locale.
 * @param config - The Payload config object.
 * @param locale - The locale string to validate.
 * @returns The validated locale.
 */ export const getLocale = (config, locale)=>{
    const { localization } = config;
    if (!localization) {
        throw new Error(`Localization is not supported by Payload`);
    }
    const { defaultLocale, localeCodes } = localization;
    if (isLocale(locale, localeCodes)) {
        return locale;
    }
    return defaultLocale;
};

//# sourceMappingURL=getLocale.js.map