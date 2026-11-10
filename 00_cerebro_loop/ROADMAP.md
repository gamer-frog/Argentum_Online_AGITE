# ROADMAP

- [x] Paso 1: actualizar refs con `git fetch origin` e inventariar 29 checkpoints, 23 resumes y 4 deployments.
- [x] Paso 2: crear los cinco archivos de seguimiento en `00_cerebro_loop/`.
- [x] Paso 3: intentar merge de checkpoint 39; conflictos add/add documentales, merge abortado y tip preservado con `graveyard-opencode-checkpoints-39`.
- [x] Paso 4: preservar tips en tags locales `graveyard-*` y eliminar las refs remotas `opencode-checkpoints/*` y `opencode-resume/*`, incluidos los tips 39 y 40 preservados en sus tags de cementerio. `git fetch --prune` y `git ls-remote` verificados.
- [x] Paso 5: merge de `origin/main` limpio; validación en Chromium aprobada (capturas desktop/mobile, canvas visible, ocho personajes y consola 0 errores/advertencias). Cierre publicado mediante fast-forward a `main`; tags `save-000`, `save-001` y `save-004` creados tras verificaciones aprobadas.
- [x] Revisar `roadmap/` y `todo.md` tras cerrar el BOOT: no se inició trabajo de producto sin alcance acordado. La referencia visual AO y la auditoría de licencias/atribución siguen pendientes; ver `roadmap/producto-recuperado.md`.
- [x] Continuación BOOT 2026-11-08: preservar `306cac6` con `graveyard-opencode-checkpoints-40-tip-306cac6`, integrarlo por fast-forward y eliminar `opencode-checkpoints/40`; la comprobación de cero refs fue válida en ese momento, no describe el estado remoto actual.
- [x] Fundación del cerebro: conservar y completar `PROTOCOL.md`, actualizar el handoff y anteponer la regla suprema a `Agents.md` sin eliminar las instrucciones existentes.
- [x] Verificación de la fundación: iniciar el prototipo en `localhost:3002`, inspeccionar canvas/escena, probar controles básicos y confirmar cero errores/advertencias de consola en Chromium.
- [x] Reconciliar seguimiento con Git: `HEAD == origin/main == 8900ab9d6562c738280cffa5f22052f1b76014d9` al comprobarlo; árbol limpio antes de editar estos registros. `git ls-remote` confirma actualmente refs 43–46 y `opencode-resume/c2d354ee2056e76a0b33`; inventariadas en `CEMETERY.md`.
- [x] Evaluar checkpoint 44 sin integrarlo: no es fast-forward de `origin/main`; su panel en `.world-window` se abre fuera de pantalla en desktop (x=-268), aunque visible en móvil. El panel actual es visible en desktop; en móvil aparece más abajo en el flujo (y≈439). No se reprodujo el cambio.
- [x] Extracción de recursos: ampliar `scripts/extract_ao_assets.py` para aceptar `--map` repetido, extraer mapas 2 y 3 y generar manifiesto de hashes; verificar mapas, hashes y copia de compatibilidad; actualizar inventario, atribución y handoff. No implica nueva verificación del navegador ni publicación.
- [ ] Producto: elegir una referencia visual AO estable y completar la auditoría de licencias/atribución por recurso antes de ampliar o redistribuir assets; ver `roadmap/producto-recuperado.md` e `inventario-recursos-ao.md`.
