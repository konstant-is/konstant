import type { Translation } from '@payload-types'
import type { JSX, PropsWithChildren } from 'react'

import config from '@payload-config'
import { getPayload } from 'payload'

import { TranslationProvider } from '../../../translations.js'

type Props = PropsWithChildren<{
  params: Promise<{ locale: string }>
}>

export const fetchTranslationConfig = async (): Promise<Translation> => {
  const payload = await getPayload({ config })

  const res = await payload.findGlobal({
    slug: 'translations',
  })

  return res
}
export default async function Layout(props: Props): Promise<JSX.Element> {
  const params = await props.params
  const config = await fetchTranslationConfig()

  return (
    <html lang="en">
      <head>
        <link href="https://use.typekit.net/aud4zzp.css" rel="stylesheet" />
      </head>
      <body className="body-3">
        <TranslationProvider config={config} locale={params.locale}>
          {props.children}
        </TranslationProvider>
      </body>
    </html>
  )
}
