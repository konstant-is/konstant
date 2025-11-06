import type {
  AppendLocaleToUrlOptions,
  LocalizedSlugFieldConfig,
  LocalizedUrlFieldConfig,
  PermalinkFieldConfig,
  SlugFieldConfig,
  SlugifyOptions,
  UrlFieldConfig,
} from './types.js'

export const defaultSlugify: Required<SlugifyOptions> = {
  locale: 'en',
  lower: true,
  remove: /[*+~.()'"!:@]/g,
  replacement: '-',
  strict: false,
  trim: true,
}
type DefaultValues = {
  appendLocaleToUrl: AppendLocaleToUrlOptions
  fallbackLocale: string
  fields: {
    localizedSlug: LocalizedSlugFieldConfig
    localizedUrl: LocalizedUrlFieldConfig
    permalink: PermalinkFieldConfig
    slug: SlugFieldConfig
    url: UrlFieldConfig
  }
  permalinkEnabled: boolean
  slugifyOptions: Required<SlugifyOptions>
}
export const defaultValues: DefaultValues = {
  appendLocaleToUrl: 'exclude-default',
  fallbackLocale: 'en',
  fields: {
    slug: {
      fieldName: 'slug',
      lockFieldName: 'slugLock',
      useFields: ['title'],
    },
    localizedSlug: {
      fieldName: 'slugs',
      sourceField: 'slug',
    },
    localizedUrl: {
      fieldName: 'urls',
      sourceField: 'url',
    },
    permalink: {
      fieldName: 'permalink',
      sourceField: 'url',
    },
    url: {
      fieldName: 'url',
    },
  },
  permalinkEnabled: true,
  slugifyOptions: defaultSlugify,
}
