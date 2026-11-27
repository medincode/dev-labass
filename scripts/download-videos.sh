#!/usr/bin/env bash
# À lancer sur TON PC (YouTube est bloqué dans le sandbox). Requiert: pip install yt-dlp + ffmpeg
set -e
cd "$(dirname "$0")/../public/videos"
dl() { yt-dlp -f "bv*[height<=720][ext=mp4]+ba[ext=m4a]/b[ext=mp4]" --merge-output-format mp4 -o "$1.mp4" "$2"; }
dl breathing-lvl1 "https://www.youtube.com/watch?v=tybOi4hjZFQ"
dl breathing-lvl2 "https://www.youtube.com/watch?v=YkE8AObpzm4"
dl breathing-lvl3 "https://www.youtube.com/watch?v=u8j7Ir_cg0M"
