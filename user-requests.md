# User requests

- [x] BOOT (2026-11-08): cinco pasos completados. Se preservó el checkpoint 39, limpiaron 51 refs remotas con respaldo en tags locales, integró `origin/main` sin conflictos y verificó Chromium (capturas desktop/mobile, recursos HTTP 200, consola limpia). Cierre publicado a `main` mediante fast-forward; tags `save-000` y `save-001` creados tras confirmar cada publicación.
- [x] Continuación BOOT (2026-11-08): preservado e integrado el tip actualizado del checkpoint 40 (`306cac6`); la ref remota anterior `6e216f0` persistía y contenía solo metadatos de sesión, por lo que se respaldó con `graveyard-opencode-checkpoints-40-ref-6e216f0` y se eliminó. `git fetch --prune` confirmó que no quedan ramas `opencode-checkpoints/*` ni `opencode-resume/*`.
- [x] Recuperar y organizar solicitudes de producto del historial en `roadmap/producto-recuperado.md`, separando requisitos, estados parciales y decisiones pendientes; sin cambios de código.
