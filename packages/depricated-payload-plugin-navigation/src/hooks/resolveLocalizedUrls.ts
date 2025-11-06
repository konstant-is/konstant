import type { CollectionBeforeChangeHook } from 'payload'

import type { PluginContext } from '../utils/createPluginContext.js'

export const resolveLocalizedUrl =
  (context: PluginContext): CollectionBeforeChangeHook =>
  ({ data, operation, req }) => {
    const { locale, payload } = req
    const { defaultLocale = context.fallbackLocale } = payload.config.localization || {}
    const currentLocale = locale || defaultLocale
    const { localizedUrlFieldConfig } = context.fieldConfigs
    if (operation === 'create') {
      return data
    }

    const sourceField = localizedUrlFieldConfig.sourceField
      ? data[localizedUrlFieldConfig.sourceField]
      : undefined

    if (!sourceField) {
      payload.logger.error(
        `Error: Missing source field "${localizedUrlFieldConfig.sourceField}" while resolving localized url.`,
      )

      return data
    }

    const field = data[localizedUrlFieldConfig.fieldName] || {}
    if (typeof field !== 'object') {
      payload.logger.error(
        `Error: Localized url field "${localizedUrlFieldConfig.fieldName}" is not an object.`,
      )
      return data
    }

    const updated = {
      ...field,
      [currentLocale]: sourceField,
    }

    return {
      ...data,
      [localizedUrlFieldConfig.fieldName]: updated,
    }
  }
