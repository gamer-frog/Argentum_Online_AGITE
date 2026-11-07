#!/usr/bin/env bash
set -Eeuo pipefail

run() {
  /usr/bin/time -p "$@"
}

CAPTURE_URL="${CAPTURE_URL:?Set CAPTURE_URL to the exact page URL to capture}"
CAPTURE_DIR="${CAPTURE_DIR:-${RUNNER_TEMP:-/home/runner/work/_temp}/captures}"
BROWSER_OPEN=false

close_browser() {
  if [[ "$BROWSER_OPEN" == true ]]; then
    run playwright-cli close >/dev/null 2>&1 || true
    BROWSER_OPEN=false
  fi
}
trap close_browser EXIT

[[ "$CAPTURE_URL" =~ ^https?:// ]] || { echo 'CAPTURE_URL must be an HTTP(S) URL.' >&2; exit 1; }
run mkdir -p "$CAPTURE_DIR"

# Navigation and browser startup failures are commonly transient in the preview infrastructure.
if ! run playwright-cli open "$CAPTURE_URL"; then
  echo 'Could not open the requested page in the browser.' >&2
  exit 75
fi
BROWSER_OPEN=true

if ! render_state="$(run playwright-cli eval '() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve(JSON.stringify({ready: document.readyState === "complete", title: document.title, page: Boolean(document.querySelector(".client-window")), visible: Boolean(document.querySelector(".client-window")?.getBoundingClientRect().width), content: (document.body?.innerText || "").includes("ARGENTUM ONLINE")})))))' 2>&1)"; then
  echo 'Browser could not inspect the rendered page.' >&2
  echo "$render_state" >&2
  exit 75
fi
if [[ "$render_state" != *'"ready":true'* || "$render_state" != *'"page":true'* || "$render_state" != *'"visible":true'* || "$render_state" != *'"content":true'* ]]; then
  echo "The page loaded but required application content did not render: $render_state" >&2
  exit 1
fi

if ! run playwright-cli resize 1440 1000; then
  echo 'Could not set the desktop browser viewport.' >&2
  exit 75
fi
if ! run playwright-cli screenshot --filename "$CAPTURE_DIR/final-desktop.png"; then
  echo 'Could not capture the desktop view.' >&2
  exit 75
fi
if ! run playwright-cli resize 390 844; then
  echo 'Could not set the mobile browser viewport.' >&2
  exit 75
fi
if ! run playwright-cli screenshot --filename "$CAPTURE_DIR/final-mobile.png"; then
  echo 'Could not capture the mobile view.' >&2
  exit 75
fi

for image in "$CAPTURE_DIR/final-desktop.png" "$CAPTURE_DIR/final-mobile.png"; do
  [[ -s "$image" ]] || { echo "Screenshot is missing or empty: $image" >&2; exit 1; }
done
echo "Captured desktop and mobile views in $CAPTURE_DIR"
