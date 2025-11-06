import { Field } from 'payload'
import type { LocalizedUrlFieldConfig } from '../types.js'
import { createPluginField } from '../utils/createPluginField.js'

export const createLocalizedUrlField = createPluginField<LocalizedUrlFieldConfig, Field>(
  ({ context, fieldConfig }) => {
    return {
      name: fieldConfig.fieldName,
      type: 'group',
      admin: {
        description: 'Automatically generated localized urls.',
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
    }
  },
)
