# HANDOFF — estado actual

> **Actualizado:** 2026-11-18 · **Rama:** `main` (T1–T6, T9, T11, T12 y los pedidos de puntería completados y publicados en `origin/main`).
> Manual del loop: [`README.md`](README.md). Cola: [`TODO.md`](TODO.md). Decisiones: [`DECISIONS.md`](DECISIONS.md). Historial: [`HISTORY.md`](HISTORY.md).

## Snapshot

| Campo | Estado |
| --- | --- |
| Build | 🟢 Verde; `dist/` sincronizado; preflight 2026-11-18 verde |
| Tarea actual | `T8 — Chat lateral local (sin audio nuevo)` |
| Última completada | `T12 — Referencia visual estable con versión y fecha` |
| Bloqueo | Ninguno para `T8`; `T7` depende de `D2`; `T8b` (sonidos) depende de `L5` |
| Decisiones abiertas | `D2=B` (inventario funcional); propuestas de `T5` (`D7`) |
| Publicación | `origin/main` al día: `097e79f` (T6), `932bccf` (T9), `e79a189` y `103d7eb` (T11) |
| Navegador | 2026-11-18: T9 validado en Chromium 1440×1000 y 390×844 (capturas en `/tmp/opencode/shots/t9-*.png`, consola 0/0); 2/4/6/8 activos y práctica fija en la arena |

## Última acción completada

**2026-11-18 · [T12] Referencia visual estable con versión y fecha.**

- **Documento:** `roadmap/referencia-visual.md` con la geometría del `frmMain.frm` en la revisión `7d32d61…` (commit 2025-09-22, SHA-256 del archivo), superficie **1022×767 px**, conversión **15 twips/px** y regiones principales.
- **Comparación:** la galería oficial queda como referencia de estilo; no tiene versión ni fecha de captura. La geometría del formulario sí es versionada y reproducible.
- **Límites:** se pueden comparar proporciones y tamaños de región; no colores/skins (`.frx`), tipografía VB6 ni iconos no importados. No se copiaron coordenadas al CSS ni se cambió el layout (`D3`).
- **Sin tocar producto:** no se modificaron `game.js`, `index.html`, `styles.css`, assets ni reglas.

`bash 00_cerebro_loop/verify.sh` verde y enlaces locales válidos; documento enlazado desde producto recuperado. Detalle en `HISTORY.md`.

## Próximo paso inmediato

**T8 — Chat lateral local (sin audio nuevo).**

1. Revisar el historial de combate y el layout del panel lateral en `index.html`/`styles.css`.
2. Habilitar un campo de mensaje local con envío al historial, sin red ni persistencia.
3. Mantener el foco de juego y el layout 1440×1000 / 390×844 sin desborde.
4. No agregar sonidos: la licencia de audio ampliado sigue pendiente (`L5`). Verificar consola 0/0, `dist/` y `verify.sh`.

**Pendiente de aprobación (no hacer sin pedido):** aplicar las propuestas de `T5` (limpieza 330 → 300 y `Fuente de vida` 30-45).

**No hacer todavía:** mecánicas de inventario (`D2=B`), cambios de balance sin aprobación, extracción de assets nuevos, rediseño global del HUD.

## Cómo retomar en 60 segundos

```bash
cd /home/runner/work/Argentum_Online_AGITE/Argentum_Online_AGITE
sed -n '1,80p' 00_cerebro_loop/HANDOFF.md
sed -n '1,80p' 00_cerebro_loop/TODO.md
sed -n '1,80p' 00_cerebro_loop/DECISIONS.md
bash 00_cerebro_loop/verify.sh
PORT=3002 bash start.sh
playwright-cli open http://localhost:3002
playwright-cli console
```

## Estado del build/navegador

- `http://localhost:3002` sirve `dist/` vía `start.sh`, que copia `index.html`, `styles.css`, `game.js`, `favicon.svg` y `assets/ao/` al arrancar.
- Jugable: mover, objetivo (Tab/clic), atacar (F/Enter/Espacio), hechizos 1-4 con apuntado, pociones 5-6, esquiva, pausa y reinicio.
- NPCs combaten de forma continua; curas, remociones y apoyo operativos.
- La última validación de producto (2026-11-18, T9) fue en Chromium: cambio de formato 1→2→3→4 (2/4/6/8 activos), 40 s de práctica 1v1 sin rotación ni suplentes revividos y salida por REINICIAR; capturas 1440×1000 y 390×844 en `/tmp/opencode/shots/t9-*.png`, consola 0/0. La rotación completa 1 → 34 → 59 → 62 → 272 sigue validada desde T2.
- **T11 y T12 (2026-11-18) fueron solo documentación**: no cambiaron producto ni assets, por lo que no requieren nueva pasada de navegador; `verify.sh` valida enlaces y sincronía.

## Decisiones abiertas

- **D1 — Lista de mapas:** resuelta el 2026-11-16. Lista implementada: Ullathorpe (1), Nix (34), Banderbill (59), Lindos (62) y Arena (272).
- **D2 — Inventario/equipo:** A visual ya ejecutado en T1; B funcional mínimo sigue pendiente de decisión. Sin respuesta no se agregan mecánicas.
- **D7 — Propuestas de balance de T5:** limpieza 330 → 300 y `Fuente de vida` 30-45 quedaron documentadas, no aplicadas. Sin respuesta, `game.js` conserva 330/220.

## Reglas operativas

- Una tarea por ciclo; no mejoras fuera de la lista.
- `game.js` es la fuente; `dist/game.js` la copia de despliegue. Mantener ambos sincronizados junto con HTML/CSS.
- Publicar en `main` al cerrar cada tarea (`D5`, pedido 2026-11-18): commit, integración y `git push origin main`. Nunca `--force`; si `main` divergió, merge y conflictos a favor del estado verificado.
- No mergear branches viejas a ciegas; reconstruir leyendo el código.
- Etiquetar toda afirmación de fidelidad como confirmada, aproximada o de práctica.
- Las capturas van fuera del repo (`/tmp/opencode/shots/`).

## Historial

El registro completo de acciones verificadas está en [`HISTORY.md`](HISTORY.md). No agregar historial extenso a este archivo: `HANDOFF` es estado, no diario.
