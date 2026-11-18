# DECISIONES — registro del loop

> Una decisión abierta no detiene todo el loop: se registra, se elige una asunción segura y se sigue con tareas no bloqueadas.
> Formato: contexto → opciones → recomendación → asunción mientras no haya respuesta → impacto.

## Abiertas

### D2 — Alcance de inventario/equipamiento

**Contexto.** Hoy son secciones visuales incompletas, sin objetos ni reglas. No hay una especificación de objetos, slots, pesos, requisitos ni interacción. Implementar mecánicas inventadas contradice el pedido de «clon exacto» y la regla de no hacer mejoras random.

**Opciones.**

- **A. Fidelidad visual primero (recomendada):** reconstruir la presentación de inventario/equipo según la captura de referencia, con slots vacíos y estados honestos; **sin** lógica de objetos. No cambia el ancho global del HUD ni reduce el área de juego.
- **B. Funcional mínimo:** definir primero un contrato de objetos (qué se puede llevar, equipar, usar) y recién después implementar. Requiere una decisión de producto adicional.
- **C. Diferir:** dejar inventario/equipo como están y avanzar otra tarea.

**Recomendación.** A para la próxima iteración; B solo después de acordar reglas.

**Asunción mientras no haya respuesta.** Se ejecuta A: solo presentación, sin mecánicas ni objetos falsos. **A ejecutada en T1 el 2026-11-16** (grilla 5×7/35, equipo 2×2). B queda pendiente de una decisión de producto adicional.

**Impacto si se aprueba A.** Cambios en `index.html`/`styles.css` y `dist/`, comparación a 1023×770, validación 1440×1000 y 390×844. No toca `game.js` salvo que la estructura lo exija. **Completado:** ver `HISTORY.md` (2026-11-16).

### D7 — Aplicar las propuestas de balance de T5

**Contexto.** T5 midió el maná del paladín y confirmó que `Sanar` no equivale a `Curar Heridas Graves`. Dejó propuestas con fuente y etiqueta, pero **no las aplicó** porque el protocolo prohíbe cambiar balance sin aprobación.

**Opciones.**

- **A. Aplicar 1+2:** `Remover parálisis` 330 → 300 (AO #10) y `Fuente de vida` 25-32 → 30-45 con coste 220 (wiki 2012). Medir con el mismo probe de 90/120 s.
- **B. Aplicar solo 1:** mejora la disponibilidad de la limpieza; no toca la curación.
- **C. Aplicar solo 2:** mejora la supervivencia del paladín; no arregla la limpieza.
- **D. No aplicar:** el prototipo queda como práctica de Imperium.

**Recomendación.** A, con medición antes/después. Si el paladín sigue muriendo, revisar la reserva o la regeneración en una tarea aparte en vez de seguir bajando costos sin fuente.

**Asunción mientras no haya respuesta.** No se aplica nada: `game.js` conserva 330/220. `T6` no toca estos valores.

**Impacto si se aprueba.** `game.js` + `dist/game.js`, playtest de combate y actualización de `roadmap/reglas-combate.md`/`HISTORY.md`; no cambia el layout.

## Cerradas

### D1 — Lista de mapas para la rotación

**Decisión (2026-11-16).** Se aprueba la opción A: la rotación usa **Ullathorpe (1), Nix (34), Banderbill (59), Lindos (62) y Arena (272)**, en ese orden. El inicio de cada partida se elige al azar dentro de la lista y no repite el mapa inicial de la partida anterior. La rotación sigue avanzando cada 5 bajas; si un mapa no carga, se conserva el mapa actual. Implementado y verificado en `T2`.

### D3 — Proporción del HUD

**Decisión (2026-11-15):** no estrechar el panel derecho ni reducir el área de juego solo por comparación visual. La referencia muestra un panel más denso, pero no hay especificación de proporción que justifique el cambio. Se revisará solo si aparece una referencia equivalente de Arena o una decisión de producto.

### D4 — PvP infinito

**Decisión:** no hay contador de bajas, condición de victoria ni fin de partida. Las bajas y respawns son informativos.

### D5 — Publicación

**Decisión (actualizada 2026-11-18):** el usuario pidió que el trabajo se **publique en `main` al cerrar cada tarea**, porque si no se pushea no queda guardado. Por eso el cierre de una tarea incluye: commit en la rama de trabajo, integración a `main` y `git push origin main`. Nunca `--force`. Si `main` divergió (por ejemplo, por commits del runtime de OmGithub), se integra con merge y se resuelven los conflictos a favor del estado verificado del loop, conservando los archivos de infraestructura que solo están en `main`. El reporte final debe indicar el hash publicado o el motivo por el que no se pudo publicar.

### D6 — Fuente de recursos y fidelidad

**Decisión:** la referencia de recursos es `ao-libre/ao-cliente` en la revisión fijada del README. Una aproximación no se presenta como regla auténtica; cada afirmación se etiqueta como confirmada, aproximada o de práctica.
