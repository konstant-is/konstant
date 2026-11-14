import { spawnSync } from 'node:child_process'
import { appendFileSync, cpSync, existsSync, mkdtempSync, readdirSync, readFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'

import { ROOT_DIR } from './utils.js'

const dryRun = process.env.DRY_RUN !== 'false'

function git(args: string[], cwd = ROOT_DIR) {
  const result = spawnSync('git', args, { cwd, encoding: 'utf8' })
  if (result.error) throw result.error
  if (result.status !== 0) {
    throw new Error(`git ${args[0]} failed: ${result.stderr}`)
  }
  return result.stdout.trim()
}

function summary(message: string) {
  console.log(message)
  if (process.env.GITHUB_STEP_SUMMARY) {
    appendFileSync(process.env.GITHUB_STEP_SUMMARY, `${message}\n`)
  }
}

function releasePackages() {
  const packagesDir = path.join(ROOT_DIR, 'packages')
  const outputs = readdirSync(packagesDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => path.join(packagesDir, entry.name, 'build'))
    .filter((output) => existsSync(path.join(output, 'package.json')))

  if (!outputs.length) throw new Error('No release packages found in packages/*/build/.')

  const branches = new Set<string>()
  const releases = outputs.map((output) => {
    const manifest = JSON.parse(readFileSync(path.join(output, 'package.json'), 'utf8'))
    const { name, version } = manifest
    if (typeof name !== 'string' || !/^@konstant\/[a-z0-9][a-z0-9._-]*$/.test(name)) {
      throw new Error(`Unsupported release package name: ${name}`)
    }
    if (typeof version !== 'string' || !version.length) {
      throw new Error(`Missing version for ${name}`)
    }
    if (!existsSync(path.join(output, 'dist'))) throw new Error(`Missing dist in ${output}`)

    for (const field of ['dependencies', 'peerDependencies', 'optionalDependencies']) {
      for (const [dependency, spec] of Object.entries(manifest[field] ?? {})) {
        if (typeof spec !== 'string' || /^(catalog:|workspace:)/.test(spec)) {
          throw new Error(`Unresolved ${field} entry for ${dependency} in ${name}`)
        }
      }
    }

    const branch = `v${version}-${name.slice('@konstant/'.length)}`
    git(['check-ref-format', `refs/heads/${branch}`])
    if (branches.has(branch)) throw new Error(`Duplicate release branch: ${branch}`)
    branches.add(branch)
    const existing = git(['ls-remote', '--heads', 'origin', `refs/heads/${branch}`])
    if (existing) {
      if (!dryRun) throw new Error(`Release branch already exists: ${branch}`)
      summary(`Existing release branch: ${branch}. A real release requires a new version.`)
    }
    return { output, name, version, branch }
  })

  const refs: string[] = []
  for (const { output, name, version, branch } of releases) {
    const worktree = mkdtempSync(path.join(process.env.RUNNER_TEMP ?? tmpdir(), 'release-v2.'))
    let added = false
    try {
      git(['worktree', 'add', '--detach', worktree, 'HEAD'])
      added = true
      git(['checkout', '--orphan', branch], worktree)
      git(['rm', '-rf', '--quiet', '.'], worktree)
      cpSync(output, worktree, {
        recursive: true,
        filter: (source) => path.basename(source) !== '.git',
      })
      git(['add', '--all', '--force'], worktree)
      git([
        '-c', 'user.name=github-actions[bot]',
        '-c', 'user.email=github-actions[bot]@users.noreply.github.com',
        'commit', '-m', `chore: release ${name}@${version}`,
      ], worktree)
      refs.push(`refs/heads/${branch}:refs/heads/${branch}`)
      console.log(`Prepared: ${branch}`)
    } finally {
      if (added) git(['worktree', 'remove', '--force', worktree])
      else rmSync(worktree, { recursive: true, force: true })
    }
  }

  if (dryRun) {
    summary('### Dry run successful\nBuilt and validated release packages. No branches were pushed.')
  } else {
    git(['push', '--atomic', 'origin', ...refs])
    summary(`Released ${refs.length} package(s).`)
  }
}

try {
  releasePackages()
} catch (error) {
  console.error(error instanceof Error ? error.message : error)
  process.exitCode = 1
}
