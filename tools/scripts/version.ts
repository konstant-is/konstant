import fs from "fs-extra";
import path from "path";
import semver from "semver";
import { execSync } from "child_process";
import { getPackages } from "./get-packages";

import { absolutePath, ROOT_DIR } from "./utils";

const incrementVersion = (current: string, type: string) =>
  semver.inc(current, type as semver.ReleaseType);

const updatePackageJsonVersion = (version: string, path: string) => {
  const packageJson = fs.readJsonSync(path);
  packageJson.version = version;
  fs.writeJsonSync(path, packageJson, {
    encoding: "utf8",
    EOL: "\n",
    spaces: 2,
  });
};

const updatePackages = (version: string) => {
  const packages = getPackages();

  for (const pkg of packages) {
    try {
      updatePackageJsonVersion(version, path.join(pkg.path, "package.json"));
      updatePackageJsonVersion(
        version,
        path.join(pkg.publishPath, "package.json")
      );

      // Git commit
      // execSync(`git add ${rootPkgPath}`);
      // execSync(`git add ${publishPkgPath}`);
      // execSync(
      //   `git commit -m "chore(${pkg.name}): bump version to ${newVersion}"`
      // );
      console.log(`✅ ${pkg.name} updated to version ${newVersion}`);
    } catch (err: any) {
      console.error(`❌ Failed to update ${pkg.name}: ${err.message}`);
      process.exit(1);
    }
  }
};

// Pass the release type as a command-line argument
const releaseType = process.argv[2];

if (!["patch", "minor", "major"].includes(releaseType)) {
  console.error('Please specify a release type: "patch", "minor", or "major".');
  console.error("Example: node updateVersion.js patch");
  process.exit(1);
}

// Update root package.json version
const rootPackageJsonPath = absolutePath("package.json");
const rootPackageJson = fs.readJsonSync(rootPackageJsonPath);
const newVersion = incrementVersion(rootPackageJson.version, releaseType);
if (!newVersion) throw new Error("Invalid semver bump");
updatePackageJsonVersion(newVersion, rootPackageJsonPath);

updatePackages(newVersion);
