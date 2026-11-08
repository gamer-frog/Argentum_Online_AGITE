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

run mkdir -p "$STATIC_DIR" "$OPENCODE_WEB_DIR"
cd "$PROJECT_DIR"
for asset in index.html styles.css game.js favicon.svg; do
  [[ -f "$PROJECT_DIR/$asset" ]] || { echo "Required static asset missing: $PROJECT_DIR/$asset" >&2; exit 1; }
  run cp "$PROJECT_DIR/$asset" "$STATIC_DIR/$asset"
done
[[ -d "$PROJECT_DIR/assets/ao" ]] || { echo "Required AO assets missing: $PROJECT_DIR/assets/ao" >&2; exit 1; }
run mkdir -p "$STATIC_DIR/assets/ao"
run cp -a "$PROJECT_DIR/assets/ao/." "$STATIC_DIR/assets/ao/"

# This project is plain HTML/CSS/JS and has no dependency installation or build step.
run bash -c 'printf "{\"project\":\"%s\",\"directory\":\"%s\"}\n" "$1" "$2" > "$3/deployment-output.json"' _ "$PROJECT_DIR" "$STATIC_DIR" "$OPENCODE_WEB_DIR"
echo "Serving $STATIC_DIR on 0.0.0.0:$PORT"
run python3 -m http.server --bind 0.0.0.0 --directory "$STATIC_DIR" "$PORT"
