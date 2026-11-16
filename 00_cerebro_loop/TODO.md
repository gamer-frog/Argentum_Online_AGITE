# TODO — cola viva

> **Actualizado:** 2026-11-16. **Regla:** una sola tarea en «Ahora». Las bloqueadas no detienen el loop.
> Orden completo y dependencias: [`ROADMAP.md`](ROADMAP.md). Decisiones: [`DECISIONS.md`](DECISIONS.md).

## Ahora

### T4 — Matriz de reglas del combate actual vs AO Libre (primer corte)

**Estado:** lista para empezar.
**Depende de:** nada; `D1` no la bloquea.
**Pedido:** contrastar ataques, hechizos, alcance, direcciones, tiempos, requisitos, estados, costos de maná y nivel 40 con etiqueta confirmado/aproximado/práctica (`USER_REQUESTS.md`).

**Alcance del primer corte**

- Inventariar solo las reglas implementadas en `game.js` que afectan al combate actual: ataque adyacente, recuperación, pociones, alcance de hechizos, apuntado/telegrafiado, inmovilización/remoción y costos de maná.
- Para cada regla: valor implementado, archivo/línea, fuente AO Libre fijada y etiqueta (`confirmado`, `aproximado` o `práctica`).
- Escribir la matriz en `roadmap/reglas-combate.md` y enlazarla desde `README.md`.

**No incluye**

- Cambiar balance, daños, costos o tiempos.
- Extraer assets nuevos ni interpretar la ausencia de un dato como valor cero.
- Cubrir todavía el inventario funcional o el multijugador.

**Criterios de aceptación**

- [ ] Cada fila tiene valor implementado, ubicación en el código, fuente y etiqueta.
- [ ] Lo que no tenga fuente AO Libre dice explícitamente `sin dato`, no se completa por intuición.
- [ ] No se toca código de producto; si se tocara, `verify.sh` + navegador 1440/390 + consola 0/0.
- [ ] Evidencia y próximo paso en `HISTORY.md` y `HANDOFF.md`.

## Bloqueadas / requieren decisión

- **D2 — Alcance de inventario/equipo:** A visual ejecutado en T1; B funcional mínimo sigue pendiente de decisión.
- **Auditoría de licencias por recurso:** necesaria antes de redistribuir o ampliar assets; no bloquea el desarrollo local.
- **Referencia visual estable con versión/fecha:** deseable; la galería oficial alcanza para estilo/layout, no para fidelidad de píxeles.

## Terminadas recientemente

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
