import path from 'node:path'
import fs from 'fs-extra'
import semver from 'semver'
import { parse } from 'yaml'

import { ROOT_DIR } from './utils.js'

type Dependencies = Record<string, string>

type WorkspaceConfig = {
  catalog?: Dependencies
  catalogs?: Record<string, Dependencies>
}

const packageDir = process.cwd()
const source = await fs.readJson(path.join(packageDir, 'package.json'))
const root = await fs.readJson(path.join(ROOT_DIR, 'package.json'))
const releaseVersion = semver.valid(root.version)
if (!releaseVersion) throw new Error('Root package.json must contain a valid release version')

const workspace = parse(
  await fs.readFile(path.join(ROOT_DIR, 'pnpm-workspace.yaml'), 'utf8'),
) as WorkspaceConfig

console.log('Build package')
console.log(packageDir)

function resolveDependencies(
  dependencies?: Dependencies,
): Dependencies | undefined {
  if (!dependencies) return undefined

  return Object.fromEntries(
    Object.entries(dependencies).map(([name, spec]) => {
      if (spec.startsWith('catalog:')) {
        const catalogName = spec.slice('catalog:'.length)
        const catalog = catalogName
          ? workspace.catalogs?.[catalogName]
          : workspace.catalog

        const version = catalog?.[name]

        if (!version) {
          throw new Error(`Missing catalog entry for ${name}: ${spec}`)
        }

        spec = version
      }

      if (spec.startsWith('workspace:')) {
        throw new Error(
          `${name}: workspace dependencies need a release reference`,
        )
      }

      return [name, spec]
    }),
  )
}

const manifest = {
  name: source.name,
  type: source.type,
  description: source.description,
  license: source.license,
  repository: source.repository,
  exports: source.exports,
  main: source.main,
  types: source.types,
  ...source.publishConfig,
  version: releaseVersion,
  dependencies: resolveDependencies(source.dependencies),
  peerDependencies: resolveDependencies(source.peerDependencies),
  optionalDependencies: resolveDependencies(source.optionalDependencies),
}

const distDir = path.join(packageDir, 'dist')
const buildDir = path.join(packageDir, 'build')

if (!(await fs.pathExists(distDir))) {
  throw new Error('Missing dist directory. Run tsdown first.')
}

await fs.emptyDir(buildDir)
await fs.copy(distDir, path.join(buildDir, 'dist'))
await fs.writeJson(path.join(buildDir, 'package.json'), manifest, {
  spaces: 2,
})

console.log(`Built release package: ${manifest.name}@${manifest.version}`)
