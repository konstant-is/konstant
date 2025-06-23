import { rmSync } from "node:fs";
import { execSync } from "node:child_process";
import { join, resolve } from "node:path";
import glob from "fast-glob";

const root = process.cwd();

console.log("🚮 Deleting all node_modules...");

const nodeModules = glob.sync(["**/node_modules"], {
  ignore: ["**/node_modules/**/node_modules"], // nested node_modules inside node_modules
  onlyDirectories: true,
});

nodeModules.forEach((dir) => {
  const fullPath = resolve(root, dir);
  console.log(`Removing ${fullPath}`);
  rmSync(fullPath, { recursive: true, force: true });
});

console.log("🚮 Deleting all pnpm-lock.json files...");

const lockJsons = glob.sync(["**/pnpm-lock.json"], {
  ignore: ["node_modules/**"], // skip any in node_modules just in case
});

lockJsons.forEach((file) => {
  const fullPath = resolve(root, file);
  console.log(`Removing ${fullPath}`);
  rmSync(fullPath);
});

console.log("📦 Running pnpm install...");
execSync("pnpm install", { stdio: "inherit" });

console.log("✅ Done!");
