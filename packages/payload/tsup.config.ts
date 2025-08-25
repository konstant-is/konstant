import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts", "src/client.ts"],
  format: ["esm"], // or ['esm', 'cjs'] if you want both
  dts: true, // emit .d.ts files
  clean: true, // clean dist before build
  sourcemap: true,
  outDir: "dist",
});
