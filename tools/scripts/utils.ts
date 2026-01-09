import { fileURLToPath } from "url";
import path from "path";
import fs from "fs-extra";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const ROOT_DIR = path.resolve(__dirname, "../../");

export const getVersion = () => {
  const version = fs.readJsonSync(
    path.resolve(ROOT_DIR, "package.json")
  ).version;

  if (!version) {
    throw new Error(
      "Version not found in package.json. Please ensure the version is set."
    );
  }
  return version;
};

export const absolutePath = (...segments: string[]) =>
  path.resolve(ROOT_DIR, ...segments);

// export const readJson = (p: string) => JSON.parse(fs.readFileSync(p, "utf8"));

export const replaceSrcWithDist = (s: string) =>
  s.replace(/^\.\/src\//, "./dist/");

export const rewriteExportsToDist = (exportsObj: Record<string, any>) => {
  const updated: Record<string, any> = {};

  for (const [key, value] of Object.entries(exportsObj)) {
    const updatedEntry: Record<string, string> = {};
    for (const [subKey, path] of Object.entries(value)) {
      updatedEntry[subKey] = replaceSrcWithDist(path as string).replace(
        /\.ts$/,
        ".js"
      );
      if (subKey === "types") {
        updatedEntry["types"] = replaceSrcWithDist(path as string).replace(
          /\.ts$/,
          ".d.ts"
        );
      }
    }
    updated[key] = updatedEntry;
  }

  return updated;
};

export const createTag = (version: string) => {
  const tagName = `v${version}`;
  return tagName;
  // Execute Git commands to create and push the tag
};


export const workspaceDep = (packageName: string) => {
  const currentVersion = getVersion()
  
  return `github:konstant-is/konstant#v${currentVersion}-${packageName}`
}