import fs from "fs-extra";
import path from "node:path";
import { getPackages } from "./get-packages.js";
import { rewriteExportsToDist } from "./utils.js";

const validPackages = getPackages();

console.log(
  "✅ Found packages:",
  validPackages.map((p) => p.name)
);

for (const p of validPackages) {
  // const ROOT_PKG = path.resolve(p.path, "package.json");
  // const PUBLISH_PKG = path.join(p.publishPath, "package.json");
  const PUBLISH_PATH = path.join(p.publishPath, "package.json");

  const packageJson = fs.readJsonSync(path.resolve(p.path, "package.json"), {
    encoding: "utf-8",
  });
  // JSON.parse(fs.readFileSync(ROOT_PKG, "utf-8"));
  const publishPkg = fs.readJsonSync(PUBLISH_PATH, {
    encoding: "utf-8",
  });
  // JSON.parse(fs.readFileSync(PUBLISH_PKG, "utf-8"));

  publishPkg.peerDependencies = {};
  publishPkg.dependencies = {};
  publishPkg.exports = {};

  if (packageJson.exports) {
    publishPkg.exports = rewriteExportsToDist(packageJson.exports);
  }

  publishPkg.main = packageJson.main
    ?.replace(/^\.\/src\//, "./dist/")
    .replace(/\.ts$/, ".js");
  publishPkg.types = packageJson.types
    ?.replace(/^\.\/src\//, "./dist/")
    .replace(/\.ts$/, ".d.ts");

  const { default: depConfig } = await import(p.depConfig);

  for (const dep of depConfig.peer || []) {
    const version =
      packageJson.dependencies?.[dep] || packageJson.devDependencies?.[dep];
    if (version) {
      publishPkg.peerDependencies[dep] = version;
    }
  }

  for (const dep of depConfig.runtime || []) {
    const version = packageJson.dependencies?.[dep];
    if (version) {
      publishPkg.dependencies[dep] = version;
    }
  }

  fs.writeFileSync(PUBLISH_PATH, JSON.stringify(publishPkg, null, 2));
  console.log(`✅  ${p.name} Updated publish/package.json`);
}
