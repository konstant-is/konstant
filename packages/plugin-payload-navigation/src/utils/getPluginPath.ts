import pkg from '../../package.json' with { type: 'json' }

// const PLUGIN_PATH = pkg.name

const PLUGIN_PATH = '@konstant/plugin-payload-navigation'

type PathType = 'client' | 'rsc'

export const getPluginPath = (type: PathType, path: string): string => {
  return `${PLUGIN_PATH}/${type}${path}`
}
