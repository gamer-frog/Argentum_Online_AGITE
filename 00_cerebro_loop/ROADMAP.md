# ROADMAP — orden del backlog

> **Actualizado:** 2026-11-18. Este archivo ordena el trabajo; no redefine pedidos ni decisiones.
> Pedidos: [`USER_REQUESTS.md`](USER_REQUESTS.md). Decisiones: [`DECISIONS.md`](DECISIONS.md). Cola viva: [`TODO.md`](TODO.md).

## Criterio de orden

1. Desbloquear lo que impide avanzar (decisiones, referencias, assets).
2. Cerrar la fidelidad visual de la interfaz antes de agregar mecánicas nuevas.
3. Verificar reglas contra AO Libre antes de presentarlas como fieles.
4. Dejar para el final lo que depende de backend, persistencia o licencias.

## Ahora

| ID | Tarea | Estado | Depende | Criterio de cierre |
| --- | --- | --- | --- | --- |
| **T9** | Escenarios 1v1 / 2v2 / 3v3 con selector de formato | Ahora | T1/T5 + arena de T2 | Tres formatos jugables reutilizando la arena; sin matchmaking ni balance nuevo |

## Después

| ID | Tarea | Depende | Nota |
| --- | --- | --- | --- |
| **T7** | Inventario/equipamiento funcional | T1 + `D2` B | Requiere contrato de objetos; no inventar reglas |
| **T8** | Chat lateral y sonidos licenciados | Auditoría de licencias | Solo con assets compatibles |
| **T10** | Multijugador y persistencia | T7/T9 + alcance | Pospuesto; requiere backend |
| **T11** | Auditoría de licencias/atribución por recurso | — | Antes de redistribuir o ampliar assets |
| **T12** | Referencia visual estable con versión/fecha | — | La galería oficial sirve para estilo, no para píxeles |

## Bloqueos y decisiones

- **D1 — Lista de mapas:** aprobada el 2026-11-16 e implementada en `T2`: Ullathorpe (1), Nix (34), Banderbill (59), Lindos (62) y Arena (272).
- **D2 — Inventario/equipo:** visual primero (A) vs funcional mínimo (B) vs diferir (C). Asunción actual: A.
- **D3 — Proporción del HUD:** cerrada; no estrechar sin especificación.
- **D4 — PvP infinito:** cerrada; sin contador ni condición de victoria.
- **D5 — Publicación:** sin commit/push salvo pedido explícito.

## Completado (resumen)

| Fecha | Tarea | Evidencia |
| --- | --- | --- |
| 2026-11-18 | T6: ritmos de combate y persecución (mago acosado corregido) | `HISTORY.md`; probes de 90 s y 45 s; tramo bajo presión 10,75 s → 1,75 s |
| 2026-11-18 | T5: combo, maná y `Fuente de vida` (confirmación y propuesta) | `HISTORY.md`; `roadmap/reglas-combate.md`; `roadmap/hechizos-referencia.md`; probe de 120 s |
| 2026-11-16 | T4: matriz de reglas de combate vs AO Libre (primer corte) | `HISTORY.md`; `roadmap/reglas-combate.md`; etiquetas confirmado/aproximado/práctica/sin dato |
| 2026-11-16 | T2: rotación de mapas aprobada | `HISTORY.md`; lista 1→34→59→62→272; 5 cambios/25 bajas; 5 capturas |
| 2026-11-16 | T3: auditoría de FX de hechizos | `HISTORY.md`; `roadmap/fx-hechizos.md`; 1 original / 3 reutilizados / 4 reserva |
| 2026-11-16 | T1: inventario/equipamiento, fase 1 visual | `HISTORY.md`; 5×7/35, equipo 2×2, capturas T1 |
| 2026-11-16 | Loop funcional: manual, decisiones, cola, historial, preflight | `README.md`, `DECISIONS.md`, `TODO.md`, `HISTORY.md`, `verify.sh` |
| 2026-11-15 | Comparación HUD y ataque aislado | `HISTORY.md`; daño `-90`; sin cambio de layout |
| 2026-11-14 | HUD sin contador de bajas | `HISTORY.md`; `dist/` sync |
| 2026-11-14 | `ERRADO` sobre el lanzador | `HISTORY.md`; captura `/tmp/opencode/shots/errado-actor.png` |
| 2026-11-14 | Hechizos clickeados siguen al rival | `HISTORY.md`; Inmovilizar sobre `chaoticPaladin` |
| 2026-11-14 | Nombre del hechizo sobre el lanzador | `HISTORY.md`; verificado en combate real |
| 2026-11-13 | Rescate de 141 pedidos | `USER_REQUESTS.md` |
| 2026-11-12/13 | IA de agite, roles, hechizos Imperium, HUD de maná, spawn/respawn | `HISTORY.md` |

> El detalle de cada cierre, con probes y capturas, está en [`HISTORY.md`](HISTORY.md). No duplicar aquí párrafos de evidencia.

## Regla de avance

Una tarea pasa a «Completado» solo cuando cumple `Definition of Done` (`README.md` §5). Un cambio parcial queda como `[~]` y se registra como pendiente; no se presenta como terminado.
