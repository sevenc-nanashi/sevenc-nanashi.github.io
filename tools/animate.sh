#!/usr/bin/env bash
set -exuo pipefail

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
input_image="${script_dir}/../src/assets/icon.webp"
output_dir="${script_dir}/../src/assets/icon"

mkdir -p "${output_dir}"

sizes=(100 200 400 500 600 800 1000)

if command -v magick >/dev/null 2>&1; then
  for size in "${sizes[@]}"; do
    magick "${input_image}" -coalesce -resize "${size}x${size}" \
      -define webp:lossless=true -define webp:loop=0 \
      "${output_dir}/icon_${size}x${size}.webp"
  done
  exit 0
fi

if ! command -v ffmpeg >/dev/null 2>&1; then
  echo "ffmpeg or ImageMagick (magick) is required but was not found in PATH." >&2
  exit 1
fi

if command -v webpinfo >/dev/null 2>&1; then
  if webpinfo "${input_image}" | grep -q "Animation"; then
    echo "Animated WebP detected; install ImageMagick (magick) to resize it." >&2
    exit 1
  fi
fi

for size in "${sizes[@]}"; do
  ffmpeg -y -i "${input_image}" -vf "scale=${size}:${size}" -lossless 1 -loop 0 \
    "${output_dir}/icon_${size}x${size}.webp"
done
