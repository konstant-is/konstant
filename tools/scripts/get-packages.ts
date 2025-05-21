import fs from "fs";
import path from "node:path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PACKAGES_DIR = path.resolve(__dirname, "../../packages");
console.log(PACKAGES_DIR);
// Get all valid packages with dep.config + publish/
export const getPackages = () => {
  const dirs = fs.readdirSync(PACKAGES_DIR);

  return dirs
    .map((dir) => {
      const fullPath = path.join(PACKAGES_DIR, dir);
      const stat = fs.statSync(fullPath);
      if (!stat.isDirectory()) return null;

      const jsConfigPath = path.join(fullPath, "dep.config.js");
      const tsConfigPath = path.join(fullPath, "dep.config.ts");

      const depConfigPath = fs.existsSync(jsConfigPath)
        ? jsConfigPath
        : fs.existsSync(tsConfigPath)
          ? tsConfigPath
          : null;

      const publishFolderExists = fs.existsSync(path.join(fullPath, "publish"));

      if (depConfigPath && publishFolderExists) {
        return {
          name: dir,
          path: fullPath,
          depConfig: depConfigPath,
          publishPath: path.join(fullPath, "publish"),
        };
      }

      return null;
    })
    .filter((p): p is NonNullable<typeof p> => Boolean(p));
};
