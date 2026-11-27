#!/usr/bin/env bash
# Compresse n'importe quel mp4 déposé dans public/videos (idempotent).
set -euo pipefail
cd "$(dirname "$0")/../public/videos"
for f in *.mp4; do [ -e "$f" ] || continue
  ffmpeg -y -loglevel error -i "$f" -vf "scale=-2:'min(480,ih)'" -c:v libx264 -crf 30 -preset slow -c:a aac -b:a 96k -movflags +faststart "tmp-$f" && mv "tmp-$f" "$f"; du -h "$f"
done
