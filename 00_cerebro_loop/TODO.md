# TODO — cola viva

> **Actualizado:** 2026-11-18. **Regla:** una sola tarea en «Ahora». Las bloqueadas no detienen el loop.
> Orden completo y dependencias: [`ROADMAP.md`](ROADMAP.md). Decisiones: [`DECISIONS.md`](DECISIONS.md).

## Ahora

### T6 — Variar ritmos de combate y persecución (sin balance)

**Estado:** lista para empezar; `T4` y `T5` ya dejaron la referencia y la medición.
**Depende de:** `T4` + playtest de `T5` (hecho el 2026-11-18).
**Pedido:** «Variar momentos de inmovilización/remoción/curación/ataque; persecución menos predecible; evitar oscilaciones, bloqueos y pares quietos cara a cara» (`USER_REQUESTS.md`).

**Alcance**

- Medir los patrones repetidos actuales: cooldowns fijos de hechizos, intervalo de ataque, pausas de la IA y persecución.
- Introducir variación dentro de los valores vigentes (jitter de tiempos y de decisión), **sin** cambiar daños, costos, curaciones, alcances ni reglas.
- Detectar y corregir oscilaciones o bloqueos: dos actores que se persiguen sin cerrar distancia, NPC plantado sin objetivo, pares cara a cara que no atacan.
- Conservar el comportamiento observable: nadie quieto, blancos congelados prioritarios y mago que no entra a melee.

**No incluye**

- Cambios de balance (costos, daños, curaciones): las propuestas de `T5` siguen pendientes de aprobación.
- Terminología AO de los mensajes: requiere una referencia fija (`T12`/`D6`) que todavía no existe.
- Inventario funcional (`D2=B`), multijugador o assets nuevos.

**Criterios de aceptación**

- [ ] Playtest de 90 s antes/después con métricas: % de tiempo en movimiento por bot, pares a distancia 1 sin atacar, tiempo inmóvil sin objetivo y lanzamientos por bot.
- [ ] Sin cambios en daños, costos, alcances ni reglas.
- [ ] `game.js` + `dist/game.js`, `bash 00_cerebro_loop/verify.sh` y navegador 1440/390 con consola 0/0.
- [ ] Evidencia y próximo paso en `HISTORY.md` y `HANDOFF.md`.

## Bloqueadas / requieren decisión

- **D2 — Alcance de inventario/equipo:** A visual ejecutado en T1; B funcional mínimo sigue pendiente de decisión.
- **Propuestas de balance de T5 (D7):** `Remover parálisis` 330 → 300 y `Fuente de vida` 25-32 → 30-45 quedaron documentadas con fuente y efecto, pero **no aplicadas**; requieren aprobación explícita.
- **Auditoría de licencias por recurso:** necesaria antes de redistribuir o ampliar assets; no bloquea el desarrollo local.
- **Referencia visual estable con versión/fecha:** deseable; la galería oficial alcanza para estilo/layout, no para fidelidad de píxeles.

## Terminadas recientemente

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
