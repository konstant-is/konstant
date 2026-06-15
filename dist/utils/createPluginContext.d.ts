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
export declare const createPluginContext: (pluginConfig: NavigationPluginConfig, locales: string[]) => {
    appendLocaleToUrl: AppendLocaleToUrlOptions;
    collections: string[];
    fallbackLocale: string;
    fieldConfigs: {
        localizedSlugFieldConfig: {
            fieldName: string;
            sourceField?: string;
        };
        localizedUrlFieldConfig: {
            fieldName: string;
            sourceField?: string;
        };
        permalinkFieldConfig: {
            fieldName: string;
            sourceField?: string;
        };
        slugFieldConfig: SlugFieldConfig;
        urlFieldConfig: UrlFieldConfig;
    };
    locales: string[];
    nestedDocsEnabled: boolean;
    permalinkEnabled: boolean;
    slugifyOptions: {
        locale: string;
        lower: boolean;
        remove: RegExp;
        replacement: string;
        strict: boolean;
        trim: boolean;
    };
};
