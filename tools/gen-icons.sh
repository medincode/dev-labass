#!/usr/bin/env bash
# Génère les icônes 3D via codex-imagegen-mcp (login requis). Usage: tools/gen-icons.sh [nom ...]
set -euo pipefail
cd "$(dirname "$0")/.."
export NODE_USE_ENV_PROXY=1 NODE_EXTRA_CA_CERTS=${NODE_EXTRA_CA_CERTS:-/root/.ccr/ca-bundle.crt}
STYLE="Premium 3D app icon, soft glossy clay-plastic render, chunky inflated rounded shapes, smooth gradients, soft highlights and subtle shadow, vibrant pastel colors true to the object, single object centered, plain transparent background, no circle, no disc, no badge, no text"
gen() {
  { [ -s "src/assets/3d/$1.png" ] || [ -s "src/assets/3d/$1.webp" ]; } && return
  npx -y codex-imagegen-mcp generate "$2. $STYLE" -a 1:1 -b transparent -o "src/assets/3d/$1.png" 2>&1 | grep -E "Saved|Error" || true
}
export -f gen; export STYLE
if [ $# -gt 0 ]; then for n in "$@"; do gen "$n" "$(grep -P "^$n\t" tools/icons.tsv | cut -f2)"; done
else cut -f1,2 tools/icons.tsv | xargs -P4 -d '\n' -I{} bash -c 'IFS=$'"'"'\t'"'"' read -r n d <<< "{}"; gen "$n" "$d"'; fi
