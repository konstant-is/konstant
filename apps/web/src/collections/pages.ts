import { CollectionConfig } from 'payload'
import { slugField } from '@konstant/payload'

export const Pages: CollectionConfig = {
  slug: 'pages',
  fields: [
    { name: 'title', type: 'text', required: true },
    ...slugField({
      useFields: ['title'],
    }),
  ],
}
