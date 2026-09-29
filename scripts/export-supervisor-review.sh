#!/usr/bin/env bash
set -euo pipefail

project_dir="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)"
export_dir="$(mktemp -d /tmp/roscon-26-export.XXXXXX)"
image="mcr.microsoft.com/playwright:v1.63.0-noble"

cleanup() {
  docker run --rm -v "$export_dir:/work" "$image" bash -lc \
    'find /work -mindepth 1 -maxdepth 1 -exec rm -rf -- {} +' \
    >/dev/null 2>&1 || true
  rmdir "$export_dir" 2>/dev/null || true
}

trap cleanup EXIT

cp \
  "$project_dir"/README.md \
  "$project_dir"/flake.lock \
  "$project_dir"/flake.nix \
  "$project_dir"/netlify.toml \
  "$project_dir"/package.json \
  "$project_dir"/pnpm-lock.yaml \
  "$project_dir"/slides.md \
  "$project_dir"/style.css \
  "$project_dir"/vercel.json \
  "$export_dir"/

docker run --rm --init --ipc=host -e CI=true \
  -v "$export_dir:/work" \
  -w /work \
  "$image" \
  bash -lc '
    set -e
    corepack enable
    corepack prepare pnpm@10.28.0 --activate
    pnpm install --frozen-lockfile
    pnpm add -D playwright-chromium@1.63.0
    pnpm exec slidev export --range 1-7 --output supervisor-review.pdf
  '

test -s "$export_dir/supervisor-review.pdf"
cp "$export_dir/supervisor-review.pdf" "$project_dir/supervisor-review.pdf"
printf 'Exported slides 1-7 to %s\n' "$project_dir/supervisor-review.pdf"
