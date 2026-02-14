import * as esbuild from "esbuild";

await esbuild.build({
  entryPoints: ["src/index.ts"],
  bundle: true,
  outfile: "dist/index.js",
  format: "esm",
  platform: "node",
  target: "node18",
  external: ["node:*"],
  sourcemap: true,
  banner: {
    js: "// Glintlock MCP Engine — bundled, no npm install needed",
  },
});
