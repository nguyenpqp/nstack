#!/usr/bin/env node
// Usage: node scripts/check.mjs [dir]
// Fails when dist/ holds a dangling reference, a name the renames were meant to remove, or a Cursor name.

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

// nstack ships no Cursor adapter, so Cursor names and Cursor-only Agent fields must not reach dist/. A sync that adds
// one fails here until a claudeCode rename or a patch rewrites it, or overlay/cursor-allow.json allows it for that file.
const cursorAllow = readJson(join(ROOT, "overlay", "cursor-allow.json"));
const CURSORISMS = [
  /\bcursor/i,
  /\breadonly\b(?!\s+__brand)/,
  /\benvironment: "/,
  /\bcloud_base_branch\b/,
  /\bAskQuestion\b/,
  /\.mdc\b/,
  /\bclaude-[a-z]+-\d/,
  /\b(grok|composer|gpt)-/,
  /\bcloud (agent|VM|subagent)s?\b/i,
  /\btodolist\b/,
  /\bCustom Modes?\b/,
  /\bAutomations?\b/,
  /\bfast or standard speed\b/,
  /\bharness\/claude-code\.md\b/,
];

// Skills that other plugins ship, which nstack names in place of a Cursor built-in.
const EXTERNAL_SKILLS = new Set(["skill-creator"]);

const LINK = /\]\(([^)\s]+)\)/g;
const PROSE_SKILL = /(?:\*\*|`)([a-z0-9][a-z0-9-]*)(?:\*\*|`)( principle)? skill\b/g;
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
  for (const [from] of renames.claudeCode) {
    if (prose.includes(from)) report(file, `still says ${from}`);
  }
  const allowed = cursorAllow[rel(DIST, file)] ?? [];
  prose
    .split("\n")
    .map((line) => allowed.reduce((l, a) => l.split(a).join(" "), line))
    .forEach((line, i) => {
      const hit = CURSORISMS.find((re) => re.test(line));
      if (hit) report(file, `line ${i + 1} matches ${hit}: ${line.trim().slice(0, 120)}`);
    });

  for (const [, target] of text.matchAll(LINK)) {
    if (/^(https?:|mailto:|#|<|\$\{)/.test(target)) continue;
    if (allow[rel(DIST, file)]?.includes(target)) continue;
    const path = target.split("#")[0];
    if (path && !existsSync(join(dirname(file), decodeURIComponent(path)))) report(file, `dangling link ${target}`);
  }
  for (const [, word, principle] of text.matchAll(PROSE_SKILL)) {
    const name = principle ? `principle-${word.replace(/^principle-/, "")}` : word;
    if (skills.has(name) || EXTERNAL_SKILLS.has(name) || allow[rel(DIST, file)]?.includes(name)) continue;
    report(file, `names skill ${name}, which does not ship`);
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
