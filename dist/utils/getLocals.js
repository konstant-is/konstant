export const getLocales = (config)=>{
    const { locales } = config.localization || {};
    if (!locales || locales.length === 0) {
        throw new Error("Localization is required but not enabled. Please configure 'localization.locales' in Payload CMS.");
    }
    return locales.map((locale)=>{
        return typeof locale === 'string' ? locale : locale.code;
    });
};

//# sourceMappingURL=getLocals.js.map