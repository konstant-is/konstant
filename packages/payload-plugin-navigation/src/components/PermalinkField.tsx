import type { ServerComponentProps, UIFieldClientProps } from 'payload'

import { getServerSideURL } from '../utils/getUrl.js'
import { PermalinkFieldClient } from './PermalinkFieldClient.js'

type Props = {
  custom: {
    sourceField: string
  }
} & ServerComponentProps &
  UIFieldClientProps

export const PermalinkField: React.FC<Props> = (props) => {
  const serverURL = getServerSideURL()
  return (
    <PermalinkFieldClient
      custom={{
        ...props.custom,
        serverURL,
      }}
      field={props.field}
      path={props.path}
    />
  )
}
