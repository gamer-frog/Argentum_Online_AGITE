#!/usr/bin/env bash
set -euo pipefail

PROJECT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd -P)"
cd "$PROJECT_DIR"

run_timed() {
  /usr/bin/time -p "$@"
}

PORT="${PORT:-3000}"
if [[ ! "$PORT" =~ ^[0-9]+$ ]] || (( PORT < 1 || PORT > 65535 )); then
  echo "PORT must be an integer from 1 to 65535." >&2
  exit 1
fi
export PORT

BUILD_DIR="$PROJECT_DIR"
if [[ -f package.json ]]; then
  if [[ -f package-lock.json ]]; then
    run_timed npm ci --no-audit --no-fund
  else
    run_timed npm install --no-audit --no-fund
  fi

  if run_timed node -e 'const p=require(process.argv[1]); process.exit(p.scripts?.build ? 0 : 1)' "$PROJECT_DIR/package.json"; then
    run_timed npm run build
    if [[ -f "$PROJECT_DIR/dist/index.html" ]]; then
      BUILD_DIR="$PROJECT_DIR/dist"
    elif [[ -f "$PROJECT_DIR/build/index.html" ]]; then
      BUILD_DIR="$PROJECT_DIR/build"
    fi
  fi
fi

BUILD_DIR="$(cd -- "$BUILD_DIR" && pwd -P)"
run_timed test -f "$BUILD_DIR/index.html"

WEB_DIR="${OPENCODE_WEB_DIR:-${RUNNER_TEMP:-/home/runner/work/_temp}/omgithub-web}"
export PROJECT_DIR BUILD_DIR WEB_DIR
run_timed mkdir -p "$WEB_DIR"
run_timed node -e 'const fs=require("node:fs"); fs.writeFileSync(`${process.env.WEB_DIR}/deployment-output.json`, JSON.stringify({project:process.env.PROJECT_DIR,directory:process.env.BUILD_DIR})+"\n")'

# Python's static server stays in the foreground so the controller owns its lifecycle.
run_timed python3 -m http.server "$PORT" --bind 0.0.0.0 --directory "$BUILD_DIR"
