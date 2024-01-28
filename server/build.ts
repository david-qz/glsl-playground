import * as esbuild from "esbuild";
import fs from "node:fs";

fs.rmSync("../dist", { recursive: true, force: true });

esbuild.buildSync({
  entryPoints: ["index.ts"],
  bundle: true,
  // minify: true,
  sourcemap: true,
  platform: "node",
  external: ["pg", "bcrypt"],
  outfile: "../dist/server.js",
});

esbuild.buildSync({
  entryPoints: ["database/migrations/*.ts"],
  outdir: "../dist/migrations",
  format: "cjs",
});
