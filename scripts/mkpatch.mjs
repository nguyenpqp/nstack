#!/usr/bin/env node
// Usage: edit files under dist/, then `node scripts/mkpatch.mjs <name>`.
// Writes overlay/patches/<name>.patch as the difference between dist/ and a build without that patch.

import { execFileSync, spawnSync } from "node:child_process";
import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { ROOT, rel } from "./lib.mjs";

const name = process.argv[2];
if (!name || name.endsWith(".patch")) {
  console.error("usage: node scripts/mkpatch.mjs <name>   (no .patch suffix)");
  process.exit(2);
}

const DIST = join(ROOT, "dist");
const PRISTINE = join(ROOT, ".cache", "pristine");
const BUILD = join(ROOT, "scripts", "build.mjs");

execFileSync(process.execPath, [BUILD, "--out", PRISTINE, "--skip-patch", name, "--no-check"], { stdio: "inherit" });

const diff = spawnSync(
  "git",
  ["diff", "--no-index", "--no-color", "--binary", "--src-prefix=a/", "--dst-prefix=b/", rel(ROOT, PRISTINE), rel(ROOT, DIST)],
  { cwd: ROOT, encoding: "utf8", maxBuffer: 64 * 1024 * 1024 },
);
if (diff.status > 1) throw new Error(diff.stderr);

const pristine = `${rel(ROOT, PRISTINE)}/`;
const dist = `${rel(ROOT, DIST)}/`;
const patch = diff.stdout.split(`a/${pristine}`).join("a/").split(`b/${dist}`).join("b/");

const out = join(ROOT, "overlay", "patches", `${name}.patch`);
rmSync(PRISTINE, { recursive: true, force: true });
if (!patch.trim()) {
  rmSync(out, { force: true });
  console.log(`no difference; removed ${rel(ROOT, out)} if it existed`);
  process.exit(0);
}
mkdirSync(join(ROOT, "overlay", "patches"), { recursive: true });
writeFileSync(out, patch);
console.log(`wrote ${rel(ROOT, out)}`);

try {
  execFileSync(process.execPath, [BUILD], { stdio: "inherit" });
} catch {
  process.exit(1);
}
