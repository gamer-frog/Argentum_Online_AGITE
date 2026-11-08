# ROADMAP

- [x] Paso 1: actualizar refs con `git fetch origin` e inventariar 29 checkpoints, 23 resumes y 4 deployments.
- [x] Paso 2: crear los cinco archivos de seguimiento en `00_cerebro_loop/`.
- [x] Paso 3: intentar merge de checkpoint 39; conflictos add/add documentales, merge abortado y tip preservado con `graveyard-opencode-checkpoints-39`.
- [x] Paso 4: preservar tips en tags locales `graveyard-*` y eliminar las refs remotas `opencode-checkpoints/*` y `opencode-resume/*`, incluidos los tips 39 y 40 preservados en sus tags de cementerio. `git fetch --prune` y `git ls-remote` verificados.
- [x] Paso 5: merge de `origin/main` limpio; validación en Chromium aprobada (capturas desktop/mobile, canvas visible, ocho personajes y consola 0 errores/advertencias). Cierre publicado mediante fast-forward a `main`; tags `save-000`, `save-001` y `save-004` creados tras verificaciones aprobadas.
- [x] Revisar `roadmap/` y `todo.md` tras cerrar el BOOT: no hay tareas de producto pendientes con alcance definido; backlog vacío, se pausa sin iniciar cambios ajenos.
- [x] Continuación BOOT 2026-11-08: preservar `306cac6` con `graveyard-opencode-checkpoints-40-tip-306cac6`, integrarlo por fast-forward y eliminar `opencode-checkpoints/40`; `git fetch --prune`/`git ls-remote` confirman cero refs remotas checkpoints/resumes.
