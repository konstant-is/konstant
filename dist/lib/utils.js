/**
 * Replaces placeholders (e.g., ${count}) in translation strings.
 */ const replaceParams = (template, params = {})=>Object.entries(params).reduce((result, [key, value])=>result.replace(`\${${key}}`, String(value)), template);
/**
 * Creates a translation function (`t`) from a dictionary.
 * This function can be used both on the server and in a client provider.
 */ export function createTranslation(locale, config) {
    return (key, params)=>{
        const entry = config.translations[key];
        if (!entry) {
            return String(key);
        }
        const raw = entry[locale] ?? entry[config.defaultLocale] ?? entry.key;
        return params ? replaceParams(raw) : raw;
    };
}
// export const createTranslationDepricated = <L extends string, K extends string>(
//   locale: string,
//   config: TranslationConfig<L, K>,
// ) => {
//   return (key: TranslationKey<L, K>, params?: Record<string, any>) =>
//     getTranslation({ config, key, locale, params })
// }
/**
 * Retrieves a translation with optional parameter replacement.
 */ const getTranslation = ({ config, key, locale, params })=>{
    const entry = config.translations[key];
    if (!entry) {
        return key;
    }
    const template = entry[locale];
    return template ? replaceParams(template, params) : key;
};
export function entriesOf(obj) {
    return Object.entries(obj);
}

//# sourceMappingURL=utils.js.map