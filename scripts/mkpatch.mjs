#!/usr/bin/env node
// Usage:
//   node scripts/mkpatch.mjs start <name>   builds dist/ with the patches before <name>, then tries <name> itself
//   (edit files under dist/)
//   node scripts/mkpatch.mjs save <name>    writes overlay/patches/<name>.patch and rebuilds everything
// A patch is always diffed against the patches that sort before it, so later patches never leak into its context.

import { execFileSync, spawnSync } from "node:child_process";
import { existsSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { ROOT, rel, walk } from "./lib.mjs";

const [command, name] = process.argv.slice(2);
if (!["start", "save"].includes(command) || !name || name.endsWith(".patch")) {
  console.error("usage: node scripts/mkpatch.mjs start|save <name>   (no .patch suffix)");
  process.exit(2);
}

const DIST = join(ROOT, "dist");
const PRISTINE = join(ROOT, ".cache", "pristine");
const BUILD = join(ROOT, "scripts", "build.mjs");
const out = join(ROOT, "overlay", "patches", `${name}.patch`);
const build = (...args) => execFileSync(process.execPath, [BUILD, ...args], { stdio: "inherit" });

if (command === "start") {
  build("--until", name, "--lenient");
  if (existsSync(out)) {
    const applied = spawnSync("git", ["apply", "--whitespace=nowarn", "--reject", `--directory=${rel(ROOT, DIST)}`, out], {
      cwd: ROOT,
      encoding: "utf8",
    });
    console.log(applied.status === 0 ? `applied ${rel(ROOT, out)}` : `applied ${rel(ROOT, out)} partly; finish the .rej hunks by hand`);
  }
  console.log(`edit dist/, then run: node scripts/mkpatch.mjs save ${name}`);
  process.exit(0);
}

const leftovers = [...walk(DIST)].filter((f) => f.endsWith(".rej") || f.endsWith(".orig"));
if (leftovers.length) {
  console.error(`finish and delete these first:\n  ${leftovers.map((f) => rel(ROOT, f)).join("\n  ")}`);
  process.exit(1);
}

build("--out", PRISTINE, "--until", name, "--lenient");

const diff = spawnSync(
  "git",
  ["diff", "--no-index", "--no-color", "--binary", "--src-prefix=a/", "--dst-prefix=b/", rel(ROOT, PRISTINE), rel(ROOT, DIST)],
  { cwd: ROOT, encoding: "utf8", maxBuffer: 64 * 1024 * 1024 },
);
if (diff.status > 1) throw new Error(diff.stderr);

const pristine = rel(ROOT, PRISTINE);
const dist = rel(ROOT, DIST);
const patch = diff.stdout
  .split("\n")
  .map((line) =>
    /^(diff --git|--- |\+\+\+ |rename |copy )/.test(line)
      ? line.split(`a/${pristine}/`).join("a/").split(`b/${dist}/`).join("b/")
      : line,
  )
  .join("\n");

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
  build();
} catch {
  process.exit(1);
}
