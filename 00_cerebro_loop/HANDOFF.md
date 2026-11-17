# HANDOFF — estado actual

> **Actualizado:** 2026-11-16 · **Rama:** `main` (T1, T2, T3, T4 y el pedido de puntería libre completados; sin commit ni push).
> Manual del loop: [`README.md`](README.md). Cola: [`TODO.md`](TODO.md). Decisiones: [`DECISIONS.md`](DECISIONS.md). Historial: [`HISTORY.md`](HISTORY.md).

## Snapshot

| Campo | Estado |
| --- | --- |
| Build | 🟢 Verde; `dist/` sincronizado; preflight 2026-11-17 verde |
| Tarea actual | `T5 — Combo, maná y Fuente de vida (confirmación y propuesta)` |
| Última completada | `P2 — Riel de una columna + mira vectorial tipo Wild Rift` |
| Bloqueo | Ninguno; `T4` cerrada; `D1` resuelta |
| Decisiones abiertas | `D2=B` (inventario funcional) |
| Publicación | Sin commit ni push: no fue pedido explícitamente |
| Navegador | 2026-11-17: riel 1×6 y mira vectorial verificados en Chromium (dead zone, topes de alcance, enganche y lanzamiento), 1440×1000 y consola 0/0 |

## Última acción completada

**2026-11-17 · [P2] Riel de una columna + mira vectorial tipo Wild Rift.**

- **Riel:** los 6 botones (4 habilidades + 2 pociones) quedaron en una sola columna vertical sobre el borde derecho del mundo: 54×284 px a 1440×1000. Icono más grande y coste corto; el nombre completo sigue en el `title`.
- **Mira:** al arrastrar una ranura, la mira nace en el personaje y la orienta el **vector desde el punto de apoyo** (estilo Wild Rift), no la posición del dedo. 14 px de zona muerta, alcance máximo a 96 px de arrastre (64 px en táctil), tope por `SPELL_VISION_RANGE` y por el borde de la pantalla, y anillo tenue con el alcance real.
- **Enganche y cancelación:** al pasar sobre un objetivo válido la mira se pega al sprite y muestra corchetes; al soltar se lanza sobre él o sobre la casilla apuntada. Volver a menos de 12 px del apoyo cancela (antes cancelaba todo el riel, lo que impedía apuntar a la derecha).
- **Móvil horizontal:** el clúster de acción se corrió a `right: clamp(7px, 6vw, 40px)` para dejar recorrido de arrastre; el riel sigue oculto y el cargador se mueve a `mobileActionCluster`.

Verificado en Chromium: a 8/22/40/70/110 px de arrastre el alcance fue 0/43/140/300/440 px (tope exacto); un arrastre de 6,08 casillas enganchó `chaoticPaladin` y al soltar el jugador quedó `aiming:true` con `aimSpell:"Carga"`; tap sin arrastre sigue seleccionando y volver al apoyo muestra «Lanzamiento cancelado»; consola 0/0.

## Próximo paso inmediato

**T5 — Combo, maná y `Fuente de vida` (confirmación y propuesta).**

1. Cruzar `Curar heridas graves` vs `Sanar`, `Fuente de vida` 30-45 y el agotamiento de maná del paladín con `roadmap/reglas-combate.md` y `roadmap/hechizos-referencia.md`.
2. Medir en combate real cuántos `Remover parálisis` lanza el paladín antes de quedarse sin maná y si necesita apoyo.
3. Proponer ajustes con valor actual, fuente, etiqueta y efecto esperado. **No aplicar balance sin aprobación explícita.**
4. Si se aprueba tocar código: `game.js` + `dist/game.js`, `verify.sh` y navegador 1440/390 con consola 0/0.

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
- La última validación de producto (2026-11-16) confirmó la rotación completa de mapas: 1 → 34 → 59 → 62 → 272 → 1, con un cambio cada 5 bajas; los cinco mapas cargaron y se capturaron. A 1440×1000 y 390×844 no hubo overflow y la consola quedó 0/0. `T4` fue solo documental y no repitió el playtest de combate; el preflight quedó verde.

## Decisiones abiertas

- **D1 — Lista de mapas:** resuelta el 2026-11-16. Lista implementada: Ullathorpe (1), Nix (34), Banderbill (59), Lindos (62) y Arena (272).
- **D2 — Inventario/equipo:** A visual ya ejecutado en T1; B funcional mínimo sigue pendiente de decisión. Sin respuesta no se agregan mecánicas.

## Reglas operativas

- Una tarea por ciclo; no mejoras fuera de la lista.
- `game.js` es la fuente; `dist/game.js` la copia de despliegue. Mantener ambos sincronizados junto con HTML/CSS.
- No commit ni push sin pedido explícito. Si se pide publicar: fast-forward a `main`, nunca `--force`.
- No mergear branches viejas a ciegas; reconstruir leyendo el código.
- Etiquetar toda afirmación de fidelidad como confirmada, aproximada o de práctica.
- Las capturas van fuera del repo (`/tmp/opencode/shots/`).

## Historial

El registro completo de acciones verificadas está en [`HISTORY.md`](HISTORY.md). No agregar historial extenso a este archivo: `HANDOFF` es estado, no diario.
