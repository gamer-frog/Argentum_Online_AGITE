# HANDOFF — estado actual

> **Actualizado:** 2026-11-16 · **Rama:** `main` (sin cambios de código en esta auditoría).
> Manual del loop: [`README.md`](README.md). Cola: [`TODO.md`](TODO.md). Decisiones: [`DECISIONS.md`](DECISIONS.md). Historial: [`HISTORY.md`](HISTORY.md).

## Snapshot

| Campo | Estado |
| --- | --- |
| Build | 🟢 Verde; `dist/` sincronizado; preflight 2026-11-16 verde |
| Tarea actual | `T1 — Inventario/equipamiento, fase 1 visual` |
| Bloqueo | `T2 — Rotación de mapas` espera `D1` |
| Decisiones abiertas | `D1` (mapas), `D2` (alcance de inventario/equipo) |
| Publicación | Sin commit ni push: no fue pedido explícitamente |
| Navegador | 2026-11-16: carga en 1440×1000 y 390×844, canvas 1099×820, consola 0/0, sin overflow; sin playtest completo |

## Última acción completada

**2026-11-16 · [C] Auditoría y reconstrucción del loop.**

Se revisaron todos los archivos de `00_cerebro_loop/`, los duplicados legacy de la raíz y el estado real del repo. Se corrigieron contradicciones y duplicados:

- `PROTOCOL.md` decía «pusheá después de cada subtarea»; ahora la publicación requiere pedido explícito, en línea con la regla de la sesión.
- `USER_REQUESTS.md` tenía ítems completados en secciones de parciales/pendientes y dos entradas para la misma decisión de mapas.
- `ROADMAP.md` repetía el backlog en dos secciones y conservaba afirmaciones obsoletas («la comparación sigue pendiente»).
- `HANDOFF.md` era un historial de 15 KB sin próximo paso único.
- Los `HANDOFF.md`, `todo.md` y `user-requests.md` de la raíz eran duplicados desactualizados.

Se creó [`README.md`](README.md) como manual operativo, [`DECISIONS.md`](DECISIONS.md) como registro de decisiones, [`HISTORY.md`](HISTORY.md) como historial append-only y [`verify.sh`](verify.sh) como preflight. `TODO.md` quedó como cola de una tarea por ciclo; `ROADMAP.md`, como orden único del backlog. No se modificó código de producto.

## Próximo paso inmediato

**T1 — Inventario/equipamiento, fase 1 visual** (asunción `D2=A`: solo presentación, sin mecánicas).

1. Abrir la captura de referencia a 1023×770 y la captura actual `/tmp/opencode/shots/hud-current-1023x770.png`; el recorte del panel actual está en `/tmp/opencode/shots/dock-current-1023x770.png`.
2. Recortar el panel derecho de ambas y listar **como máximo 5 brechas** visuales concretas (grilla, marcos, densidad, tipografía, estados vacíos).
3. Aplicar solo cambios de HTML/CSS trazables a esas brechas; no tocar el ancho global del HUD ni el área de juego.
4. Sincronizar `dist/` y ejecutar `bash 00_cerebro_loop/verify.sh`.
5. Validar en Chromium a 1440×1000 y 390×844; consola 0/0; capturas en `/tmp/opencode/shots/`.
6. Registrar evidencia y próximo paso en `HISTORY.md` y este archivo.

**No hacer todavía:** rotación de mapas, mecánicas de inventario, cambios de balance, rediseño global del HUD.

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
- La última validación de producto (2026-11-15) confirmó ataque adyacente con daño `-90` y consola limpia. El 2026-11-16 se validó la carga base a 1440×1000 y 390×844 con consola 0/0; esta auditoría es documental y no repite el playtest completo.

## Decisiones abiertas

- **D1 — Lista de mapas:** propuesta Ullathorpe (1), Nix (34), Banderbill (59), Lindos (62), Arena (272). Sin aprobación no se toca la lista ni la lógica. Opciones y recomendación en [`DECISIONS.md`](DECISIONS.md).
- **D2 — Inventario/equipo:** A visual (asunción actual), B funcional mínimo, C diferir. Sin respuesta se ejecuta A.

## Reglas operativas

- Una tarea por ciclo; no mejoras fuera de la lista.
- `game.js` es la fuente; `dist/game.js` la copia de despliegue. Mantener ambos sincronizados junto con HTML/CSS.
- No commit ni push sin pedido explícito. Si se pide publicar: fast-forward a `main`, nunca `--force`.
- No mergear branches viejas a ciegas; reconstruir leyendo el código.
- Etiquetar toda afirmación de fidelidad como confirmada, aproximada o de práctica.
- Las capturas van fuera del repo (`/tmp/opencode/shots/`).

## Historial

El registro completo de acciones verificadas está en [`HISTORY.md`](HISTORY.md). No agregar historial extenso a este archivo: `HANDOFF` es estado, no diario.
