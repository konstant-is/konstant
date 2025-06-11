import type { CollectionSlug } from 'payload';
import type { AppendLocaleToUrlOptions, LocalizedSlugFieldConfig, LocalizedUrlFieldConfig, NavigationPluginConfig, PermalinkFieldConfig, SlugFieldConfig, SlugifyOptions, UrlFieldConfig } from '../types.js';
export type PluginContext = {
    appendLocaleToUrl: AppendLocaleToUrlOptions;
    collections: CollectionSlug[];
    fallbackLocale: string;
    fieldConfigs: {
        localizedSlugFieldConfig: LocalizedSlugFieldConfig;
        localizedUrlFieldConfig: LocalizedUrlFieldConfig;
        permalinkFieldConfig: PermalinkFieldConfig;
        slugFieldConfig: SlugFieldConfig;
        urlFieldConfig: UrlFieldConfig;
    };
    locales: string[];
    nestedDocsEnabled: boolean;
    permalinkEnabled: boolean;
    slugifyOptions: Required<SlugifyOptions>;
};
export declare const createPluginContext: (pluginConfig: NavigationPluginConfig, locales: string[]) => PluginContext;
