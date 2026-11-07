#!/usr/bin/env bash
set -Eeuo pipefail

run() {
  /usr/bin/time -p "$@"
}

CAPTURE_URL="${CAPTURE_URL:?Set CAPTURE_URL to the exact page URL to capture}"
CAPTURE_DIR="${CAPTURE_DIR:-${RUNNER_TEMP:-/home/runner/work/_temp}/captures}"
PROJECT_DIR="$(run realpath "$(dirname -- "${BASH_SOURCE[0]}")")"
BROWSER_SESSION="project-capture-$$"
BROWSER_OPEN=false

close_browser() {
  if [[ "$BROWSER_OPEN" == true ]]; then
    run playwright-cli "-s=$BROWSER_SESSION" close >/dev/null 2>&1 || true
    BROWSER_OPEN=false
  fi
}
trap close_browser EXIT

[[ "$CAPTURE_URL" =~ ^https?:// ]] || { echo 'CAPTURE_URL must be an HTTP(S) URL.' >&2; exit 1; }
run mkdir -p "$CAPTURE_DIR"
CAPTURE_DIR="$(run realpath "$CAPTURE_DIR")"
case "$CAPTURE_DIR/" in
  "$PROJECT_DIR/"*) echo 'CAPTURE_DIR must be outside the project source tree.' >&2; exit 1 ;;
esac

# A distinct named session ensures this script closes only the browser it opened.
if ! run playwright-cli "-s=$BROWSER_SESSION" open "$CAPTURE_URL"; then
  BROWSER_OPEN=true
  echo 'Could not open the requested page in the browser.' >&2
  exit 75
fi
BROWSER_OPEN=true

# Wait for the document and meaningful visible app content, not a quoted JSON
# diagnostic string (which caused the previous false-negative render check).
if ! render_state="$(run playwright-cli "-s=$BROWSER_SESSION" --raw eval '() => new Promise(resolve => { const started = Date.now(); const check = () => { const app = document.querySelector(".client-window"); const rect = app?.getBoundingClientRect(); const ready = document.readyState === "complete"; const visible = Boolean(rect && rect.width > 0 && rect.height > 0); const content = (document.body?.innerText || "").includes("ARGENTUM ONLINE"); if (ready && visible && content) return requestAnimationFrame(() => requestAnimationFrame(() => resolve(true))); if (Date.now() - started >= 15000) return resolve(false); setTimeout(check, 100); }; check(); })')"; then
  echo 'Browser could not inspect the rendered page.' >&2
  exit 75
fi
if [[ "$render_state" != true && "$render_state" != '"true"' ]]; then
  echo "The page loaded but required application content did not render: $render_state" >&2
  exit 1
fi

if ! run playwright-cli "-s=$BROWSER_SESSION" resize 1440 1000; then
  echo 'Could not set the desktop browser viewport.' >&2
  exit 75
fi
if ! run playwright-cli "-s=$BROWSER_SESSION" screenshot --filename "$CAPTURE_DIR/final-desktop.png"; then
  echo 'Could not capture the desktop view.' >&2
  exit 75
fi
if ! run playwright-cli "-s=$BROWSER_SESSION" resize 390 844; then
  echo 'Could not set the mobile browser viewport.' >&2
  exit 75
fi
if ! run playwright-cli "-s=$BROWSER_SESSION" screenshot --filename "$CAPTURE_DIR/final-mobile.png"; then
  echo 'Could not capture the mobile view.' >&2
  exit 75
fi

for image in "$CAPTURE_DIR/final-desktop.png" "$CAPTURE_DIR/final-mobile.png"; do
  [[ -s "$image" ]] || { echo "Screenshot is missing or empty: $image" >&2; exit 1; }
done
echo "Captured desktop and mobile views in $CAPTURE_DIR"
