import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import glob from "fast-glob";
import { absolutePath } from "./utils";

const VERSIONS_PATH = absolutePath("versions.json");
const ROOT_DIR = absolutePath();
const PACKAGE_JSON_GLOB = "**/package.json";

// Load central versions
const versions = JSON.parse(fs.readFileSync(VERSIONS_PATH, "utf-8"));

// Flatten all versions into a map
const targetDeps = {
  ...(versions.dependencies || {}),
  ...(versions.devDependencies || {}),
};

// Find all package.json files
const packageJsonPaths = await glob(PACKAGE_JSON_GLOB, {
  cwd: ROOT_DIR,
  ignore: ["**/node_modules/**", "**/dist/**", "**/build/**"],
  absolute: true,
});

// Go through each package.json and update deps
for (const pkgPath of packageJsonPaths) {
  const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));
  let updated = false;

  for (const section of [
    "dependencies",
    "devDependencies",
    "peerDependencies",
  ]) {
    if (!pkg[section]) continue;

    for (const dep in pkg[section]) {
      if (targetDeps[dep] && pkg[section][dep] !== targetDeps[dep]) {
        console.log(
          `🔧 Updating ${dep} in ${path.relative(ROOT_DIR, pkgPath)} → ${targetDeps[dep]}`
        );
        pkg[section][dep] = targetDeps[dep];
        updated = true;
      }
    }
  }

  if (updated) {
    fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n");
  }
}

console.log("✅ Dependency versions synced to versions.json");
