import type { PayloadRequest } from 'payload'

import type { PluginContext } from './createPluginContext.js'

export const generateUrl = (context: PluginContext, data: Partial<any> | undefined) => {
  const { urlFieldConfig } = context.fieldConfigs
  // Generate URL if `generateUrl` function is provided
  const generatedUrl =
    typeof urlFieldConfig.generateUrl === 'function' ? urlFieldConfig.generateUrl(data) : ''

  // Handle nested docs logic
  if (context.nestedDocsEnabled && data) {
    const breadcrumbs = Array.isArray(data.breadcrumbs) ? data.breadcrumbs : []
    const nestedUrl = breadcrumbs.reverse()[0]?.url || ''
    return nestedUrl || generatedUrl
  }

  return generatedUrl
}

export const generateLocalizedUrl = ({
  context,
  data,
  req,
}: {
  context: PluginContext
  data: Partial<any> | undefined
  req: PayloadRequest
}): string => {
  const { locale, payload } = req
  const { defaultLocale = context.fallbackLocale } = payload.config.localization || {}

  const url = generateUrl(context, data)
  switch (context.appendLocaleToUrl) {
    case 'all':
      return `/${locale}${url}`
    case 'exclude-default':
      return locale === defaultLocale ? url : `/${locale}${url}`
    default:
      return url
  }
}
