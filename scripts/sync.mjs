#!/usr/bin/env node
// Usage: node scripts/sync.mjs [name=<sha-or-ref> ...]
// Refreshes upstream/<name>/ from upstream.json, rewrites UPSTREAM.lock, rebuilds dist/, and prints what needs a human.

import { execFileSync } from "node:child_process";
import { cpSync, existsSync, mkdirSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { ROOT, listPatches, patchTargets, readJson, run, upstreamOf } from "./lib.mjs";

const sources = readJson(join(ROOT, "upstream.json"));
const lockPath = join(ROOT, "UPSTREAM.lock");
const oldLock = existsSync(lockPath) ? readJson(lockPath) : {};
const pins = Object.fromEntries(process.argv.slice(2).map((a) => a.split("=")));

const git = (cwd, ...args) => execFileSync("git", args, { cwd, encoding: "utf8" }).trim();

const newLock = {};
for (const [name, src] of Object.entries(sources)) {
  const cache = join(ROOT, ".cache", name);
  if (!existsSync(join(cache, ".git"))) {
    mkdirSync(cache, { recursive: true });
    git(cache, "init", "-q");
    git(cache, "config", "core.autocrlf", "false");
    git(cache, "remote", "add", "origin", src.repo);
  }
  const ref = pins[name] ?? src.ref;
  git(cache, "fetch", "-q", "--depth", "1", "--filter=blob:none", "origin", ref);
  if (src.path !== ".") {
    git(cache, "sparse-checkout", "set", "--no-cone", `/${src.path}/`);
  }
  git(cache, "checkout", "-q", "--force", "FETCH_HEAD");
  const sha = git(cache, "rev-parse", "HEAD");

  const dest = join(ROOT, "upstream", name);
  rmSync(dest, { recursive: true, force: true });
  mkdirSync(dest, { recursive: true });
  for (const entry of src.keep) {
    const from = join(cache, src.path, entry);
    if (!existsSync(from)) throw new Error(`${name}: upstream has no ${entry} under ${src.path}`);
    cpSync(from, join(dest, entry), { recursive: true });
  }
  newLock[name] = { repo: src.repo, path: src.path, sha };
  const was = oldLock[name]?.sha;
  console.log(`${name}: ${was ? `${was.slice(0, 7)} -> ` : ""}${sha.slice(0, 7)}`);
}
writeFileSync(lockPath, JSON.stringify(newLock, null, 2) + "\n");

const changed = execFileSync("git", ["-C", ROOT, "status", "--porcelain", "-z", "--untracked-files=all", "--", "upstream"], {
  encoding: "utf8",
})
  .split("\0")
  .filter(Boolean)
  .map((entry) => entry.slice(3));

const selection = readJson(join(ROOT, "overlay", "selection.json"));
const renames = readJson(join(ROOT, "overlay", "renames.json"));
const touched = (dir) => changed.some((p) => p.startsWith(dir));

const watched = [
  ...listPatches().flatMap((patch) =>
    patchTargets(patch).map((target) => ({ path: upstreamOf(target, selection, renames), by: `overlay/patches/${patch}` })),
  ),
  ...selection.wraps.map((w) => ({ path: w.upstream, by: w.by })),
].filter((w) => touched(w.path));

const review = selection.overlaps.filter((o) =>
  [o.pstack && `upstream/pstack/${o.pstack}`, o.mattpocock && `upstream/mattpocock/${o.mattpocock}`]
    .filter(Boolean)
    .some(touched),
);

const included = new Set(selection.mattpocock.include);
const declined = new Set(selection.mattpocock.decline ?? []);
const manifest = readJson(join(ROOT, "upstream", "mattpocock", ".claude-plugin", "plugin.json"));
const unseen = manifest.skills
  .map((s) => s.replace(/^\.\//, ""))
  .filter((s) => !included.has(s) && !declined.has(s));

console.log(`\nupstream files changed: ${changed.length}`);
if (watched.length) {
  console.log("upstream changed under the overlay (re-read; a patch can apply and still say the wrong thing):");
  for (const w of watched) console.log(`  ${w.path} <- ${w.by}`);
}
if (review.length) {
  console.log("overlap pairs whose upstream side changed (re-decide in overlay/selection.json):");
  for (const o of review) console.log(`  ${o.skill}: winner ${o.winner}`);
}
if (unseen.length) {
  console.log("new mattpocock skills, neither included nor declined in overlay/selection.json:");
  for (const s of unseen) console.log(`  ${s}`);
}

const listed = (spec) => {
  try {
    return run("git", ["-C", ROOT, "ls-tree", "--name-only", spec]).split("\n").filter(Boolean);
  } catch {
    return [];
  }
};
const before = new Set(listed("HEAD:upstream/pstack/skills"));
const now = new Set(readdirSync(join(ROOT, "upstream", "pstack", "skills")));
const added = [...now].filter((s) => before.size && !before.has(s));
const removed = [...before].filter((s) => !now.has(s));
if (added.length) console.log(`new pstack skills, included automatically: ${added.join(", ")}`);
if (removed.length) console.log(`pstack skills removed upstream: ${removed.join(", ")}`);

try {
  execFileSync(process.execPath, [join(ROOT, "scripts", "build.mjs")], { stdio: "inherit" });
} catch {
  process.exit(1);
}
