# DECISIONES — registro del loop

> Una decisión abierta no detiene todo el loop: se registra, se elige una asunción segura y se sigue con tareas no bloqueadas.
> Formato: contexto → opciones → recomendación → asunción mientras no haya respuesta → impacto.

## Abiertas

### D1 — Lista de mapas para la rotación

**Contexto.** El usuario pidió empezar cada partida en un mapa distinto, elegido de una lista de ubicaciones famosas, y cambiar de mapa cada 5 bajas. La lógica actual ya toma mapas del manifiesto `assets/ao/maps.json`, avanza cada 5 bajas y al reiniciar evita repetir el mapa inmediato, pero no garantiza un inicio distinto entre partidas ni usa una lista aprobada. El bosque actual entre Nix y Ullathorpe no le gusta al usuario.

**Opciones.**

- **A. Aprobar la lista propuesta (recomendada):** Ullathorpe (1), Nix (34), Banderbill (59), Lindos (62) y Arena (272). Son los cinco mapas ya extraídos, con spawns oficiales registrados.
- **B. Ajustar la lista:** el usuario elige otras ubicaciones o quita alguna; puede requerir extraer mapas adicionales con `scripts/extract_ao_assets.py`.
- **C. Mantener el manifiesto actual:** no fijar lista; conservar el comportamiento vigente y solo garantizar inicios distintos.

**Recomendación.** A, porque no requiere extracción nueva y cubre ciudades + arena.

**Asunción mientras no haya respuesta.** No cambiar la lista ni la lógica. `T2` queda bloqueada; el loop avanza con `T1`.

**Impacto si se aprueba A.** Cambio acotado en `game.js` (orden/lista inicial y garantía de no repetir al reiniciar), sincronización de `dist/game.js`, verificación de carga de los cinco mapas y de la rotación cada 5 bajas.

### D2 — Alcance de inventario/equipamiento

**Contexto.** Hoy son secciones visuales incompletas, sin objetos ni reglas. No hay una especificación de objetos, slots, pesos, requisitos ni interacción. Implementar mecánicas inventadas contradice el pedido de «clon exacto» y la regla de no hacer mejoras random.

**Opciones.**

- **A. Fidelidad visual primero (recomendada):** reconstruir la presentación de inventario/equipo según la captura de referencia, con slots vacíos y estados honestos; **sin** lógica de objetos. No cambia el ancho global del HUD ni reduce el área de juego.
- **B. Funcional mínimo:** definir primero un contrato de objetos (qué se puede llevar, equipar, usar) y recién después implementar. Requiere una decisión de producto adicional.
- **C. Diferir:** dejar inventario/equipo como están y avanzar otra tarea.

**Recomendación.** A para la próxima iteración; B solo después de acordar reglas.

**Asunción mientras no haya respuesta.** Se ejecuta A: solo presentación, sin mecánicas ni objetos falsos.

**Impacto si se aprueba A.** Cambios en `index.html`/`styles.css` y `dist/`, comparación a 1023×770, validación 1440×1000 y 390×844. No toca `game.js` salvo que la estructura lo exija.

## Cerradas

### D3 — Proporción del HUD

**Decisión (2026-11-15):** no estrechar el panel derecho ni reducir el área de juego solo por comparación visual. La referencia muestra un panel más denso, pero no hay especificación de proporción que justifique el cambio. Se revisará solo si aparece una referencia equivalente de Arena o una decisión de producto.

### D4 — PvP infinito

**Decisión:** no hay contador de bajas, condición de victoria ni fin de partida. Las bajas y respawns son informativos.

### D5 — Publicación

**Decisión de esta sesión:** no hacer commit ni push sin pedido explícito del usuario. Al terminar una tarea, dejar el árbol verificado y reportar «listo para publicar». Si el usuario pide publicar, usar fast-forward a `main` y nunca `--force`.

### D6 — Fuente de recursos y fidelidad

**Decisión:** la referencia de recursos es `ao-libre/ao-cliente` en la revisión fijada del README. Una aproximación no se presenta como regla auténtica; cada afirmación se etiqueta como confirmada, aproximada o de práctica.
