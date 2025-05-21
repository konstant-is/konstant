import type { Field } from 'payload'

import type { CreatePluginField, LocalizedSlugFieldConfig } from '../types.js'

export const createLocalizedSlugsField: CreatePluginField<LocalizedSlugFieldConfig, Field> = ({
  context,
  fieldConfig,
}): Field => ({
  name: fieldConfig.fieldName,
  type: 'group',
  admin: {
    description: 'Automatically generated localized slugs.',
    readOnly: true,
  },
  fields: context.locales.map((locale) => ({
    name: locale,
    type: 'text',
    defaultValue: '',
    localized: false,
    // required: true,
  })),
  localized: false,
})
