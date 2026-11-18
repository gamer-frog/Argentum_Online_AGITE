# HANDOFF — estado actual

> **Actualizado:** 2026-11-18 · **Rama:** `main` (T1–T6, T9 y los pedidos de puntería completados y publicados en `origin/main`).
> Manual del loop: [`README.md`](README.md). Cola: [`TODO.md`](TODO.md). Decisiones: [`DECISIONS.md`](DECISIONS.md). Historial: [`HISTORY.md`](HISTORY.md).

## Snapshot

| Campo | Estado |
| --- | --- |
| Build | 🟢 Verde; `dist/` sincronizado; preflight 2026-11-18 verde |
| Tarea actual | `T11 — Auditoría de licencias y atribución por recurso` |
| Última completada | `T9 — Escenarios de práctica 1v1 / 2v2 / 3v3 con selector de formato` |
| Bloqueo | Ninguno para `T11`; `T7` depende de `D2` y `T8` de esta auditoría |
| Decisiones abiertas | `D2=B` (inventario funcional); propuestas de `T5` (`D7`) |
| Publicación | `main` publicado (`097e79f` al cerrar T6); T9 se publica al cerrar esta tarea (`D5`) |
| Navegador | 2026-11-18: T9 validado en Chromium 1440×1000 y 390×844 (capturas en `/tmp/opencode/shots/t9-*.png`, consola 0/0); 2/4/6/8 activos y práctica fija en la arena |

## Última acción completada

**2026-11-18 · [T9] Escenarios de práctica 1v1 / 2v2 / 3v3 con selector de formato.**

- **Selector:** nuevo control `FORMATO` en la barra del mapa con **1v1, 2v2, 3v3 y 4v4**; 4v4 queda por defecto. Elegir un formato carga la arena 272 (o la reinicia si ya estás ahí) con esa cantidad por bando.
- **Suplentes:** los actores que no entran quedan fuera de juego: no se dibujan, no bloquean, no reaparecen y se ocultan de la lista. El jugador siempre ocupa un cupo sagrado.
- **HUD:** la píldora pasa a `ARENA · PRÁCTICA 2v2`, `MODALIDAD` refleja el formato y la barra de estado/lista muestran la cantidad real.
- **Práctica repetible:** durante un escenario elegido las bajas no acumulan rotación y la arena no rota. **REINICIAR** sale y vuelve al reinicio aleatorio normal; `D1` no cambia.
- **Sin balance:** no se tocaron clases, daños, costos, curaciones, alcances ni reglas.

Verificado en Chromium (`http://localhost:3002`, 1440×1000 y 390×844) con consola 0/0: 1→2→3→4 dio 2/4/6/8 activos con ids correctos; 40 s en 1v1 sin rotación ni suplentes revividos; REINICIAR volvió a una ciudad con 8 activos. `game.js`, `index.html`, `styles.css` y `dist/` sincronizados; `verify.sh` verde. Detalle en `HISTORY.md`.

## Próximo paso inmediato

**T11 — Auditoría de licencias y atribución por recurso.**

1. Inventariar `assets/ao/` y contrastarlo con `roadmap/inventario-recursos-ao.md`.
2. Revisar la licencia/términos del repositorio de origen de cada familia de recursos.
3. Completar la tabla recurso → origen → licencia → atribución → estado.
4. Dejar explícito qué se puede redistribuir y qué bloquea `T8`; sin tocar código ni assets.

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
