'use client'
import type { DefaultCellComponentProps } from 'payload'

type Breadcrumb = {
  doc: string
  id: string
  label?: string
  url: string
}
export const UrlCell: React.FC<DefaultCellComponentProps> = (props) => {
  const { collectionSlug, rowData } = props
  const breadcrumbs = ((rowData.breadcrumbs as Partial<Breadcrumb>[]) || [])
    .filter((c) => Boolean(c.id && c.doc))
    .map((c) => c as Breadcrumb)
    .reverse()

  return (
    <div>
      {breadcrumbs.map((b, index) => {
        const label = b.url.split('/').reverse()[0] || '<No Label>'
        const href = `/admin/collections/${collectionSlug}/${b.doc}`

        return (
          <span key={index}>
            <a href={href}>{label}</a>
            {index < breadcrumbs.length - 1 && <span> / </span>}
          </span>
        )
      })}
    </div>
  )
}
