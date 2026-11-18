import { execFileSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { basename, dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

export const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

export const readJson = (path) => JSON.parse(readFileSync(path, "utf8"));

export const run = (cmd, args, opts = {}) => execFileSync(cmd, args, { encoding: "utf8", ...opts }).trim();

export function* walk(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(path);
    else yield path;
  }
}

const BINARY = /\.(png|jpe?g|gif|webp|ico|pdf|mp4|mov|woff2?|ttf|zip)$/i;
export const isText = (path) => !BINARY.test(path);

export const rel = (from, path) => relative(from, path).split("\\").join("/");

const URL = /(https?:\/\/[^\s)>\]"'`]+)/;
export const outsideUrls = (text, fn) =>
  text
    .split(URL)
    .map((part, i) => (i % 2 ? part : fn(part)))
    .join("");

export const stripUrls = (text) =>
  text
    .split(URL)
    .filter((_, i) => i % 2 === 0)
    .join(" ");

const PATCHES = join(ROOT, "overlay", "patches");
export const listPatches = () =>
  existsSync(PATCHES)
    ? readdirSync(PATCHES)
        .filter((f) => f.endsWith(".patch"))
        .sort()
    : [];

export const patchTargets = (patch) =>
  [...readFileSync(join(PATCHES, patch), "utf8").matchAll(/^\+\+\+ b\/(.+)$/gm)].map((m) => m[1]);

export function upstreamOf(distPath, selection, renames) {
  let path = distPath;
  for (const [from, to] of Object.entries(renames.paths)) {
    if (path === to || path.startsWith(`${to}/`)) path = from + path.slice(to.length);
  }
  const [top, skill, ...rest] = path.split("/");
  const pocock = selection.mattpocock.include.find((p) => (selection.mattpocock.rename?.[p] ?? basename(p)) === skill);
  if (top === "skills" && pocock) return ["upstream/mattpocock", pocock, ...rest].join("/");
  return `upstream/pstack/${path}`;
}
