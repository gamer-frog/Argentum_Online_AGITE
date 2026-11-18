# HANDOFF — estado actual

> **Actualizado:** 2026-11-18 · **Rama:** `main` (T1, T2, T3, T4, T5, T6 y los pedidos de puntería completados; sin commit ni push).
> Manual del loop: [`README.md`](README.md). Cola: [`TODO.md`](TODO.md). Decisiones: [`DECISIONS.md`](DECISIONS.md). Historial: [`HISTORY.md`](HISTORY.md).

## Snapshot

| Campo | Estado |
| --- | --- |
| Build | 🟢 Verde; `dist/` sincronizado; preflight 2026-11-18 verde |
| Tarea actual | `T9 — Escenarios de práctica 1v1 / 2v2 / 3v3 con selector de formato` |
| Última completada | `T6 — Ritmos de combate y persecución (corrección del mago acosado)` |
| Bloqueo | Ninguno para `T9`; `T7` depende de `D2` y `T8` de la auditoría de licencias |
| Decisiones abiertas | `D2=B` (inventario funcional); propuestas de `T5` (`D7`) |
| Publicación | Publicado en `origin/main` al cerrar cada tarea (`D5` actualizada 2026-11-18) |
| Navegador | 2026-11-18: T6 validado en Chromium 1440×1000 y 390×844 (capturas en `/tmp/opencode/captures-t6/`, consola 0/0); probes de ritmo de 90 s y de pares de 45 s. Layout sin cambios desde el riel 1×6 del 2026-11-17 |

## Última acción completada

**2026-11-18 · [T6] Ritmos de combate y persecución: variación vigente y mago acosado corregido.**

- **Lo que ya estaba:** el código tiene variación real de ritmo (paso 0,82-1,22×, ráfagas de 2-4 casilleros, pausas de IA aleatorias, apuntado 0,36-0,62 s y recuperación 0,85-1,15 s, apoyo 0,3-1,8 s). La medición de 90 s no mostró NPC plantado sin objetivo ni oscilaciones: 1-3 % sin objetivo, cero tramos >1 s, 0-2 reversiones.
- **El bloqueo:** el mago sagrado acumuló **43 muestras (≈10,75 s)** bajo presión sin lanzar, porque la rama de retirada hacía `continue` antes de las tiradas de hechizo. Solo huía en círculos.
- **Corrección:** la retirada se resuelve en el bloque de movimiento común, con respaldo por ruta si el paso está bloqueado. El mago y el clérigo apuntan **mientras retroceden**; el mago sigue sin golpear a melee. Sin cambios de daños, costos, curaciones, alcances, cooldowns ni `STEP_DURATION`.
- **Resultado:** tramo máximo bajo presión 43 → **7 muestras (1,75 s)**; apuntando bajo presión 2 → 12; lanzamientos bajo presión 0 → 3. Pares adyacentes sin daño/mira/paso: máximo **1,25 s**, que es el intervalo normal de golpe. Sin bloqueos.

Verificado en Chromium (`http://localhost:3002`, 1440×1000 y 390×844) con consola 0/0; `game.js` y `dist/game.js` sincronizados y `verify.sh` verde. Detalle y números en `HISTORY.md`.

## Próximo paso inmediato

**T9 — Escenarios de práctica 1v1 / 2v2 / 3v3 con selector de formato.**

1. Leer cómo se arma la arena (mapa 272, `spawnActorsOnMap`, `arenaOffsets`) y el HUD del mapa.
2. Agregar el selector de formato reutilizando los actores existentes; el jugador ocupa un cupo sagrado.
3. Mantener intacta la rotación de ciudad (`D1`) y todas las reglas de combate.
4. Verificar los tres formatos en Chromium 1440/390 con consola 0/0 y registrar evidencia.

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
- La última validación de producto (2026-11-18, T6) fue en Chromium: probes de ritmo de 90 s y de pares adyacentes de 45 s, más movimiento, poción y selección de habilidad; capturas 1440×1000 y 390×844 en `/tmp/opencode/captures-t6/`, consola 0/0. La última validación de layout sigue siendo la de 2026-11-17/16: riel 1×6 y rotación completa 1 → 34 → 59 → 62 → 272 a 1440×1000 y 390×844.

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
