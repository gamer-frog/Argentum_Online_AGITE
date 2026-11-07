#!/usr/bin/env bash
set -Eeuo pipefail

run() {
  /usr/bin/time -p "$@"
}

PROJECT_DIR="${PROJECT_DIR:-$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd -P)}"
PROJECT_DIR="$(run realpath "$PROJECT_DIR")"
STATIC_DIR="$PROJECT_DIR/dist"
PORT="${PORT:-3000}"
OPENCODE_WEB_DIR="${OPENCODE_WEB_DIR:-/home/runner/work/_temp/omgithub-web}"

[[ "$PORT" =~ ^[0-9]+$ ]] && (( PORT > 0 && PORT < 65536 )) || {
  echo 'PORT must be an integer between 1 and 65535.' >&2
  exit 1
}

cd "$PROJECT_DIR"
run mkdir -p "$STATIC_DIR" "$OPENCODE_WEB_DIR"

# Install and run a project's declared build when a package manifest exists.
# This project is currently plain static HTML/CSS/JS and has no dependencies.
if [[ -f "$PROJECT_DIR/package.json" ]]; then
  if [[ -f "$PROJECT_DIR/package-lock.json" ]]; then
    run npm ci
  else
    run npm install
  fi
  has_build="$(run node -e 'const p=require(process.argv[1]); process.stdout.write(String(Boolean(p.scripts && p.scripts.build)))' "$PROJECT_DIR/package.json")"
else
  has_build=false
fi

if [[ "$has_build" == true ]]; then
  run npm run build
else
  for asset in index.html styles.css game.js favicon.svg; do
    [[ -f "$PROJECT_DIR/$asset" ]] || { echo "Required static asset missing: $PROJECT_DIR/$asset" >&2; exit 1; }
    run cp "$PROJECT_DIR/$asset" "$STATIC_DIR/$asset"
  done
fi

# AO assets are generated locally and gitignored; expose them in the served build
# whenever the extractor has populated assets/ao/.
if [[ -d "$PROJECT_DIR/assets/ao" ]]; then
  run mkdir -p "$STATIC_DIR/assets"
  run cp -R "$PROJECT_DIR/assets/ao" "$STATIC_DIR/assets/"
fi

run python3 -c 'import json,sys; json.dump({"project":sys.argv[1],"directory":sys.argv[2]},open(sys.argv[3],"w")); print()' \
  "$PROJECT_DIR" "$STATIC_DIR" "$OPENCODE_WEB_DIR/deployment-output.json"
echo "Serving $STATIC_DIR on 0.0.0.0:$PORT"
run python3 -m http.server --bind 0.0.0.0 --directory "$STATIC_DIR" "$PORT"
