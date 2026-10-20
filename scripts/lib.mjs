import { execFileSync } from "node:child_process";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
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
