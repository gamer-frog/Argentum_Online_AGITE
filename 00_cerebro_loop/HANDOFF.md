# HANDOFF — estado actual

> **Actualizado:** 2026-11-16 · **Rama:** `main` (T1, T2 y T3 completados; sin commit ni push).
> Manual del loop: [`README.md`](README.md). Cola: [`TODO.md`](TODO.md). Decisiones: [`DECISIONS.md`](DECISIONS.md). Historial: [`HISTORY.md`](HISTORY.md).

## Snapshot

| Campo | Estado |
| --- | --- |
| Build | 🟢 Verde; `dist/` sincronizado; preflight 2026-11-16 verde |
| Tarea actual | `T4 — Matriz de reglas del combate actual vs AO Libre (primer corte)` |
| Última completada | `T2 — Rotación de mapas` |
| Bloqueo | Ninguno; `D1` resuelta |
| Decisiones abiertas | `D2=B` (inventario funcional) |
| Publicación | Sin commit ni push: no fue pedido explícitamente |
| Navegador | 2026-11-16: T2 verificado con rotación completa (5 mapas, 25 bajas), capturas de los cinco mapas, 1440×1000 y 390×844 sin overflow; consola 0/0 |

## Última acción completada

**2026-11-16 · [T2] Rotación de mapas aprobada (`D1=A`).**

Se fijó la lista aprobada en `game.js` (`APPROVED_MAP_IDS`) y se separó la rotación del orden accidental de `maps.json`:

1. **Lista:** Ullathorpe (1) → Nix (34) → Banderbill (59) → Lindos (62) → Arena (272).
2. **Inicio:** aleatorio dentro de la lista.
3. **Reinicio:** elige al azar un mapa distinto del inicio anterior y del actual; si ninguno carga, conserva el actual.
4. **Rotación:** avance cada 5 bajas, en el orden aprobado.
5. **Fallback:** si un mapa no carga durante la rotación, la partida continúa en el mapa actual.

Evidencia en navegador: 5 cambios consecutivos en el orden aprobado, cada uno al completar 5 bajas (25 bajas totales), y captura de los cinco mapas. `AO_DEBUG` ahora expone `mapId`, `mapRotation`, `killsTowardRotation` y `lastStartMapId` como lectura. Preflight verde; consola 0/0 a 1440×1000 y 390×844. Capturas: `/tmp/opencode/shots/t2-map-{1,34,59,62,272}.png`, `t2-desktop-1440x1000.png` y `t2-mobile-390x844.png`.

## Próximo paso inmediato

**T4 — Matriz de reglas del combate actual vs AO Libre (primer corte).**

1. Leer `game.js` y listar solo las reglas que afectan al combate actual: ataque adyacente, recuperación, pociones, alcance de hechizos, apuntado/telegrafiado, inmovilización/remoción y maná.
2. Para cada regla, anotar valor implementado, archivo/línea, fuente AO Libre fijada y etiqueta `confirmado`, `aproximado`, `práctica` o `sin dato`.
3. Escribir `roadmap/reglas-combate.md` y enlazarlo desde `README.md`.
4. No cambiar balance ni extraer assets. Si no se toca código, no hace falta playtest.
5. Registrar evidencia y próximo paso en `HISTORY.md` y este archivo.

**No hacer todavía:** mecánicas de inventario (`D2=B`), cambios de balance, extracción de assets nuevos, rediseño global del HUD.

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
- La última validación de producto (2026-11-16) confirmó la rotación completa de mapas: 1 → 34 → 59 → 62 → 272 → 1, con un cambio cada 5 bajas; los cinco mapas cargaron y se capturaron. A 1440×1000 y 390×844 no hubo overflow y la consola quedó 0/0. No se repitió el playtest completo de combate.

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
