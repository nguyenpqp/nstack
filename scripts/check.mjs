#!/usr/bin/env node
// Usage: node scripts/check.mjs [dir]
// Fails when dist/ holds a dangling reference or a name the renames were meant to remove.

import { existsSync, readdirSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { ROOT, isText, readJson, rel, stripUrls, walk } from "./lib.mjs";

const DIST = resolve(process.argv[2] ?? join(ROOT, "dist"));
const plugin = readJson(join(DIST, ".claude-plugin", "plugin.json")).name;
const renames = readJson(join(ROOT, "overlay", "renames.json"));
const allow = readJson(join(ROOT, "overlay", "check-allow.json"));
const problems = [];
const report = (file, msg) => problems.push(`${rel(DIST, file)}: ${msg}`);

const frontName = (file) => readFileSync(file, "utf8").match(/^---[\s\S]*?^name:\s*["']?([^"'\n]+?)["']?\s*$/m)?.[1];

const skills = new Set(readdirSync(join(DIST, "skills")));
for (const skill of skills) {
  const file = join(DIST, "skills", skill, "SKILL.md");
  if (!existsSync(file)) report(file, "missing SKILL.md");
  else if (frontName(file) !== skill) report(file, `frontmatter name is ${frontName(file)}, directory is ${skill}`);
}
const agents = new Set(readdirSync(join(DIST, "agents")).map((f) => frontName(join(DIST, "agents", f))));

const LINK = /\]\(([^)\s]+)\)/g;
const SIBLING = /\.\.\/([a-z0-9-]+)\/SKILL\.md/g;
const AGENT = new RegExp(`\\b${plugin}:([a-z0-9-]+)`, "g");

for (const file of walk(DIST)) {
  if (!isText(file) || file.startsWith(join(DIST, "licenses"))) continue;
  const text = readFileSync(file, "utf8");

  const prose = stripUrls(text);
  for (const [from] of renames.text) {
    if (prose.includes(from)) report(file, `still says ${from}`);
  }
  if (!file.endsWith(".md")) continue;

  for (const [, target] of text.matchAll(LINK)) {
    if (/^(https?:|mailto:|#|<|\$\{)/.test(target)) continue;
    if (allow[rel(DIST, file)]?.includes(target)) continue;
    const path = target.split("#")[0];
    if (path && !existsSync(join(dirname(file), decodeURIComponent(path)))) report(file, `dangling link ${target}`);
  }
  for (const [, name] of text.matchAll(SIBLING)) {
    if (!skills.has(name)) report(file, `references missing skill ${name}`);
  }
  for (const [, name] of text.matchAll(AGENT)) {
    if (!skills.has(name) && !agents.has(name)) report(file, `references missing ${plugin}:${name}`);
  }
}

if (problems.length) {
  console.error(`check found ${problems.length} problems:`);
  for (const p of problems) console.error(`  ${p}`);
  process.exit(1);
}
console.log(`check passed: ${skills.size} skills, ${agents.size} agents`);
