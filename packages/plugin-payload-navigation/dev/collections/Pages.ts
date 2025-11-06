import { CollectionConfig } from 'payload'

export const Pages: CollectionConfig = {
  slug: 'pages',

  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'url'],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'text',
      type: 'textarea',
      label: 'Update this to force draft',
    },
  ],
  versions: {
    drafts: {
      autosave: true,
    },
  },
}
