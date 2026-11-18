# TODO — cola viva

> **Actualizado:** 2026-11-18. **Regla:** una sola tarea en «Ahora». Las bloqueadas no detienen el loop.
> Orden completo y dependencias: [`ROADMAP.md`](ROADMAP.md). Decisiones: [`DECISIONS.md`](DECISIONS.md).

## Ahora

### T9 — Escenarios de práctica 1v1, 2v2 y 3v3 con selector de formato

**Estado:** lista para empezar. Es la primera tarea desbloqueada del roadmap: `T7` depende de `D2` y `T8` de la auditoría de licencias.
**Depende de:** `T1` y `T5` (hechos) y la arena (mapa 272) ya integrada en `T2`.
**Pedido:** «Escenarios de práctica 1v1, 2v2 y 3v3 con selector de formato» (`USER_REQUESTS.md`).

**Alcance**

- Agregar un selector visible de formato **1v1 / 2v2 / 3v3** para la arena, sin duplicar el HTML de los combatientes.
- Reutilizar la arena 272 y sus dos spawns; completar cada equipo con los actores existentes (el jugador ocupa un cupo del equipo sagrado).
- Indicar el formato activo en el HUD junto al nombre del mapa.
- Mantener intacta la rotación de ciudad de `D1`: el formato aplica cuando se juega la arena.

**No incluye**

- Matchmaking, red, puntaje, rankings, balance nuevo o condiciones de victoria (`D4` sigue cerrada).
- Inventario funcional (`D2=B`), hechizos nuevos o assets nuevos.

**Criterios de aceptación**

- [ ] Los tres formatos se pueden elegir y la arena muestra la cantidad correcta de combatientes por equipo.
- [ ] Sin cambios en daños, costos, curaciones, alcances ni reglas de combate.
- [ ] `game.js` + `dist/game.js`, `bash 00_cerebro_loop/verify.sh` y navegador 1440/390 con consola 0/0.
- [ ] Evidencia y próximo paso en `HISTORY.md` y `HANDOFF.md`.

## Bloqueadas / requieren decisión

- **D2 — Alcance de inventario/equipo:** A visual ejecutado en T1; B funcional mínimo sigue pendiente de decisión.
- **Propuestas de balance de T5 (D7):** `Remover parálisis` 330 → 300 y `Fuente de vida` 25-32 → 30-45 quedaron documentadas con fuente y efecto, pero **no aplicadas**; requieren aprobación explícita.
- **Auditoría de licencias por recurso:** necesaria antes de redistribuir o ampliar assets; no bloquea el desarrollo local.
- **Referencia visual estable con versión/fecha:** deseable; la galería oficial alcanza para estilo/layout, no para fidelidad de píxeles.

## Terminadas recientemente

- [x] **T6 — Ritmos de combate y persecución (2026-11-18).** La variación de ritmo ya existía y se midió; el único bloqueo real era el mago acosado, que retrocedía sin lanzar durante hasta 10,75 s porque la rama de retirada cortaba antes de los hechizos. Ahora lanza mientras se despega y el tramo máximo bajo presión bajó a 1,75 s. Sin cambios de daños, costos, curaciones ni alcances; pares adyacentes sin bloqueo (máximo 1,25 s, intervalo normal de golpe). Evidencia en `HISTORY.md`.
- [x] **T5 — Combo, maná y `Fuente de vida` (2026-11-18).** `Sanar` no equivale a `Curar Heridas Graves` (AO 12-35/40 vs 40-45/220); `Fuente de vida` 30-45 queda como propuesta `práctica`; el paladín agota su maná para limpiarse en combate real (mínimos 13-85, 23 muestras paralizado con <330) y necesita apoyo. Propuestas con fuente y etiqueta, sin aplicar. Evidencia en `HISTORY.md` y [`roadmap/reglas-combate.md`](../roadmap/reglas-combate.md#capacidad-de-maná-del-paladín-t5).
- [x] **T4 — Matriz de reglas del combate actual vs AO Libre, primer corte (2026-11-16).** Matriz en [`roadmap/reglas-combate.md`](../roadmap/reglas-combate.md) con ataque adyacente, intervalos, daño, alcance, apuntado, inmovilización/remoción, costos de maná, stamina, pociones y nivel 40; cada fila con código, fuente y etiqueta. Sin cambios de código. Evidencia en `HISTORY.md`.
- [x] **T2 — Rotación de mapas (2026-11-16).** Lista fija Ullathorpe → Nix → Banderbill → Lindos → Arena; inicio aleatorio sin repetir el anterior al reiniciar; avance cada 5 bajas y fallback. Rotación completa verificada en navegador (5 cambios, 25 bajas) y capturas de los cinco mapas. Evidencia en `HISTORY.md`.
- [x] **T3 — Auditoría de FX de hechizos (2026-11-16).** Tabla de los 8 hechizos: 1 original, 3 reutilizados y 4 en reserva; recursos, Grh, WAV y límites trazados en `roadmap/fx-hechizos.md`. Sin cambios de código.
- [x] **T1 — Inventario/equipamiento, fase 1 visual (2026-11-16).** Grilla 5×7/35, equipo 2×2, títulos AO, ranuras biseladas y densidad ajustada; sin mecánicas. Verificado a 1023×770, 1440×1000, 390×844 y 320×720; consola 0/0. Evidencia en `HISTORY.md`.
- [x] **Loop funcional (2026-11-16):** manual operativo, decisiones, cola única, historial separado, preflight y punteros legacy.
- [x] **Comparación visual y ataque aislado (2026-11-15):** panel derecho más denso en la referencia; daño `-90` confirmado sobre `chaoticPaladin`; sin cambio de layout.
- [x] **HUD sin contador de bajas (2026-11-14):** PvP infinito sin marcador; `dist/` sincronizado.
- [x] **`ERRADO` sobre el lanzador (2026-11-14):** las tres rutas de fallo anclan el texto al actor.
- [x] **Hechizos clickeados siguen al rival (2026-11-14):** daño e Inmovilizar resuelven aunque el blanco se mueva.
- [x] **Nombre del hechizo sobre el lanzador (2026-11-14):** verificado en combate real; sin cambios de código.

## Historial completo

Las tareas cerradas y su evidencia están en [`HISTORY.md`](HISTORY.md). No duplicar aquí el historial.
