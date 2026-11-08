# BOOT

- [x] Paso 1: actualizar refs con `git fetch origin`; inventario: 29 checkpoints, 23 resumes, 4 deployments.
- [x] Paso 2: crear `00_cerebro_loop/` con cinco archivos de seguimiento.
- [x] Paso 3: se intentó `origin/opencode-checkpoints/39`; el merge dio conflictos add/add solo en archivos de seguimiento/documentación, se abortó y se preservó el tip con `graveyard-opencode-checkpoints-39`.
- [x] Paso 4: se preservaron los tips de 51 refs con tags locales `graveyard-boot-*` y se borraron del remoto; solo queda checkpoint 39 como sesión activa, verificado con `git fetch --prune`.
- [ ] Paso 5: commitear todo antes de mergear `origin/main`; si hay conflicto de código, abortar y crear `pending-boot`. Después completar evidencia visual/logs (HTTP 404 previo) y publicar solo si navegador/consola y fast-forward son seguros.
