import fs from "fs";
import path from "path";
import glob from "fast-glob";
import { absolutePath } from "./utils";

// Paths
const VERSIONS_PATH = absolutePath("versions.json");
const ROOT_DIR = absolutePath();
const PACKAGE_JSON_GLOB = "**/package.json";

// Load central versions
const versions = JSON.parse(fs.readFileSync(VERSIONS_PATH, "utf-8"));

// Merge deps
const targetDeps:Record<string, string> = {
  ...(versions.dependencies || {}),
  ...(versions.devDependencies || {}),
};

// Split exact + wildcard deps
const exactDeps: Record<string, string> = {};
const wildcardDeps: Array<{ prefix: string; version: string }> = [];

for (const [name, version] of Object.entries(targetDeps)) {
  if (name.endsWith("/*")) {
    wildcardDeps.push({
      prefix: name.replace("/*", "/"),
      version,
    });
  } else {
    exactDeps[name] = version;
  }
}

// Find all package.json files
const packageJsonPaths = await glob(PACKAGE_JSON_GLOB, {
  cwd: ROOT_DIR,
  ignore: ["**/node_modules/**", "**/dist/**", "**/build/**"],
  absolute: true,
});

// Track changes
type Change = {
  dep: string;
  from: string;
  to: string;
};

const changesByFile = new Map<string, Change[]>();

// Update deps
for (const pkgPath of packageJsonPaths) {
  const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));
  let fileChanges: Change[] = [];

  for (const section of [
    "dependencies",
    "devDependencies",
    "peerDependencies",
  ]) {
    if (!pkg[section]) continue;

    for (const dep in pkg[section]) {
      let targetVersion = exactDeps[dep];

      if (!targetVersion) {
        const wildcard = wildcardDeps.find(w => dep.startsWith(w.prefix));
        if (wildcard) {
          targetVersion = wildcard.version;
        }
      }

      if (targetVersion && pkg[section][dep] !== targetVersion) {
        fileChanges.push({
          dep,
          from: pkg[section][dep],
          to: targetVersion,
        });

        pkg[section][dep] = targetVersion;
      }
    }
  }

  if (fileChanges.length > 0) {
    fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n");
    changesByFile.set(pkgPath, fileChanges);
  }
}

// Logging
if (changesByFile.size === 0) {
  console.log("✅ All dependencies already match versions.json");
  process.exit(0);
}

console.log("\n🔧 Dependency updates:\n");

for (const [pkgPath, changes] of changesByFile) {
  console.log(`📦 ${path.relative(ROOT_DIR, pkgPath)}`);
  for (const { dep, from, to } of changes) {
    console.log(`  • ${dep}: ${from} → ${to}`);
  }
  console.log("");
}

console.log(
  `✅ Updated ${changesByFile.size} package.json file${
    changesByFile.size > 1 ? "s" : ""
  }`
);
// import fs from "fs";
// import path from "path";
// import glob from "fast-glob";
// import { absolutePath } from "./utils";

// // Paths
// const VERSIONS_PATH = absolutePath("versions.json");
// const ROOT_DIR = absolutePath();
// const PACKAGE_JSON_GLOB = "**/package.json";

// // Load central versions
// const versions = JSON.parse(fs.readFileSync(VERSIONS_PATH, "utf-8"));

// // Merge deps
// const targetDeps = {
//   ...(versions.dependencies || {}),
//   ...(versions.devDependencies || {}),
// };

// // Split exact + wildcard deps
// const exactDeps: Record<string, string> = {};
// const wildcardDeps: Array<{ prefix: string; version: string }> = [];

// for (const [name, version] of Object.entries(targetDeps)) {
//   if (name.endsWith("/*")) {
//     wildcardDeps.push({
//       prefix: name.replace("/*", "/"),
//       version,
//     });
//   } else {
//     exactDeps[name] = version;
//   }
// }

// // Find all package.json files
// const packageJsonPaths = await glob(PACKAGE_JSON_GLOB, {
//   cwd: ROOT_DIR,
//   ignore: ["**/node_modules/**", "**/dist/**", "**/build/**"],
//   absolute: true,
// });

// // Update deps
// for (const pkgPath of packageJsonPaths) {
//   const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));
//   let updated = false;

//   for (const section of [
//     "dependencies",
//     "devDependencies",
//     "peerDependencies",
//   ]) {
//     if (!pkg[section]) continue;

//     for (const dep in pkg[section]) {
//       let targetVersion = exactDeps[dep];

//       if (!targetVersion) {
//         const wildcard = wildcardDeps.find(w => dep.startsWith(w.prefix));
//         if (wildcard) {
//           targetVersion = wildcard.version;
//         }
//       }

//       if (targetVersion && pkg[section][dep] !== targetVersion) {
//         console.log(
//           `🔧 Updating ${dep} in ${path.relative(ROOT_DIR, pkgPath)} → ${targetVersion}`
//         );
//         pkg[section][dep] = targetVersion;
//         updated = true;
//       }
//     }
//   }

//   if (updated) {
//     fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n");
//   }
// }

// console.log("✅ Dependency versions synced to versions.json");

