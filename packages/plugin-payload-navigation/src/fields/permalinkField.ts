import type { Field } from 'payload'

import type { PermalinkFieldConfig } from '../types.js'
import { createPluginField } from '../utils/createPluginField.js'
import { getPluginPath } from '../utils/getPluginPath.js'

export const createPermalinkField = createPluginField<PermalinkFieldConfig, Field>(
  ({ fieldConfig }): Field => {
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
            path: getPluginPath('rsc', '#PermalinkField'),
          },
        },
      },
    }
  },
)
