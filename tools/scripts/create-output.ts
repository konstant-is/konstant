import fs from "fs-extra";
import path from "node:path";

import { getPackages } from "./get-packages.js";
import { ROOT_DIR } from "./utils.js";

const OUTPUT_DIR = path.resolve(ROOT_DIR, "build");

// Ensure a clean build directory
fs.emptyDirSync(OUTPUT_DIR);

const packages = getPackages();

for (const pkg of packages) {
  const distPath = path.join(pkg.path, "dist");
  const publishPackageJson = path.join(pkg.publishPath, "package.json");
  const targetPath = path.join(OUTPUT_DIR, pkg.name);

  if (!fs.existsSync(distPath)) {
    console.warn(`⚠️  No dist folder in ${pkg.name}, skipping`);
    continue;
  }

  if (!fs.existsSync(publishPackageJson)) {
    console.warn(`⚠️  No publish/package.json in ${pkg.name}, skipping`);
    continue;
  }

  fs.ensureDirSync(targetPath);
  fs.copySync(distPath, path.join(targetPath, "dist"));
  fs.copyFileSync(publishPackageJson, path.join(targetPath, "package.json"));

  console.log(`✅ Copied ${pkg.name} to build/${pkg.name}`);
}
