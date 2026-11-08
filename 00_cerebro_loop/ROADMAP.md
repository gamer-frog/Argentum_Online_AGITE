# ROADMAP

- [x] Paso 1: actualizar refs con `git fetch origin` e inventariar 29 checkpoints, 23 resumes y 4 deployments.
- [x] Paso 2: crear los cinco archivos de seguimiento en `00_cerebro_loop/`.
- [x] Paso 3: intentar merge de checkpoint 39; conflictos add/add documentales, merge abortado y tip preservado con `graveyard-opencode-checkpoints-39`.
- [x] Paso 4: preservar tips en 51 tags locales `graveyard-boot-*` y eliminar 51 refs remotas; conservar checkpoint 39 como sesión activa. `git fetch --prune` verificado.
- [ ] Paso 5: mergear `origin/main` tras commit de todos los cambios; ante conflicto de código, abortar y crear `pending-boot`. Luego completar evidencia visual/logs (HTTP 404 previo) y publicar solo si la verificación y el fast-forward son seguros.
- [ ] Reanudar el backlog de producto únicamente después de cerrar el BOOT.
