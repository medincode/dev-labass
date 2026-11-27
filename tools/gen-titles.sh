#!/usr/bin/env bash
# Logos de section (texte seul, lettrage 3D bombé dans le style du logo Labass) via codex-imagegen-mcp.
set -euo pipefail
cd "$(dirname "$0")/.."
export NODE_USE_ENV_PROXY=1 NODE_EXTRA_CA_CERTS=${NODE_EXTRA_CA_CERTS:-/root/.ccr/ca-bundle.crt}
S="Same chunky inflated 3D bubbly lettering style, same dark plum letter color and same soft glossy clay finish as the reference logo. One single line of text only. No icon, no object, no decoration, no accent, no flower, no emblem, no extra shapes. Plain transparent background. Exact spelling"
gen() { { [ -s "src/assets/brand/title-$1.png" ] || [ -s "src/assets/brand/title-$1.webp" ]; } && return 0
  npx -y codex-imagegen-mcp generate "A wordmark logo that reads exactly \"$2\". $S" -i tools/logo-ref.png -a 3:2 -b transparent -o "src/assets/brand/title-$1.png" 2>&1 | grep -E "Saved|Error" || true; }
gen stayclean "Stay Clean" & gen eatclean "Eat Clean" & gen getfit "Get fit" &
wait
gen breathgood "Breath good" & gen mood "Mood-o-meter" & gen rewards "Récompenses" &
wait
