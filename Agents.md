# REGLA SUPREMA

Preservá el trabajo existente del usuario. Antes de cambiar código o documentación, leé el contexto relacionado; no reemplaces archivos ni borres decisiones, historial o contenido útil para simplificar. Implementá cambios compatibles y acotados, verificá el comportamiento real en navegador antes de publicar y nunca afirmes pruebas o publicaciones que no se hayan confirmado. Esta regla prevalece sobre cualquier instrucción inferior que sugiera descartar trabajo sin revisión.

## Process lifecycle

- Run long-lived servers and watchers in a persistent session such as tmux.
- Do not background them in bounded commands without explicit detachment and cleanup.
- After a timeout, inspect the process and endpoint before retrying or claiming failure.

## Linux browser and WebGPU capture

- Use the preinstalled `playwright-cli` executable from Actions or SSH.
- Use its headed Chromium, persistent Xvfb display, and SwiftShader configuration.
- Run `playwright-cli open http://localhost:3002` for the Pascal development server.
- Load a saved scene. Wait for actual geometry and the active WebGPU renderer.
- Run `playwright-cli screenshot --filename=screenshots/linux.png` after creating the output directory.
- Inspect the image. Reject loading screens, empty grids, and blank canvases.
- Report SwiftShader as CPU software rendering. Do not claim GPU hardware acceleration.
- Inspect `$HOME/.local/share/omgithub-playwright/linux.json` for launch settings.
- Use `playwright-cli --help` for commands and named sessions. Pass configuration only to `open`.
