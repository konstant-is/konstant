import { mongooseAdapter } from '@payloadcms/db-mongodb'

import { MongoMemoryReplSet } from 'mongodb-memory-server'
import path from 'path'
import { buildConfig } from 'payload'
import { navigationPlugin } from 'plugin-payload-navigation'
import sharp from 'sharp'
import { fileURLToPath } from 'url'

import { testEmailAdapter } from './helpers/testEmailAdapter.js'
import { seed } from './seed.js'
import { Pages } from './collections/Pages.js'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

if (!process.env.ROOT_DIR) {
  process.env.ROOT_DIR = dirname
}

const buildConfigWithMemoryDB = async () => {
  if (process.env.NODE_ENV === 'test') {
    const memoryDB = await MongoMemoryReplSet.create({
      replSet: {
        count: 3,
        dbName: 'payloadmemory',
      },
    })

    process.env.DATABASE_URI = `${memoryDB.getUri()}&retryWrites=true`
  }

  return buildConfig({
    admin: {
      importMap: {
        baseDir: path.resolve(dirname),
      },
    },
    collections: [Pages],
    db: mongooseAdapter({
      ensureIndexes: true,
      url: process.env.DATABASE_URI || '',
    }),
    email: testEmailAdapter,
    onInit: async (payload) => {
      await seed(payload)
    },
    plugins: [
      navigationPlugin({
        collections: ['pages'],
        fields: {
          slug: {
            autoIncrementSlug: true,
          },
        },
        nestedDocsPlugin: {
          generateLabel: (_, doc) => doc.title as string,
          generateURL: (docs) => {
            return docs.reduce((url, doc) => {
              return `${url}/${doc.slug}`
            }, '')
          },
        },
      }),
    ],
    secret: process.env.PAYLOAD_SECRET || 'test-secret_key',
    // sharp,
    typescript: {
      outputFile: path.resolve(dirname, 'payload-types.ts'),
    },
    localization: {
      locales: ['is', 'en'],
      defaultLocale: 'is',
      fallback: true,
    },
  })
}

export default buildConfigWithMemoryDB()
