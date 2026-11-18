# TODO — cola viva

> **Actualizado:** 2026-11-18. **Regla:** una sola tarea en «Ahora». Las bloqueadas no detienen el loop.
> Orden completo y dependencias: [`ROADMAP.md`](ROADMAP.md). Decisiones: [`DECISIONS.md`](DECISIONS.md).

## Ahora

### T8 — Chat lateral local (sin audio nuevo)

**Estado:** lista para empezar. Se separa el chat (UI propia) de los sonidos licenciados, que siguen condicionados por `L5`.
**Depende de:** `T11` (hecho) y `T1` (hecho). No depende de `D2`.
**Pedido:** «Chat lateral y sonidos de golpes/hechizos si hay recursos licenciados» (`USER_REQUESTS.md`).

**Alcance**

- Convertir el historial de combate en un panel de chat lateral con mensajes del sistema y del jugador.
- Permitir escribir y enviar un mensaje local (sin red ni persistencia); el texto se muestra en el historial con hora o marca simple.
- Respetar el layout actual: en móvil debe seguir siendo usable y no desbordar el HUD.
- Etiquetar claramente que el chat es local y no hay multijugador (`D4`/`T10`).

**No incluye**

- Red, multijugador, moderación, persistencia ni canales.
- Sonidos nuevos: `T11` no encontró autoría/licencia por pista para ampliar audio (`L5`).
- Cambiar reglas de combate, balance o assets.

**Criterios de aceptación**

- [ ] Se puede escribir y enviar un mensaje local; aparece en el historial y no rompe el foco del juego.
- [ ] El panel funciona a 1440×1000 y 390×844 sin desborde, con consola 0/0.
- [ ] Sin cambios en daños, costos, curaciones, alcances ni reglas.
- [ ] `game.js` + `dist/`, `verify.sh` verde y evidencia en `HISTORY.md`/`HANDOFF.md`.

## Bloqueadas / requieren decisión

- **D2 — Alcance de inventario/equipo:** A visual ejecutado en T1; B funcional mínimo sigue pendiente de decisión.
- **Propuestas de balance de T5 (D7):** `Remover parálisis` 330 → 300 y `Fuente de vida` 25-32 → 30-45 quedaron documentadas con fuente y efecto, pero **no aplicadas**; requieren aprobación explícita.
- **Licencia del código propio y avisos del sitio (L1–L3):** requieren decisión de producto; `T11` ya auditó los recursos y confirmó AGPL-3.0 upstream.
- **`map.json` legacy desincronizado (L4):** el cliente no lo carga y difiere de `maps/272.json` en `tiles[43][31].b`; corregir o retirar cuando se toque el extractor.

## Terminadas recientemente

- [x] **T12 — Referencia visual estable con versión y fecha (2026-11-18).** `roadmap/referencia-visual.md`: geometría del `frmMain.frm` de la revisión `7d32d61…` (1022×767 px, 15 twips/px, commit 2025-09-22, SHA-256 del archivo), regiones principales, comparación con la galería y límites de píxeles. Sin cambios de producto.
- [x] **T11 — Auditoría de licencias y atribución por recurso (2026-11-18).** `roadmap/licencias-recursos.md`: tabla por familia con origen, licencia, atribución y estado; AGPL-3.0 confirmada en cliente y servidor fijados; 203/203 PNG y 3/3 WAV idénticos byte a byte al upstream; atribuciones obligatorias, bloqueos B1–B6, obligación de AGPL §13 y acciones L1–L6. Sin cambios de assets ni de producto.
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
