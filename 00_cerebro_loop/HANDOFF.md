# HANDOFF — estado actual

> **Actualizado:** 2026-11-18 · **Rama:** `main` (T1, T2, T3, T4, T5 y los pedidos de puntería completados; sin commit ni push).
> Manual del loop: [`README.md`](README.md). Cola: [`TODO.md`](TODO.md). Decisiones: [`DECISIONS.md`](DECISIONS.md). Historial: [`HISTORY.md`](HISTORY.md).

## Snapshot

| Campo | Estado |
| --- | --- |
| Build | 🟢 Verde; `dist/` sincronizado; preflight 2026-11-18 verde |
| Tarea actual | `T6 — Variar ritmos de combate y persecución (sin balance)` |
| Última completada | `T5 — Combo, maná y Fuente de vida (confirmación y propuesta)` |
| Bloqueo | Ninguno; `T4`/`T5` cerradas; propuestas de balance pendientes de aprobación |
| Decisiones abiertas | `D2=B` (inventario funcional); propuestas de `T5` |
| Publicación | Sin commit ni push: no fue pedido explícitamente |
| Navegador | 2026-11-18: probe de maná de 120 s en Chromium (797 muestras, Lindos → Arena, consola 0/0); última validación de layout 2026-11-17 (riel 1×6 y mira vectorial, 1440×1000 y 390×844) |

## Última acción completada

**2026-11-18 · [T5] Combo, maná y `Fuente de vida`: confirmación y propuesta.**

- **`Sanar` vs `Curar Heridas Graves`:** verificado contra `Dat/Hechizos.dat` @ `ca6ad7ff…`. AO #5 cura **12-35** por **40** maná, 5 stamina y `MinSkill=38`; el prototipo cura **40-45** por **220**. No son equivalentes: el nombre y el rango son de Imperium Classic. Tampoco coincide con la wiki 2012 (50-90 / 1000). No se renombra; una futura fidelidad AO requeriría agregar el hechizo.
- **`Fuente de vida` 30-45:** la wiki 2012 publica 30-45 / 300, Classic 25-32, AO no lo tiene. Subir solo la curación mejora +5 a +13 por lanzamiento (eficiencia 0,114-0,145 → 0,136-0,205), pero no arregla el maná. Propuesta `práctica` sin aplicar.
- **Maná del paladín:** 1000 de reserva, limpieza 330, regeneración 6/s, cooldown 2,5 s → **3 limpiezas** consecutivas; la 4.ª llega a los ~53 s (con coste 300, a los ~38 s). `Inmovilizar` + `Fuente` dejan 430: una sola limpieza.
- **Medición real:** 120 s, 797 muestras, Lindos → Arena. Maná mínimo 85 y 13; **23 muestras** con el paladín paralizado y <330 (un tramo continuo de ≈1,6 s sin poder limpiarse); 5 muertes. Necesita apoyo cuando baja de 330. Una limpieza del jugador confirmó el descuento de 330 (1000 → 670, «Removida»).

Verificado en Chromium (`http://localhost:3002`, 1440×1000) con consola 0/0. Propuestas documentadas con fuente y etiqueta, sin aplicar; `game.js` y `dist/` sin cambios.

## Próximo paso inmediato

**T6 — Variar ritmos de combate y persecución (sin balance).**

1. Medir los patrones repetidos actuales: cooldowns fijos, intervalo de ataque, pausas de la IA y persecución.
2. Introducir variación dentro de los valores vigentes (jitter de tiempos y decisión), sin cambiar daños, costos, curaciones, alcances ni reglas.
3. Corregir oscilaciones o bloqueos (pares que se persiguen sin cerrar distancia, NPC plantado sin objetivo, cara a cara sin atacar).
4. Playtest de 90 s antes/después con métricas; `game.js` + `dist/game.js`, `verify.sh` y navegador 1440/390 con consola 0/0.

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
- La última validación de producto (2026-11-18) fue el probe de maná de T5: 120 s de combate, 797 muestras, mapa Lindos → Arena, consola 0/0. La última validación de layout sigue siendo la de 2026-11-17/16: riel 1×6 y rotación completa 1 → 34 → 59 → 62 → 272 a 1440×1000 y 390×844.

## Decisiones abiertas

- **D1 — Lista de mapas:** resuelta el 2026-11-16. Lista implementada: Ullathorpe (1), Nix (34), Banderbill (59), Lindos (62) y Arena (272).
- **D2 — Inventario/equipo:** A visual ya ejecutado en T1; B funcional mínimo sigue pendiente de decisión. Sin respuesta no se agregan mecánicas.
- **D7 — Propuestas de balance de T5:** limpieza 330 → 300 y `Fuente de vida` 30-45 quedaron documentadas, no aplicadas. Sin respuesta, `game.js` conserva 330/220.

## Reglas operativas

- Una tarea por ciclo; no mejoras fuera de la lista.
- `game.js` es la fuente; `dist/game.js` la copia de despliegue. Mantener ambos sincronizados junto con HTML/CSS.
- No commit ni push sin pedido explícito. Si se pide publicar: fast-forward a `main`, nunca `--force`.
- No mergear branches viejas a ciegas; reconstruir leyendo el código.
- Etiquetar toda afirmación de fidelidad como confirmada, aproximada o de práctica.
- Las capturas van fuera del repo (`/tmp/opencode/shots/`).

## Historial

El registro completo de acciones verificadas está en [`HISTORY.md`](HISTORY.md). No agregar historial extenso a este archivo: `HANDOFF` es estado, no diario.
