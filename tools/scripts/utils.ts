import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs-extra'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export const ROOT_DIR = path.resolve(__dirname, '../../')

export const getVersion = () => {
  const version = fs.readJsonSync(
    path.resolve(ROOT_DIR, 'package.json'),
  ).version

  if (!version) {
    throw new Error(
      'Version not found in package.json. Please ensure the version is set.',
    )
  }
  return version
}

export const absolutePath = (...segments: string[]) =>
  path.resolve(ROOT_DIR, ...segments)

export const createTag = (version: string) => {
  const tagName = `v${version}`
  return tagName
  // Execute Git commands to create and push the tag
}

export const resolveWorkspaceDependency = (
  packageName: string,
  version: string,
) => {
  return `github:konstant-is/konstant#v${version}-${packageName.replace('@konstant/', '')}`
}
