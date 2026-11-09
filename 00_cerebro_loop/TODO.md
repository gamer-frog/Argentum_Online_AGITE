# TODO

- [x] Paso 4 (histórico): se eliminaron 51 refs remotas de checkpoints/resumes y sus tips quedaron resguardados como tags locales `graveyard-boot-*`; checkpoint 39 fue preservado entonces como sesión activa. Esto no implica que hoy no haya refs remotas.
- [x] Paso 5: merge limpio de `origin/main`; navegador verificado con capturas desktop/mobile, canvas visible, ocho personajes, recursos HTTP 200 y consola limpia. Cierre publicado en `main` mediante fast-forward; tags `save-000` y `save-001` creados tras confirmar cada push.
- [x] Continuación BOOT: checkpoint 40 (`306cac6`) preservado con tag local, integrado por fast-forward y retirado del remoto. La ausencia de refs fue verificada en esa fecha; las refs actuales se registran en `CEMETERY.md`.
- [x] Fundación del cerebro: mantener el protocolo de trabajo, documentar el estado/límites reales del prototipo y añadir la regla suprema al inicio de `Agents.md` preservando el resto.
- [x] Validación de navegador de la fundación: Chromium cargó la app en `http://localhost:3002`; canvas/escena visibles, controles básicos probados y consola con cero errores/advertencias. Captura guardada en `screenshots/brain-foundation.png`.
- [x] Reconciliar HANDOFF/ROADMAP/TODO/CEMETERY con el estado verificado: rama `opencode/42552277598`, `HEAD == origin/main == 8900ab9d6562c738280cffa5f22052f1b76014d9`; refs actuales listadas en `CEMETERY.md`.
- [x] Evaluar checkpoint 44 sin merge: no es fast-forward; el panel se ve en móvil, pero se abre fuera de pantalla en desktop. No se reprodujo el cambio; el panel actual permanece visible en desktop y queda más abajo en el flujo móvil. No se hizo cambio de interfaz/código.
- [ ] Producto, prioridad 0: fijar una referencia visual AO y auditar licencias/atribución específicas por recurso; mantener explícito el alcance pendiente en `roadmap/producto-recuperado.md`.
- [ ] Si se prioriza el problema móvil del panel, diseñar una solución móvil específica y validar desktop/móvil y consola antes de publicar; no portar la reubicación del checkpoint 44 tal cual.
