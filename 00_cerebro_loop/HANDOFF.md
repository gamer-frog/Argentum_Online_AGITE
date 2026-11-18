# HANDOFF — estado actual

> **Actualizado:** 2026-11-18 · **Rama:** `main` (T1–T6, T9, T11 y los pedidos de puntería completados y publicados en `origin/main`).
> Manual del loop: [`README.md`](README.md). Cola: [`TODO.md`](TODO.md). Decisiones: [`DECISIONS.md`](DECISIONS.md). Historial: [`HISTORY.md`](HISTORY.md).

## Snapshot

| Campo | Estado |
| --- | --- |
| Build | 🟢 Verde; `dist/` sincronizado; preflight 2026-11-18 verde |
| Tarea actual | `T12 — Referencia visual estable con versión y fecha` |
| Última completada | `T11 — Auditoría de licencias y atribución por recurso` |
| Bloqueo | Ninguno para `T12`; `T7` depende de `D2`; `T8` queda condicionado por la licencia de audio/GUI (L5) |
| Decisiones abiertas | `D2=B` (inventario funcional); propuestas de `T5` (`D7`) |
| Publicación | `origin/main` al día: `097e79f` (T6), `932bccf` (T9) y `e79a189`; T11 se publica al cerrar (`D5`) |
| Navegador | 2026-11-18: T9 validado en Chromium 1440×1000 y 390×844 (capturas en `/tmp/opencode/shots/t9-*.png`, consola 0/0); 2/4/6/8 activos y práctica fija en la arena |

## Última acción completada

**2026-11-18 · [T11] Auditoría de licencias y atribución por recurso.**

- **Documento:** `roadmap/licencias-recursos.md` con tabla de 11 familias (origen, licencia, atribución, estado y redistribución), atribuciones obligatorias, bloqueos B1–B6, obligación de AGPL §13 y acciones L1–L6.
- **Licencia confirmada:** cliente y servidor fijados declaran **AGPL-3.0** (`LICENSE` completo y GitHub API). `INIT/Creditos.txt` da créditos generales, no autoría por archivo.
- **Copias exactas:** 203/203 PNG y 3/3 WAV coinciden con los blobs del upstream fijado; mapas y JSON son derivados.
- **Sin tocar producto:** no se modificaron assets, `game.js`, `index.html`, `styles.css` ni reglas. Se corrigieron afirmaciones documentales sobre `map.json` y la licencia.
- **Hallazgo H4:** `map.json` es legacy, no lo carga el cliente y difiere de `maps/272.json` en `tiles[43][31].b`.

`bash 00_cerebro_loop/verify.sh` verde y enlaces locales válidos; documento enlazado desde README, inventario y producto recuperado. Detalle en `HISTORY.md`.

## Próximo paso inmediato

**T12 — Referencia visual estable con versión y fecha.**

1. Fijar una captura/referencia reproducible del cliente con revisión, resolución, procedencia y fecha.
2. Registrar qué elementos se pueden comparar (layout, proporciones, paleta) y cuáles no.
3. No copiar píxeles de capturas sin versión verificable ni rehacer la interfaz por inercia.
4. Documentar límites y evidencia; verificar enlaces y `verify.sh`.

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
- **T11 (2026-11-18) fue solo documentación**: no cambió producto ni assets, por lo que no requiere nueva pasada de navegador; `verify.sh` valida enlaces y sincronía.

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
