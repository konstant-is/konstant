import type { JSX } from 'react'

import { PageClient } from './_page.client.js'

type Props = {
  params: Promise<{ locale: string }>
}
async function Page(props: Props): Promise<JSX.Element> {
  const params = await props.params
  return (
    <div>
      <h3>Server</h3>
      <div>current locale: {params.locale}</div>

      <PageClient />
    </div>
  )
}

export default Page
