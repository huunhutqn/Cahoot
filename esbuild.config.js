import esbuild from "esbuild";
import path from "path";

export const config = {
  entryPoints: ["src/index.ts"],
  bundle: true,
  minify: true,
  platform: "node",
  format: "esm",
  outfile: "dist/index.js",
  sourcemap: true,
  define: {
    "process.env.NODE_ENV": '"production"',
  },
  alias: {
    "@": path.resolve("./src"),
    "@/common": path.resolve("./src/common"),
    "@cahoot/socket": path.resolve("./src"),
  },
};

esbuild.build(config);
