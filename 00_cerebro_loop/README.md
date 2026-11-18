# CEREBRO — manual operativo del loop

> **Estado:** activo · **Última auditoría:** 2026-11-16 · **Objetivo:** avanzar el clon exacto de Argentum Online en pasos pequeños, verificables y trazables.

Este archivo explica **cómo opera el loop**. No reemplaza a los pedidos del usuario: solo ordena el trabajo.

## 1. Fuente de verdad (leer en este orden)

| Orden | Archivo | Responde |
| --- | --- | --- |
| 1 | [`USER_REQUESTS.md`](USER_REQUESTS.md) | Qué pidió el usuario, con citas y estado. |
| 2 | [`DECISIONS.md`](DECISIONS.md) | Qué está decidido, qué está abierto y qué se asume mientras no haya respuesta. |
| 3 | [`TODO.md`](TODO.md) | Qué se hace **ahora** (una sola tarea) y qué sigue. |
| 4 | [`ROADMAP.md`](ROADMAP.md) | Orden completo del backlog y dependencias. |
| 5 | [`HANDOFF.md`](HANDOFF.md) | Estado actual, próximo paso y cómo retomar en 60 segundos. |
| 6 | [`HISTORY.md`](HISTORY.md) | Historial append-only de acciones verificadas. |
| 7 | [`PROTOCOL.md`](PROTOCOL.md) | Reglas de ejecución, verificación y reporte. |

**Precedencia ante conflicto:** `USER_REQUESTS` > `DECISIONS` > `TODO` > `ROADMAP` > `HANDOFF` > `HISTORY`.
`HANDOFF` nunca redefine alcance: solo describe estado.

## 2. Ciclo del loop (un ciclo = una tarea)

1. **Estado:** leer `HANDOFF.md`, `TODO.md` y `DECISIONS.md`. Confirmar que no hay una tarea a medio terminar.
2. **Elegir:** tomar **una sola** tarea de `TODO.md` → «Ahora». Si está bloqueada por una decisión, no inventar la respuesta: avanzar con la tarea no bloqueada siguiente y dejar la decisión registrada.
3. **Contrato:** escribir en la tarea el alcance, los **no-objetivos** y los criterios de aceptación antes de tocar código.
4. **Implementar:** cambios mínimos y compatibles con el código existente. Si el cambio toca `game.js`, `index.html` o `styles.css`, mantener `dist/` sincronizado.
5. **Verificar:** ejecutar `bash 00_cerebro_loop/verify.sh` y validar en navegador (escritorio y móvil) con consola 0 errores / 0 advertencias.
6. **Registrar:** marcar la tarea, agregar evidencia en `HISTORY.md` y actualizar `HANDOFF.md` con el próximo paso. Si cambió una decisión, actualizar `DECISIONS.md`. Si cambió el alcance visible, actualizar `README.md`.
7. **Publicar:** al cerrar cada tarea, integrar a `main` y pushear a `origin/main` (pedido del usuario, 2026-11-18: sin push el trabajo no queda guardado). Nunca `push --force`; si `main` divergió, merge sin force.

## 3. Cómo elegir la tarea

Orden de selección:

1. Un pedido nuevo del usuario en el turno actual.
2. La tarea marcada como **Ahora** en `TODO.md`.
3. La primera tarea **no bloqueada** de `ROADMAP.md`.
4. Una investigación necesaria para desbloquear una tarea (por ejemplo, verificar una regla en AO Libre), registrada como tarea propia.

No se permite:

- Tomar dos tareas de producto en un mismo ciclo.
- Abrir frentes nuevos por iniciativa propia («mejoras random»).
- Implementar una mecánica sin fuente o sin decisión registrada.
- Cambiar la lista de mapas, el layout global o el alcance de inventario sin decisión.

## 4. Definition of Ready

Una tarea está lista para empezar solo si tiene:

