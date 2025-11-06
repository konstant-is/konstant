import type { Field, FieldHook } from 'payload'

import type { UrlFieldConfig } from '../types.js'
import type { PluginContext } from '../utils/createPluginContext.js'
import { createPluginField } from '../utils/createPluginField.js'
import { generateUrl } from '../utils/generateUrl.js'
import { getPluginPath } from '../utils/getPluginPath.js'

const validateUrlField =
  (context: PluginContext): FieldHook =>
  ({ data }) => {
    const url = generateUrl(context, data)

    return url
  }

export const createUrlField = createPluginField<UrlFieldConfig, Field>(
  ({ context, fieldConfig }) => {
    return {
      name: fieldConfig.fieldName,
      type: 'text',
      admin: {
        components: {
          Cell: getPluginPath('client', '#UrlCell'),
        },
        description: 'Automatically generated url',
        position: 'sidebar',
        readOnly: true,
      },
      defaultValue: '',
      hooks: {
        beforeValidate: [validateUrlField(context)],
      },
      index: false, // Not indexed by default
      localized: true, // Supports localization
      required: true,
    }
  },
)
