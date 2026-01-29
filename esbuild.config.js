import esbuild from "esbuild";
import { copyFileSync } from "fs";
import path from "path";

const config = {
  entryPoints: ["src/index.ts"],
  bundle: true,
  minify: true,
  platform: "node",
  format: "esm",
  outfile: "dist/index.js",
  sourcemap: true,
  packages: "external", // Don't bundle node_modules
  define: {
    "process.env.NODE_ENV": '"production"',
  },
  alias: {
    "@": path.resolve("./src"),
    "@/common": path.resolve("./src/common"),
    "@cahoot/socket": path.resolve("./src"),
  },
  banner: {
    js: "import { createRequire } from 'module';const require = createRequire(import.meta.url);",
  },
};

// Build to dist/
await esbuild.build(config);
console.log("✓ Built to dist/index.js");

// Copy to root
copyFileSync("dist/index.js", "index.js");
copyFileSync("dist/index.js.map", "index.js.map");
console.log("✓ Copied to index.js");

export { config };
