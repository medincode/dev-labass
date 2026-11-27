#!/usr/bin/env bash
# Logos de section (wordmarks 3D bombés dans le style du logo Labass) via codex-imagegen-mcp.
set -euo pipefail
cd "$(dirname "$0")/.."
export NODE_USE_ENV_PROXY=1 NODE_EXTRA_CA_CERTS=${NODE_EXTRA_CA_CERTS:-/root/.ccr/ca-bundle.crt}
S="Same chunky inflated 3D bubbly lettering style and dark plum letter color as the reference logo, soft glossy clay finish, one single line of text, plus one small glossy 3D accent object as described, plain transparent background, nothing else, exact spelling"
gen() { [ -s "src/assets/brand/title-$1.png" ] || [ -s "src/assets/brand/title-$1.webp" ] && return 0
  npx -y codex-imagegen-mcp generate "A wordmark logo that reads exactly \"$2\". Accent: $3. $S" -i tools/logo-ref.png -a 3:2 -b transparent -o "src/assets/brand/title-$1.png" 2>&1 | grep -E "Saved|Error" || true; }
gen stayclean "Stay Clean" "a small yellow banana"
gen eatclean "Eat Clean" "a small angry cheeseburger"
gen getfit "Get fit" "a small mint-green dumbbell"
gen breathgood "Breath good" "a small pink lotus flower"
gen mood "Mood-o-meter" "a small yellow smiley face"
gen rewards "Récompenses" "a small golden trophy"
