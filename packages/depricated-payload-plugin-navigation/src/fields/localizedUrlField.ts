import type { Field } from 'payload'

import type { CreatePluginField, LocalizedUrlFieldConfig } from '../types.js'

export const createLocalizedUrlField: CreatePluginField<LocalizedUrlFieldConfig, Field> = ({
  context,
  fieldConfig,
}) => {
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
}
