import type { CollectionSlug } from 'payload'

import type {
  AppendLocaleToUrlOptions,
  LocalizedSlugFieldConfig,
  LocalizedUrlFieldConfig,
  NavigationPluginConfig,
  PermalinkFieldConfig,
  SlugFieldConfig,
  SlugifyOptions,
  UrlFieldConfig,
} from '../types.js'

import { defaultValues } from '../constants.js'

export type PluginContext = {
  appendLocaleToUrl: AppendLocaleToUrlOptions
  collections: CollectionSlug[]
  fallbackLocale: string
  fieldConfigs: {
    localizedSlugFieldConfig: LocalizedSlugFieldConfig
    localizedUrlFieldConfig: LocalizedUrlFieldConfig
    permalinkFieldConfig: PermalinkFieldConfig
    slugFieldConfig: SlugFieldConfig
    urlFieldConfig: UrlFieldConfig
  }
  locales: string[]
  nestedDocsEnabled: boolean
  permalinkEnabled: boolean
  slugifyOptions: Required<SlugifyOptions>
}
export const createPluginContext = (pluginConfig: NavigationPluginConfig, locales: string[]) => {
  const fields: NavigationPluginConfig['fields'] = pluginConfig.fields || {}

  const slugFieldConfig = createFieldConfig('slug', fields.slug)

  const localizedSlugFieldConfig = createFieldConfig('localizedSlug', fields.localizedSlug, {
    sourceField: slugFieldConfig.fieldName,
  })
  const urlFieldConfig = createFieldConfig('url', fields.url)
  const localizedUrlFieldConfig = createFieldConfig('localizedUrl', fields.localizedUrl, {
    sourceField: urlFieldConfig.fieldName,
  })
  const permalinkFieldConfig = createFieldConfig('permalink', fields.permalink, {
    sourceField: urlFieldConfig.fieldName,
  })

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
      urlFieldConfig,
    },
    locales, // Provided locales
    nestedDocsEnabled: Boolean(pluginConfig.nestedDocsPlugin), // Enable nested docs if provided
    permalinkEnabled: pluginConfig.permalinkEnabled ?? defaultValues.permalinkEnabled, // Default to true if not specified
    slugifyOptions: {
      ...defaultValues.slugifyOptions,
      ...(pluginConfig.slugifyOptions || {}), // Allow overrides
    },
  }
}

type DefaultFieldKeys = keyof typeof defaultValues.fields
const createFieldConfig = <T>(
  fieldKey: DefaultFieldKeys, // Specify the default field key
  config?: Partial<T>,
  injected?: Partial<T>,
): T => {
  const defaultConfig = defaultValues.fields[fieldKey] as T

  if (!defaultConfig) {
    throw new Error(`Invalid field key: ${fieldKey}`)
  }

  return {
    ...defaultConfig, // Use the default configuration for the specified field key
    ...injected, // Apply injected values
    ...config, // Apply user-provided configuration (highest priority)
  }
}
