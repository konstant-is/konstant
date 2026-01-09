import path from 'node:path'
import fs from 'fs-extra'

import { getPackages } from './get-packages.js'
import {
  assertPackageJson,
  getVersion,
  PackageJson,
  PublishPackageJson,
  resolveWorkspaceDependency,
} from './utils.js'

const validPackages = getPackages()

const createPublishPackage = (source: PackageJson): PublishPackageJson => {
  assertPackageJson(source)

  const resolveDeps = (
    map?: PackageJson['dependencies'],
  ): PackageJson['dependencies'] => {
    if (!map) return {}

    const result: PackageJson['dependencies'] = {}

    for (const [name, version] of Object.entries(map)) {
      if (version.startsWith('workspace:')) {
        console.log(`[${source.name}] Found workspace dependency: ${name}`)
        result[name] = resolveWorkspaceDependency(source.name, source.version)
      } else {
        result[name] = version
      }
    }

    return result
  }

  const { publishConfig } = source

  return {
    ...publishConfig,
    type: 'module',
    version: source.version,
    dependencies: resolveDeps(source.dependencies),
    peerDependencies: resolveDeps(source.peerDependencies),
  }
}

console.log(
  '✅ Found packages:',
  validPackages.map((p) => p.name),
)

for (const p of validPackages) {
  // const ROOT_PKG = path.resolve(p.path, "package.json");
  // const PUBLISH_PKG = path.join(p.publishPath, "package.json");
  const PUBLISH_PATH = path.join(p.publishPath, 'package.json')

  const packageJson = fs.readJsonSync(path.resolve(p.path, 'package.json'), {
    encoding: 'utf-8',
  }) as PackageJson

  // JSON.parse(fs.readFileSync(ROOT_PKG, "utf-8"));
  let publishPkg = fs.readJsonSync(PUBLISH_PATH, {
    encoding: 'utf-8',
  })
  // JSON.parse(fs.readFileSync(PUBLISH_PKG, "utf-8"));

  publishPkg = createPublishPackage(packageJson)
  // publishPkg.peerDependencies = {}
  // publishPkg.dependencies = {}
  // publishPkg.exports = {}

  // if (!packageJson.publishConfig) {
  //   throw Error(`Package ${p.name} has no publish config`)
  // }

  // mergeWithPublishConfig(publishPkg, packageJson.publishConfig)
  // publishPkg.dependencies = packageJson.dependencies
  // publishPkg.peerDependencies = packageJson.peerDependencies

  // for (const dep of Object.keys(publishPkg.dependencies || {})) {
  //   const version = publishPkg.dependencies[dep] as string

  //   if (version.startsWith('workspace:')) {
  //     console.log(`Found workspace dependency: ${dep}`)
  //     publishPkg.dependencies[dep] = workspaceDep(p.name)
  //   }
  // }

  // for (const dep of Object.keys(publishPkg.peerDependencies || {})) {
  //   const version = publishPkg.dependencies[dep] as string

  //   if (version.startsWith('workspace:')) {
  //     console.log(`Found workspace dependency: ${dep}`)
  //     publishPkg.dependencies[dep] = workspaceDep(p.name)
  //   }
  // }

  fs.writeFileSync(PUBLISH_PATH, JSON.stringify(publishPkg, null, 2))
  console.log(`✅  ${p.name} Updated publish/package.json`)
}
