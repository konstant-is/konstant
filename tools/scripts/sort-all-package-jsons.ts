import fs from "fs";
import path from "path";
import glob from "fast-glob";
import sortPackageJson from "sort-package-json";
import { ROOT_DIR } from "./utils";

const run = async () => {
  // Patterns for all package.json locations
  const patterns = [
    "package.json", // root
    "packages/*/package.json",
    "packages/*/*/package.json",
    "apps/*/package.json",
    "apps/*/*/package.json",
  ];

  const files = await glob(patterns, {
    cwd: ROOT_DIR,
    absolute: true,
    ignore: ["**/node_modules/**"],
  });

  if (files.length === 0) {
    console.warn(
      "⚠️ No package.json files found. Check your paths or folder structure."
    );
    return;
  }

  for (const file of files) {
    const original = fs.readFileSync(file, "utf-8");
    const parsed = JSON.parse(original);
    const sorted = sortPackageJson(parsed);

    fs.writeFileSync(file, JSON.stringify(sorted, null, 2) + "\n");
    console.log(`✅ Sorted ${path.relative(ROOT_DIR, file)}`);
  }
};

run();
