import type { NextRequest } from 'next/server.js'

import { createLocalizationMiddleware } from 'plugin-payload-translations/rsc'

const localizationMiddleware = createLocalizationMiddleware({
  config: { defaultLocale: 'is', locales: ['is', 'en'] },
  log: false,
})

export const middleware = (req: NextRequest) => {
  return localizationMiddleware(req)
}
