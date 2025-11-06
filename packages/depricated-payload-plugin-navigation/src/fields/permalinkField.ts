import type { Field } from 'payload'

import type { CreatePluginField, PermalinkFieldConfig } from '../types.js'

import { getPluginPath } from '../utils/getPluginPath.js'

export const createPermalinkField: CreatePluginField<PermalinkFieldConfig, Field> = ({
  fieldConfig,
}): Field => {
  return {
    name: fieldConfig.fieldName,
    type: 'ui',
    admin: {
      components: {
        Field: {
          clientProps: {
            custom: {
              sourceField: fieldConfig.sourceField,
            },
          },
          path: getPluginPath('client', '#PermalinkField'),
        },
      },
    },
  }
}
