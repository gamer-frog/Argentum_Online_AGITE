#!/usr/bin/env bash
set -Eeuo pipefail

run() {
  /usr/bin/time -p "$@"
}

CAPTURE_URL="${CAPTURE_URL:?Set CAPTURE_URL to the exact page URL to capture}"
CAPTURE_DIR="${CAPTURE_DIR:-${RUNNER_TEMP:-/home/runner/work/_temp}/captures}"
PROJECT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd -P)"
BROWSER_OPEN=false

close_browser() {
  if [[ "$BROWSER_OPEN" == true ]]; then
    run playwright-cli close >/dev/null 2>&1 || true
    BROWSER_OPEN=false
  fi
}
trap close_browser EXIT

[[ "$CAPTURE_URL" =~ ^https?://[^[:space:]]+$ ]] || { echo 'CAPTURE_URL must be an HTTP(S) URL.' >&2; exit 1; }
run mkdir -p "$CAPTURE_DIR"
CAPTURE_DIR="$(run realpath "$CAPTURE_DIR")"
case "$CAPTURE_DIR/" in
  "$PROJECT_DIR/"*) echo 'CAPTURE_DIR must be outside the project source tree.' >&2; exit 1 ;;
esac

# Navigation and browser startup failures are commonly transient in the preview infrastructure.
BROWSER_OPEN=true
if ! run playwright-cli open "$CAPTURE_URL"; then
  echo 'Could not open the requested page in the browser.' >&2
  exit 75
fi

# Wait for the game canvas to paint real pixels, not just for the document shell to load.
if ! render_state="$(run playwright-cli eval '() => new Promise(resolve => { const started = Date.now(); const check = () => { const shell = document.querySelector(".client-window"); const canvas = document.querySelector("canvas#game"); if (!shell || !canvas) { resolve("CAPTURE_RENDER_DEFECT"); return; } if (document.readyState === "complete" && shell.getBoundingClientRect().width > 0 && canvas.width > 0 && canvas.height > 0) { const ctx = canvas.getContext("2d"); const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height).data; let painted = false; for (let i = 3; i < pixels.length; i += 4) { if (pixels[i] > 0) { painted = true; break; } } if (painted && (document.body.innerText || "").includes("ARGENTUM ONLINE")) { resolve("CAPTURE_READY"); return; } } if (Date.now() - started > 30000) { resolve("CAPTURE_RENDER_DEFECT"); return; } requestAnimationFrame(check); }; check(); })' 2>&1)"; then
  echo 'Browser could not inspect the rendered page.' >&2
  echo "$render_state" >&2
  exit 75
fi
if [[ "$render_state" != *CAPTURE_READY* ]]; then
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
