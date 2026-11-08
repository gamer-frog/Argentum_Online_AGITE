# BOOT

- [x] Paso 1: actualizar refs con `git fetch origin`; inventario: 29 checkpoints, 23 resumes, 4 deployments.
- [x] Paso 2: crear `00_cerebro_loop/` con cinco archivos de seguimiento.
- [x] Paso 3: se intentó `origin/opencode-checkpoints/39`; el merge dio conflictos add/add solo en archivos de seguimiento/documentación, se abortó y se preservó el tip con `graveyard-opencode-checkpoints-39`.
- [x] Paso 4: se preservaron los tips de 51 refs con tags locales `graveyard-boot-*` y se borraron del remoto; solo queda checkpoint 39 como sesión activa, verificado con `git fetch --prune`.
- [x] Paso 5: merge limpio de `origin/main`; verificación Chromium aprobada con capturas desktop/mobile, canvas visible, ocho personajes, recursos HTTP 200 y consola 0 errores/advertencias. Cierre documental publicado a `main` mediante fast-forward; tags `save-000` y `save-001` creados después de las verificaciones aprobadas.
- [x] Continuación 2026-11-08: se preservó el nuevo tip `306cac6` con `graveyard-opencode-checkpoints-40-tip-306cac6` y se integró por fast-forward. En la continuación documental se detectó una ref remota anterior `6e216f0` que persistía y contenía solo metadatos; se guardó con `graveyard-opencode-checkpoints-40-ref-6e216f0`, se eliminó y `git fetch --prune`/`git ls-remote` confirmaron cero ramas remotas `opencode-checkpoints/*` y `opencode-resume/*`.
- [x] 2026-11-08: recuperar las solicitudes de producto del historial en `roadmap/producto-recuperado.md`, sin modificar código.
