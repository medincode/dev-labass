#!/usr/bin/env bash
# Télécharge les 3 vidéos Wim Hof depuis YouTube puis les compresse (480p, H.264 CRF 30, AAC 96k, faststart).
# Prérequis : pip install yt-dlp  +  ffmpeg.  Si YouTube demande de confirmer que tu n'es pas un robot :
#   COOKIES=firefox ./scripts/download-videos.sh     (ou chrome)
set -euo pipefail
cd "$(dirname "$0")/../public/videos"
CK=(); [ -n "${COOKIES:-}" ] && CK=(--cookies-from-browser "$COOKIES")
dl() {
  yt-dlp "${CK[@]}" -f "bv*[height<=720]+ba/b[height<=720]" --merge-output-format mp4 -o "raw-$1.mp4" "$2"
  ffmpeg -y -loglevel error -i "raw-$1.mp4" -vf "scale=-2:'min(480,ih)'" -c:v libx264 -crf 30 -preset slow \
    -c:a aac -b:a 96k -movflags +faststart "$1.mp4"
  rm "raw-$1.mp4"; du -h "$1.mp4"
}
dl breathing-lvl1 "https://www.youtube.com/watch?v=tybOi4hjZFQ"
dl breathing-lvl2 "https://www.youtube.com/watch?v=YkE8AObpzm4"
dl breathing-lvl3 "https://www.youtube.com/watch?v=u8j7Ir_cg0M"
echo "OK → git add public/videos && git commit -m 'vidéos breathing' && git push"
