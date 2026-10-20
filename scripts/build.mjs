#!/usr/bin/env node
// Usage: node scripts/build.mjs [--out <dir>] [--skip-patch <name>]
// Assembles dist/ from upstream/ plus overlay/. Never reads the network.

import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, renameSync, rmSync, writeFileSync } from "node:fs";
import { basename, dirname, join } from "node:path";
import { execFileSync } from "node:child_process";
import { ROOT, isText, outsideUrls, readJson, rel, walk } from "./lib.mjs";

const args = process.argv.slice(2);
const flag = (name) => {
  const i = args.indexOf(name);
  return i === -1 ? undefined : args[i + 1];
};
const OUT = flag("--out") ?? join(ROOT, "dist");
const skipPatch = flag("--skip-patch");

const UP = join(ROOT, "upstream");
const OVERLAY = join(ROOT, "overlay");
const selection = readJson(join(OVERLAY, "selection.json"));
const renames = readJson(join(OVERLAY, "renames.json"));

rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });

const excluded = new Set(selection.pstack.exclude);
for (const dir of ["skills", "agents", "docs"]) {
  cpSync(join(UP, "pstack", dir), join(OUT, dir), {
    recursive: true,
    filter: (src) => dir !== "skills" || !excluded.has(rel(join(UP, "pstack", "skills"), src).split("/")[0]),
  });
}

for (const path of selection.mattpocock.include) {
  const dest = join(OUT, "skills", basename(path));
  if (existsSync(dest)) throw new Error(`mattpocock ${path} collides with an existing skill at ${rel(OUT, dest)}`);
  cpSync(join(UP, "mattpocock", path), dest, { recursive: true });
}

mkdirSync(join(OUT, "licenses"));
for (const name of ["pstack", "mattpocock"]) {
  cpSync(join(UP, name, "LICENSE"), join(OUT, "licenses", `${name}.LICENSE`));
}

for (const [from, to] of Object.entries(renames.paths)) {
  mkdirSync(dirname(join(OUT, to)), { recursive: true });
  renameSync(join(OUT, from), join(OUT, to));
}
for (const file of walk(OUT)) {
  if (!isText(file) || file.startsWith(join(OUT, "licenses"))) continue;
  const before = readFileSync(file, "utf8");
  const after = outsideUrls(before, (part) => renames.text.reduce((s, [from, to]) => s.split(from).join(to), part));
  if (after !== before) writeFileSync(file, after);
}

const files = join(OVERLAY, "files");
if (existsSync(files)) {
  for (const file of walk(files)) {
    const dest = join(OUT, rel(files, file));
    if (existsSync(dest)) console.warn(`overlay replaces ${rel(OUT, dest)} whole; prefer a patch`);
    mkdirSync(dirname(dest), { recursive: true });
    cpSync(file, dest);
  }
}

const patchDir = join(OVERLAY, "patches");
const patches = existsSync(patchDir) ? readdirSync(patchDir).filter((f) => f.endsWith(".patch")).sort() : [];
const failed = [];
for (const patch of patches) {
  if (patch === `${skipPatch}.patch`) continue;
  try {
    execFileSync("git", ["apply", "--whitespace=nowarn", `--directory=${rel(ROOT, OUT)}`, join(patchDir, patch)], {
      cwd: ROOT,
      stdio: ["ignore", "ignore", "pipe"],
    });
  } catch (err) {
    failed.push(`${patch}\n${String(err.stderr).trim().replace(/^/gm, "    ")}`);
  }
}

mkdirSync(join(OUT, ".claude-plugin"), { recursive: true });
cpSync(join(OVERLAY, "plugin.json"), join(OUT, ".claude-plugin", "plugin.json"));

if (failed.length) {
  console.error(`patches that no longer apply (${failed.length}):`);
  for (const f of failed) console.error(`  ${f}`);
  process.exit(1);
}
console.log(`built ${rel(ROOT, OUT)} with ${patches.length} patches`);
try {
  execFileSync(process.execPath, [join(ROOT, "scripts", "check.mjs"), OUT], { stdio: "inherit" });
} catch {
  process.exit(1);
}
