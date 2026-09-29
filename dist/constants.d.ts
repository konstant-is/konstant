import type { AppendLocaleToUrlOptions, LocalizedSlugFieldConfig, LocalizedUrlFieldConfig, PermalinkFieldConfig, SlugFieldConfig, SlugifyOptions, UrlFieldConfig } from './types.js';
export declare const defaultSlugify: Required<SlugifyOptions>;
type DefaultValues = {
    appendLocaleToUrl: AppendLocaleToUrlOptions;
    fallbackLocale: string;
    fields: {
        localizedSlug: LocalizedSlugFieldConfig;
        localizedUrl: LocalizedUrlFieldConfig;
        permalink: PermalinkFieldConfig;
        slug: SlugFieldConfig;
        url: UrlFieldConfig;
    };
    permalinkEnabled: boolean;
    slugifyOptions: Required<SlugifyOptions>;
};
export declare const defaultValues: DefaultValues;
export {};
