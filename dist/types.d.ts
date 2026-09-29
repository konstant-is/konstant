import type { NestedDocsPluginConfig } from '@payloadcms/plugin-nested-docs/types';
import type { CollectionSlug } from 'payload';
export type AppendLocaleToUrlOptions = 'all' | 'exclude-default' | 'none';
export type NavigationPluginConfig = {
    appendLocaleToUrl?: AppendLocaleToUrlOptions;
    /**
     * Collections this plugin should extend. If you need different configs for different collections, this plugin can be added to your config more than once with different collections.
     */
    collections: CollectionSlug[];
    disabled?: boolean;
    fallbackLocale?: string;
    /**
     * Configuration for slug and URL fields.
     */
    fields?: {
        localizedSlug?: Partial<LocalizedSlugFieldConfig>;
        localizedUrl?: Partial<LocalizedUrlFieldConfig>;
        permalink?: Partial<PermalinkFieldConfig>;
        slug?: Partial<SlugFieldConfig>;
        url?: Partial<UrlFieldConfig>;
    };
    /**
     * Configuration for nested document support.
     */
    nestedDocsPlugin?: Omit<NestedDocsPluginConfig, 'collections'>;
    permalinkEnabled?: boolean;
    slugifyOptions?: SlugifyOptions;
};
type BaseFieldConfig = {
    fieldName: string;
    sourceField?: string;
};
export type SlugifyOptions = {
    locale?: string;
    lower?: boolean;
    remove?: RegExp;
    replacement?: string;
    strict?: boolean;
    trim?: boolean;
};
export type LocalizedSlugFieldConfig = BaseFieldConfig;
export type LocalizedUrlFieldConfig = BaseFieldConfig;
export type SlugFieldConfig = {
    autoIncrementSlug?: boolean;
    lockFieldName: string;
    useFields: string[];
} & BaseFieldConfig;
type GenerateURL = (data: Record<string, unknown> | undefined) => string;
export type UrlFieldConfig = {
    generateUrl?: GenerateURL;
} & Omit<BaseFieldConfig, 'sourceField'>;
export type PermalinkFieldConfig = BaseFieldConfig;
export {};
