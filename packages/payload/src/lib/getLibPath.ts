const PLUGIN_PATH = "@konstant/payload";

type PathType = "client" | "rsc";

export const getLibPath = (type: PathType, path: string): string => {
  return `${PLUGIN_PATH}/${type}${path}`;
};
