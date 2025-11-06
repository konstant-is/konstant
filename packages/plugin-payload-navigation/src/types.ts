import type { NestedDocsPluginConfig } from '@payloadcms/plugin-nested-docs/types'
import type { CollectionSlug } from 'payload'

export type AppendLocaleToUrlOptions = 'all' | 'exclude-default' | 'none'
export type NavigationPluginConfig = {
  appendLocaleToUrl?: AppendLocaleToUrlOptions
  /**
   * Collections this plugin should extend. If you need different configs for different collections, this plugin can be added to your config more than once with different collections.
   */
  collections: CollectionSlug[]
  disabled?: boolean
  fallbackLocale?: string
  /**
   * Configuration for slug and URL fields.
   */
  fields?: {
    localizedSlug?: Partial<LocalizedSlugFieldConfig>
    localizedUrl?: Partial<LocalizedUrlFieldConfig>
    permalink?: Partial<PermalinkFieldConfig>
    slug?: Partial<SlugFieldConfig>
    url?: Partial<UrlFieldConfig>
  }
  /**
   * Configuration for nested document support.
   */
  nestedDocsPlugin?: Omit<NestedDocsPluginConfig, 'collections'>
  permalinkEnabled?: boolean
  slugifyOptions?: SlugifyOptions
}

// Base configuration type for fields
type BaseFieldConfig = {
  fieldName: string // Name of the field
  sourceField?: string // Optional source field for some configurations
}

// Provides additional options for the slugify function
export type SlugifyOptions = {
  locale?: string
  lower?: boolean
  remove?: RegExp
  replacement?: string
  strict?: boolean
  trim?: boolean
}

// Configuration for localized slug fields
export type LocalizedSlugFieldConfig = BaseFieldConfig

// Configuration for localized URL fields
export type LocalizedUrlFieldConfig = BaseFieldConfig

// Configuration for regular slug fields
export type SlugFieldConfig = {
  autoIncrementSlug?: boolean
  lockFieldName: string // Field to store the lock status
  useFields: string[] // Fields to generate the slug from
} & BaseFieldConfig

// Type for a function that generates URLs
type GenerateURL = (data: Record<string, unknown> | undefined) => string

// Configuration for URL fields
export type UrlFieldConfig = {
  generateUrl?: GenerateURL // Optional function to generate the URL
} & Omit<BaseFieldConfig, 'sourceField'>

// Configuration for permalink fields
export type PermalinkFieldConfig = BaseFieldConfig
