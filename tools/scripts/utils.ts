import { fileURLToPath } from "url";
import path from "path";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const ROOT_DIR = path.resolve(__dirname, "../../");

export const absolutePath = (...segments: string[]) =>
  path.resolve(ROOT_DIR, ...segments);

export const readJson = (p: string) => JSON.parse(fs.readFileSync(p, "utf8"));
