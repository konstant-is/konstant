export const resolveLocalizedSlugs = (context)=>({ data, operation, req })=>{
        const { locale, payload } = req;
        const { defaultLocale = context.fallbackLocale } = payload.config.localization || {};
        const currentLocale = locale || defaultLocale;
        const { localizedSlugFieldConfig } = context.fieldConfigs;
        if (operation === 'create') {
            return data;
        }
        // Fetch source field value
        const sourceField = localizedSlugFieldConfig.sourceField ? data[localizedSlugFieldConfig.sourceField] : undefined;
        if (!sourceField) {
            payload.logger.error(`Error: Missing source field "${localizedSlugFieldConfig.sourceField}" while populating localized slugs.`);
            return data;
        }
        // Fetch or initialize the localized slugs field
        const localizedSlugField = data[localizedSlugFieldConfig.fieldName] || {};
        if (typeof localizedSlugField !== 'object') {
            payload.logger.error(`Error: Localized slugs field "${localizedSlugFieldConfig.fieldName}" is not an object.`);
            return data;
        }
        // Update the localized field with the current locale's slug
        const updatedLocalizedField = {
            ...localizedSlugField,
            [currentLocale]: sourceField
        };
        return {
            ...data,
            [localizedSlugFieldConfig.fieldName]: updatedLocalizedField
        };
    };

//# sourceMappingURL=resolveLocalizedSlugs.js.map