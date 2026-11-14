import { CollectionSlug } from "payload";
import { NestedDocsPluginConfig } from "@payloadcms/plugin-nested-docs/types";
type AppendLocaleToUrlOptions = 'all' | 'exclude-default' | 'none';
type NavigationPluginConfig = {
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
type SlugifyOptions = {
  locale?: string;
  lower?: boolean;
  remove?: RegExp;
  replacement?: string;
  strict?: boolean;
  trim?: boolean;
};
type LocalizedSlugFieldConfig = BaseFieldConfig;
type LocalizedUrlFieldConfig = BaseFieldConfig;
type SlugFieldConfig = {
  autoIncrementSlug?: boolean;
  lockFieldName: string;
  useFields: string[];
} & BaseFieldConfig;
type GenerateURL = (data: Record<string, unknown> | undefined) => string;
type UrlFieldConfig = {
  generateUrl?: GenerateURL;
} & Omit<BaseFieldConfig, 'sourceField'>;
type PermalinkFieldConfig = BaseFieldConfig;
export { NavigationPluginConfig as t };
//# sourceMappingURL=types-DrKttHCL.d.mts.map