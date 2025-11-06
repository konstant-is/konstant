import { Field } from 'payload'
import type { LocalizedSlugFieldConfig } from '../types.js'
import { createPluginField } from '../utils/createPluginField.js'

export const createLocalizedSlugsField = createPluginField<LocalizedSlugFieldConfig, Field>(
  ({ context, fieldConfig }) => ({
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
    })),
    localized: false,
  }),
)