- [ ] Pedido o fuente identificable (`USER_REQUESTS`, README, referencia AO o decisión).
- [ ] Alcance y no-objetivos escritos.
- [ ] Criterios de aceptación observables.
- [ ] Dependencias resueltas o una asunción explícita.
- [ ] Forma de verificarlo (captura, probe, comparación o fuente).

## 5. Definition of Done

Una tarea está terminada solo si:

- [ ] Cumple todos los criterios de aceptación.
- [ ] `bash 00_cerebro_loop/verify.sh` termina en verde.
- [ ] Navegador validado a **1440×1000** y **390×844** (o el tamaño que exija la tarea), con consola 0/0.
- [ ] `dist/` está sincronizado con la fuente (`index.html`, `styles.css`, `game.js`, `favicon.svg`).
- [ ] La evidencia quedó registrada (ruta de captura, resultado de probe o cita de fuente).
- [ ] `TODO.md`, `HANDOFF.md` y `HISTORY.md` reflejan el nuevo estado.
- [ ] Las limitaciones y lo que sigue pendiente están explícitos.

**Un build verde no es suficiente.** Si no se verificó en navegador, la tarea no está terminada.

## 6. Etiquetas de fidelidad

Todo lo que se afirme sobre AO debe llevar una de estas etiquetas:

- **Confirmado:** verificado contra una fuente concreta (código/datos de AO Libre, captura con versión, manual con fecha).
- **Aproximado:** implementado por comparación razonable, sin fuente exacta.
- **Práctica:** decisión del prototipo para que la práctica sea jugable (por ejemplo, pociones infinitas o maná de práctica).

No presentar una aproximación o una decisión de práctica como «auténtica». Si falta la fuente, la tarea correcta es **investigar**, no inventar.

## 7. Verificación

Preflight automático:

```bash
bash 00_cerebro_loop/verify.sh
```

Validación manual obligatoria:

```bash
PORT=3002 bash start.sh          # servidor persistente
playwright-cli open http://localhost:3002
playwright-cli console            # debe mostrar 0 errores / 0 advertencias
```

Comprobaciones mínimas:

- El canvas pinta y el combate sigue activo.
- Los controles de la tarea funcionan con teclado, mouse y, si aplica, táctil.
- No hay overflow horizontal ni contenido cortado a 320, 390 y 1440 px.
- No se rompió ninguna función existente (movimiento, objetivo, ataque, hechizos, pociones, pausa, reinicio).
- Las capturas se guardan fuera del repo, en `/tmp/opencode/shots/`.

## 8. Estado actual (2026-11-16)

- **Build:** verde; `dist/` sincronizado.
- **Completado:** `T1 — Inventario/equipamiento, fase 1 visual`; `T2 — Rotación de mapas` (lista 1→34→59→62→272, inicio distinto y rotación cada 5 bajas); `T3 — Auditoría de FX de hechizos` (`roadmap/fx-hechizos.md`); `T4 — Matriz de combate vs AO Libre` ([`roadmap/reglas-combate.md`](../roadmap/reglas-combate.md)); `T5 — Combo, maná y Fuente de vida`; `T6 — Ritmos de combate y persecución`; `T9 — Escenarios 1v1/2v2/3v3`; `T11 — Licencias y atribución` ([`roadmap/licencias-recursos.md`](../roadmap/licencias-recursos.md)); `T12 — Referencia visual versionada` ([`roadmap/referencia-visual.md`](../roadmap/referencia-visual.md)).
- **Ahora:** `T8 — Chat lateral local (sin audio nuevo)`.
- **Bloqueado:** `T7` (decisión `D2`); `T8b` (sonidos) queda condicionado por la autoría/licencia de audio (`L5`).
- **Decisión abierta:** `D2=B` (inventario funcional) y propuestas de balance de `T5` (`D7`).
- **Regla de publicación:** al cerrar cada tarea, commit, integración y push a `origin/main`; nunca `--force` (`D5`).
