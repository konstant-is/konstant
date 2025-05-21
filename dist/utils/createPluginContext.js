import { defaultValues } from '../constants.js';
export const createPluginContext = (pluginConfig, locales)=>{
    const fields = pluginConfig.fields || {};
    const slugFieldConfig = createFieldConfig('slug', fields.slug);
    const localizedSlugFieldConfig = createFieldConfig('localizedSlug', fields.localizedSlug, {
        sourceField: slugFieldConfig.fieldName
    });
    const urlFieldConfig = createFieldConfig('url', fields.url);
    const localizedUrlFieldConfig = createFieldConfig('localizedUrl', fields.localizedUrl, {
        sourceField: urlFieldConfig.fieldName
    });
    const permalinkFieldConfig = createFieldConfig('permalink', fields.permalink, {
        sourceField: urlFieldConfig.fieldName
    });
    // Default base configuration
    return {
        appendLocaleToUrl: pluginConfig.appendLocaleToUrl || defaultValues.appendLocaleToUrl,
        collections: pluginConfig.collections,
        fallbackLocale: pluginConfig.appendLocaleToUrl || defaultValues.fallbackLocale,
        fieldConfigs: {
            localizedSlugFieldConfig,
            localizedUrlFieldConfig,
            permalinkFieldConfig,
            slugFieldConfig,
            urlFieldConfig
        },
        locales,
        nestedDocsEnabled: Boolean(pluginConfig.nestedDocsPlugin),
        permalinkEnabled: pluginConfig.permalinkEnabled ?? defaultValues.permalinkEnabled,
        slugifyOptions: {
            ...defaultValues.slugifyOptions,
            ...pluginConfig.slugifyOptions || {}
        }
    };
};
const createFieldConfig = (fieldKey, config, injected)=>{
    const defaultConfig = defaultValues.fields[fieldKey];
    if (!defaultConfig) {
        throw new Error(`Invalid field key: ${fieldKey}`);
    }
    return {
        ...defaultConfig,
        ...injected,
        ...config
    };
};

//# sourceMappingURL=createPluginContext.js.map