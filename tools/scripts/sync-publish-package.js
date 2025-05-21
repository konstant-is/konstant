import fs from "fs";
import path from "node:path";
import { getPackages } from "./get-packages.js";

const validPackages = getPackages();

console.log(
  "✅ Found packages:",
  validPackages.map((p) => p.name)
);

for (const pkg of validPackages) {
  const ROOT_PKG = path.resolve(pkg.path, "package.json");
  const PUBLISH_PKG = path.join(pkg.publishPath, "package.json");

  const rootPkg = JSON.parse(fs.readFileSync(ROOT_PKG, "utf-8"));
  const publishPkg = JSON.parse(fs.readFileSync(PUBLISH_PKG, "utf-8"));

  publishPkg.peerDependencies = {};
  publishPkg.dependencies = {};

  const { default: depConfig } = await import(pkg.depConfig);

  for (const dep of depConfig.peer || []) {
    const version =
      rootPkg.dependencies?.[dep] || rootPkg.devDependencies?.[dep];
    if (version) {
      publishPkg.peerDependencies[dep] = version;
    }
  }

  for (const dep of depConfig.runtime || []) {
    const version = rootPkg.dependencies?.[dep];
    if (version) {
      publishPkg.dependencies[dep] = version;
    }
  }

  fs.writeFileSync(PUBLISH_PKG, JSON.stringify(publishPkg, null, 2));
  console.log(`✅  ${pkg.name} Updated publish/package.json`);
}
