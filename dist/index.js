import { nestedDocsPlugin } from "@payloadcms/plugin-nested-docs";
import { resolveLocalizedSlugs, resolveLocalizedUrl, resolveUrl } from "./hooks/index.js";
import { createPluginContext } from "./utils/createPluginContext.js";
import { enhanceFields } from "./utils/enhanceFields.js";
import { getLocales } from "./utils/getLocals.js";
import { mergeHooks } from "./utils/mergeHooks.js";
export const navigationPlugin = (navigationConfig)=>async (config)=>{
        if (navigationConfig.disabled) {
            return config;
        }
        const locales = getLocales(config);
        let enhancedConfig = config;
        if (navigationConfig.nestedDocsPlugin) {
            // Integrate nestedDocsPlugin and await its result
            enhancedConfig = await nestedDocsPlugin({
                collections: navigationConfig.collections,
                ...navigationConfig.nestedDocsPlugin
            })(enhancedConfig);
        }
        const pluginConfig = createPluginContext(navigationConfig, locales);
        return {
            ...config,
            collections: (enhancedConfig.collections || []).map((c)=>createCollection(pluginConfig, c))
        };
    };
const createCollection = (context, collection)=>{
    if (!context.collections.includes(collection.slug)) {
        return collection; // Skip collections not included in the plugin config
    }
    // Enhance fields
    const fields = enhanceFields({
        context,
        fields: collection.fields
    });
    return {
        ...collection,
        fields,
        hooks: {
            ...collection.hooks || {},
            beforeChange: mergeHooks([
                resolveUrl(context),
                resolveLocalizedUrl(context),
                resolveLocalizedSlugs(context)
            ], collection.hooks?.beforeChange)
        }
    };
};

//# sourceMappingURL=index.js.map