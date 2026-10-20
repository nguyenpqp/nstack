#!/usr/bin/env node
// Usage: node scripts/build.mjs [--out <dir>] [--until <patch-name>] [--lenient] [--no-check]
// Assembles dist/ from upstream/ plus overlay/. Never reads the network.
// --until applies only the patches that sort before <patch-name>. --lenient reports failures without failing.

import { cpSync, existsSync, mkdirSync, readFileSync, renameSync, rmSync, writeFileSync } from "node:fs";
import { basename, dirname, join, resolve } from "node:path";
import { execFileSync } from "node:child_process";
import { ROOT, isText, listPatches, outsideUrls, readJson, rel, walk } from "./lib.mjs";

const args = process.argv.slice(2);
const flag = (name) => {
  const i = args.indexOf(name);
  return i === -1 ? undefined : args[i + 1];
};
const OUT = resolve(flag("--out") ?? join(ROOT, "dist"));
const until = flag("--until");
const lenient = args.includes("--lenient");
if (rel(ROOT, OUT).startsWith("..")) throw new Error(`--out must be inside ${ROOT}, because git apply only writes there`);

const UP = join(ROOT, "upstream");
const OVERLAY = join(ROOT, "overlay");
const selection = readJson(join(OVERLAY, "selection.json"));
const renames = readJson(join(OVERLAY, "renames.json"));

rmSync(OUT, { recursive: true, force: true, maxRetries: 5 });
mkdirSync(OUT, { recursive: true });

// Windows briefly locks files just written under dist/ (EPERM on rename, UNKNOWN on open), so retry before failing.
const retrying = (label, fn) => {
  for (let attempt = 1; ; attempt++) {
    try {
      return fn();
    } catch (err) {
      if (attempt === 10 || !["EPERM", "EACCES", "EBUSY", "UNKNOWN"].includes(err.code)) throw err;
      console.error(`${label} failed with ${err.code}, retrying`);
      Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 100 * attempt);
    }
  }
};

const excluded = new Set(selection.pstack.exclude);
for (const dir of ["skills", "agents", "docs"]) {
  cpSync(join(UP, "pstack", dir), join(OUT, dir), {
    recursive: true,
    filter: (src) => dir !== "skills" || !excluded.has(rel(join(UP, "pstack", "skills"), src).split("/")[0]),
  });
}

const failed = [];
for (const path of selection.mattpocock.include) {
  const name = selection.mattpocock.rename?.[path] ?? basename(path);
  const dest = join(OUT, "skills", name);
  if (existsSync(dest)) throw new Error(`mattpocock ${path} collides with an existing skill at ${rel(OUT, dest)}`);
  if (!existsSync(join(UP, "mattpocock", path))) {
    failed.push(`overlay/selection.json: upstream has no ${path} to include`);
    continue;
  }
  // agents/openai.yaml is Codex metadata that Claude Code never reads.
  cpSync(join(UP, "mattpocock", path), dest, {
    recursive: true,
    filter: (src) => rel(join(UP, "mattpocock", path), src) !== "agents",
  });
  if (name !== basename(path)) {
    const skill = join(dest, "SKILL.md");
    const renamed = readFileSync(skill, "utf8").replace(/^name: .+$/m, `name: ${name}`);
    retrying(`write ${rel(OUT, skill)}`, () => writeFileSync(skill, renamed));
  }
}

mkdirSync(join(OUT, "licenses"));
for (const name of ["pstack", "mattpocock"]) {
  cpSync(join(UP, name, "LICENSE"), join(OUT, "licenses", `${name}.LICENSE`));
}

for (const [from, to] of Object.entries(renames.paths)) {
  if (!existsSync(join(OUT, from))) {
    failed.push(`overlay/renames.json: upstream has no ${from} to rename to ${to}`);
    continue;
  }
  mkdirSync(dirname(join(OUT, to)), { recursive: true });
  retrying(`rename ${from}`, () => renameSync(join(OUT, from), join(OUT, to)));
}
for (const file of walk(OUT)) {
  if (!isText(file) || file.startsWith(join(OUT, "licenses"))) continue;
  const before = readFileSync(file, "utf8");
  const after = outsideUrls(before, (part) => renames.text.reduce((s, [from, to]) => s.split(from).join(to), part));
  if (after !== before) retrying(`write ${rel(OUT, file)}`, () => writeFileSync(file, after));
}

const files = join(OVERLAY, "files");
if (existsSync(files)) {
  for (const file of walk(files)) {
    const dest = join(OUT, rel(files, file));
    if (existsSync(dest)) {
      failed.push(`overlay/files/${rel(files, file)} would replace an upstream file; turn it into a patch`);
      continue;
    }
    mkdirSync(dirname(dest), { recursive: true });
    retrying(`copy ${rel(OUT, dest)}`, () => cpSync(file, dest));
  }
}

const patches = listPatches().filter((p) => !until || p < `${until}.patch`);
for (const patch of patches) {
  try {
    execFileSync("git", ["apply", "--whitespace=nowarn", `--directory=${rel(ROOT, OUT)}`, join(OVERLAY, "patches", patch)], {
      cwd: ROOT,
      stdio: ["ignore", "ignore", "pipe"],
    });
  } catch (err) {
    failed.push(`overlay/patches/${patch} no longer applies\n${String(err.stderr).trim().replace(/^/gm, "    ")}`);
  }
}

// Cursor names become Claude Code names after the patches, so patch context stays upstream text. A partial build skips
// this so mkpatch diffs the same text it applies to. The adapter keeps both sides of its tables.
const ADAPTER = join(OUT, "docs", "harness", "claude-code.md");
if (!until) {
  for (const file of walk(OUT)) {
    if (!file.endsWith(".md") || file === ADAPTER) continue;
    const before = readFileSync(file, "utf8");
    const after = outsideUrls(before, (part) => renames.claudeCode.reduce((s, [from, to]) => s.split(from).join(to), part));
    if (after !== before) retrying(`write ${rel(OUT, file)}`, () => writeFileSync(file, after));
  }
}

const tiers = readJson(join(OVERLAY, "agents.json"));
const baseAgent = readFileSync(join(OUT, tiers.base), "utf8");
const baseName = baseAgent.match(/^name: (.+)$/m)[1];
if (!/^description: .+$/m.test(baseAgent)) failed.push(`${tiers.base} has no one-line description for the effort tiers`);
for (const { effort, use } of tiers.variants) {
  const variant = baseAgent
    .replace(/^name: .+$/m, `name: ${baseName}-${effort}`)
    .replace(
      /^description: (.+)$/m,
      (_, d) =>
        `description: ${baseName} pinned to ${effort} effort. Use for ${use}. Model still comes from the role's Agent \`model\` param. ${d}\neffort: ${effort}`,
    );
  const tier = join(OUT, dirname(tiers.base), `${baseName}-${effort}.md`);
  retrying(`write ${rel(OUT, tier)}`, () => writeFileSync(tier, variant));
}

mkdirSync(join(OUT, ".claude-plugin"), { recursive: true });
cpSync(join(OVERLAY, "plugin.json"), join(OUT, ".claude-plugin", "plugin.json"));

if (failed.length) {
  console.error(`overlay items that need a human (${failed.length}):`);
  for (const f of failed) console.error(`  ${f}`);
  if (!lenient) process.exit(1);
}
console.log(`built ${rel(ROOT, OUT)} with ${patches.length} patches`);
if (!args.includes("--no-check") && !lenient) {
  try {
    execFileSync(process.execPath, [join(ROOT, "scripts", "check.mjs"), OUT], { stdio: "inherit" });
  } catch {
    process.exit(1);
  }
}
