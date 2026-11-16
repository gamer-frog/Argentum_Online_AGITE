## Loop operativo (leer primero)

- Fuente de verdad: [`00_cerebro_loop/README.md`](00_cerebro_loop/README.md). Antes de actuar, leer `HANDOFF.md`, `TODO.md` y `DECISIONS.md`.
- Tomar **una sola** tarea de `TODO.md` → «Ahora». Si está bloqueada por una decisión, no inventar la respuesta: avanzar con la siguiente tarea no bloqueada.
- Toda tarea necesita alcance, no-objetivos y criterios de aceptación antes de tocar código.
- Verificar con `bash 00_cerebro_loop/verify.sh` y en navegador (escritorio y móvil, consola 0/0). Build verde no alcanza.
- Mantener `game.js` y `dist/game.js` sincronizados, junto con `index.html` y `styles.css` cuando corresponda.
- No hacer commit ni push sin pedido explícito del usuario. Si se pide publicar: fast-forward a `main`, nunca `--force`.
- No hacer «mejoras random» ni implementar mecánicas sin pedido o decisión registrada. Etiquetar la fidelidad como confirmada, aproximada o de práctica.
- Cerrar cada tarea actualizando `TODO.md`, `HANDOFF.md` y `HISTORY.md`; si cambia una decisión, `DECISIONS.md`.

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
