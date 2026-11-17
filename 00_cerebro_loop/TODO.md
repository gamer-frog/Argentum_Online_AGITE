# TODO — cola viva

> **Actualizado:** 2026-11-16. **Regla:** una sola tarea en «Ahora». Las bloqueadas no detienen el loop.
> Orden completo y dependencias: [`ROADMAP.md`](ROADMAP.md). Decisiones: [`DECISIONS.md`](DECISIONS.md).

## Ahora

### T5 — Combo, maná y `Fuente de vida` (confirmación y propuesta)

**Estado:** lista para empezar; `T4` ya dejó la referencia.
**Depende de:** `T4` (completada).
**Pedido:** confirmar la equivalencia `Curar heridas graves` vs `Sanar`; evaluar `Fuente de vida` 30-45 (wiki 2012); medir el agotamiento de maná del paladín con los costos actuales (`USER_REQUESTS.md`).

**Alcance**

- Cruzar los tres puntos con [`roadmap/reglas-combate.md`](../roadmap/reglas-combate.md) y [`roadmap/hechizos-referencia.md`](../roadmap/hechizos-referencia.md).
- Medir en combate real cuántos `Remover parálisis` puede lanzar el paladín antes de quedarse sin maná y si necesita apoyo.
- Proponer ajustes concretos con fuente y etiqueta. **No aplicar cambios de balance sin aprobación explícita.**

**No incluye**

- Inventario funcional (`D2=B`), multijugador o assets nuevos.
- Cambiar nombres o daños por intuición.

**Criterios de aceptación**

- [ ] Cada propuesta tiene valor actual, fuente, etiqueta y efecto esperado.
- [ ] Si no hay fuente para un valor, se dice `sin dato` y no se inventa.
- [ ] Si se aprueba tocar código: `game.js` + `dist/game.js`, `verify.sh` y navegador 1440/390 con consola 0/0.
- [ ] Evidencia y próximo paso en `HISTORY.md` y `HANDOFF.md`.

## Bloqueadas / requieren decisión

- **D2 — Alcance de inventario/equipo:** A visual ejecutado en T1; B funcional mínimo sigue pendiente de decisión.
- **Auditoría de licencias por recurso:** necesaria antes de redistribuir o ampliar assets; no bloquea el desarrollo local.
- **Referencia visual estable con versión/fecha:** deseable; la galería oficial alcanza para estilo/layout, no para fidelidad de píxeles.

## Terminadas recientemente

- [x] **P — Puntería libre al arrastrar + riel de hechizos a la derecha (2026-11-16, formato final P2 el 2026-11-17).** Mira vectorial estilo Wild Rift (nace en el personaje, la orienta el arrastre, engancha objetivos) y riel de una columna × 6 sobre el borde derecho del mundo. Sin cambios de reglas ni de balance. Evidencia en `HISTORY.md`.
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
