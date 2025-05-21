const PLUGIN_PATH = '@konstant/payload-plugin-navigation'

type PathType = 'client' | 'rsc'

export const getPluginPath = (type: PathType, path: string): string => {
  return `${PLUGIN_PATH}/${type}${path}`
}
