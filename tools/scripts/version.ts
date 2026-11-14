import fs from 'fs-extra'
import semver from 'semver'

import { absolutePath } from './utils.js'

const releaseType = process.argv[2]
if (!['patch', 'minor', 'major'].includes(releaseType)) {
  console.error('Please specify a release type: "patch", "minor", or "major".')
  process.exit(1)
}

// Source packages use 0.0.0; their builds inherit this root release version.
const rootPath = absolutePath('package.json')
const root = fs.readJsonSync(rootPath)
const version = semver.inc(root.version, releaseType as semver.ReleaseType)
if (!version) throw new Error('Invalid root version')
root.version = version
fs.writeJsonSync(rootPath, root, { spaces: 2, EOL: '\n' })
console.log(`Release version updated to ${version}. Rebuild packages to generate release manifests.`)
