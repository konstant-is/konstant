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

// export const readJson = (p: string) => JSON.parse(fs.readFileSync(p, "utf8"));

export const replaceSrcWithDist = (s: string) =>
  s.replace(/^\.\/src\//, './dist/')

export const createTag = (version: string) => {
  const tagName = `v${version}`
  return tagName
  // Execute Git commands to create and push the tag
}

export const resolveWorkspaceDependency = (
  packageName: string,
  version: string,
) => {
  return `github:konstant-is/konstant#v${version}-${packageName}`
}

type DependencyMap = Record<string, string>
type ExportMap = Record<
  string,
  { import: string; types: string; default: string }
>

export type PublishPackageJson = {
  name: string
  type: string
  version: string
  dependencies?: DependencyMap
  peerDependencies?: DependencyMap
} & PackageJson['publishConfig']

type RequiredPublishConfig = {
  name: string
  main: string
  types: string
  exports: ExportMap
}
export type PackageJson = {
  name: string
  version: string
  main: string
  types: string
  exports: ExportMap
  dependencies?: DependencyMap
  peerDependencies?: DependencyMap
  publishConfig: RequiredPublishConfig
}

export function assertPackageJson(
  pkg: PackageJson,
): asserts pkg is PackageJson & { publishConfig: RequiredPublishConfig } {
  const cfg = pkg.publishConfig

  if (!cfg) {
    throw new Error(`❌ ${pkg.name}: missing publishConfig`)
  }

  const missing: string[] = []

  if (!cfg.name) missing.push('publishConfig.name')
  if (!cfg.main) missing.push('publishConfig.main')
  if (!cfg.types) missing.push('publishConfig.types')
  if (!cfg.exports) missing.push('publishConfig.exports')

  if (missing.length > 0) {
    throw new Error(
      `❌ ${pkg.name}: missing required publish fields:\n` +
        missing.map((m) => `  - ${m}`).join('\n'),
    )
  }
}
