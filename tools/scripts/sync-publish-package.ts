import path from 'node:path'
import fs from 'fs-extra'

import { getPackages } from './get-packages.js'
import { rewriteExportsToDist, workspaceDep } from './utils.js'

const validPackages = getPackages()

type PackageJson = {
  name: string
  version?: string
  main?: string
  types?: string
  exports: Record<string, any>
  dependencies?: Record<string, string>
  devDependencies?: Record<string, string>
  peerDependencies?: Record<string, string>
  publishConfig?: {
    exports: any
    main: string
    types: string
    [k: string]: any
  }
}

console.log(
  '✅ Found packages:',
  validPackages.map((p) => p.name),
)

const mergeWithPublishConfig = (
  p: PackageJson,
  config: NonNullable<PackageJson['publishConfig']>,
) => {
  p.exports = config.exports ?? {}
  p.main = config.main
  p.types = config.types
}

for (const p of validPackages) {
  // const ROOT_PKG = path.resolve(p.path, "package.json");
  // const PUBLISH_PKG = path.join(p.publishPath, "package.json");
  const PUBLISH_PATH = path.join(p.publishPath, 'package.json')

  const packageJson = fs.readJsonSync(path.resolve(p.path, 'package.json'), {
    encoding: 'utf-8',
  }) as PackageJson

  // JSON.parse(fs.readFileSync(ROOT_PKG, "utf-8"));
  const publishPkg = fs.readJsonSync(PUBLISH_PATH, {
    encoding: 'utf-8',
  })
  // JSON.parse(fs.readFileSync(PUBLISH_PKG, "utf-8"));

  publishPkg.peerDependencies = {}
  publishPkg.dependencies = {}
  publishPkg.exports = {}

  if (!packageJson.publishConfig) {
    throw Error(`Package ${p.name} has no publish config`)
  }

  mergeWithPublishConfig(publishPkg, packageJson.publishConfig)
  publishPkg.dependencies = packageJson.dependencies
  publishPkg.peerDependencies = packageJson.peerDependencies

  // else {
  //   publishPkg.exports = rewriteExportsToDist(packageJson.exports) ?? {}
  //   publishPkg.main = packageJson.main
  //     ?.replace(/^\.\/src\//, './dist/')
  //     .replace(/\.ts$/, '.js')
  //   publishPkg.types = packageJson.types
  //     ?.replace(/^\.\/src\//, './dist/')
  //     .replace(/\.ts$/, '.d.ts')

  //   const { default: depConfig } = await import(p.depConfig)

  //   for (const dep of depConfig.peer || []) {
  //     const version =
  //       packageJson.dependencies?.[dep] || packageJson.devDependencies?.[dep]
  //     if (version) {
  //       publishPkg.peerDependencies[dep] = version
  //     }
  //   }

  //   for (const dep of depConfig.runtime || []) {
  //     const version = packageJson.dependencies?.[dep]
  //     if (version) {
  //       publishPkg.dependencies[dep] = version
  //     }
  //   }
  // }

  for (const dep of Object.keys(publishPkg.dependencies || {})) {
    const version = publishPkg.dependencies[dep] as string

    if (version.startsWith('workspace:')) {
      console.log(`Found workspace dependency: ${dep}`)
      publishPkg.dependencies[dep] = workspaceDep(p.name)
    }
  }

  fs.writeFileSync(PUBLISH_PATH, JSON.stringify(publishPkg, null, 2))
  console.log(`✅  ${p.name} Updated publish/package.json`)
}
