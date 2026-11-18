# TODO — cola viva

> **Actualizado:** 2026-11-18. **Regla:** una sola tarea en «Ahora». Las bloqueadas no detienen el loop.
> Orden completo y dependencias: [`ROADMAP.md`](ROADMAP.md). Decisiones: [`DECISIONS.md`](DECISIONS.md).

## Ahora

### T11 — Auditoría de licencias y atribución por recurso

**Estado:** lista para empezar. Es la siguiente tarea desbloqueada: `T7` depende de `D2` y `T8` de esta auditoría.
**Depende de:** nada; usa el inventario de recursos ya documentado.
**Pedido:** «Auditoría de licencias/atribuciones por recurso antes de redistribuir» (`USER_REQUESTS.md`).

**Alcance**

- Inventariar las familias de recursos de `assets/ao/` (mapas, gráficos, personajes, FX, audio, datos) y su origen declarado.
- Contrastar cada familia con la licencia o términos del repositorio de origen y con lo que ya dice `roadmap/inventario-recursos-ao.md`.
- Registrar una tabla con: recurso, origen, licencia/términos, atribución requerida y estado (`confirmado`, `aproximado`, `sin dato`).
- Marcar explícitamente qué se puede redistribuir y qué no.

**No incluye**

- Cambiar, extraer o borrar assets.
- Publicar avisos legales definitivos ni chat/sonidos nuevos (`T8`).
- Tocar código de producto.

**Criterios de aceptación**

- [ ] Tabla completa por familia de recursos, con fuente y etiqueta de fidelidad.
- [ ] Lista explícita de bloqueos para redistribuir y de atribuciones obligatorias.
- [ ] Enlaces locales válidos y `bash 00_cerebro_loop/verify.sh` verde.
- [ ] Evidencia y próximo paso en `HISTORY.md` y `HANDOFF.md`.

## Bloqueadas / requieren decisión

- **D2 — Alcance de inventario/equipo:** A visual ejecutado en T1; B funcional mínimo sigue pendiente de decisión.
- **Propuestas de balance de T5 (D7):** `Remover parálisis` 330 → 300 y `Fuente de vida` 25-32 → 30-45 quedaron documentadas con fuente y efecto, pero **no aplicadas**; requieren aprobación explícita.
- **Auditoría de licencias por recurso:** necesaria antes de redistribuir o ampliar assets; no bloquea el desarrollo local.
- **Referencia visual estable con versión/fecha:** deseable; la galería oficial alcanza para estilo/layout, no para fidelidad de píxeles.

## Terminadas recientemente

- [x] **T9 — Escenarios 1v1 / 2v2 / 3v3 (2026-11-18).** Selector en la barra del mapa (1v1, 2v2, 3v3 y 4v4 por defecto) que carga o reinicia la arena con esa cantidad por bando; los suplentes no reaparecen ni bloquean. El escenario de práctica no rota de mapa; REINICIAR sale de él. Sin cambios de reglas ni balance. Evidencia en `HISTORY.md`.
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
