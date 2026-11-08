# HANDOFF

## Estado
- Pausa tras completar la tarea documental de recuperar y clasificar solicitudes del historial en `roadmap/producto-recuperado.md`. No se modificó código de producto.
- Base verificada: `main` en `e371231` (`save-005`), sincronizada con `origin/main`; árbol limpio tras el checkpoint documental.
- Forensis del último muerto (#40): la ref remota `opencode-checkpoints/40` contenía solo cambios de metadatos en `.omgithub/checkpoint.json` y `.omgithub/conversation.json`; no había cambios de producto. Se preservó el tip `6e216f0` con el tag remoto `graveyard-opencode-checkpoints-40-ref-6e216f0` y luego se eliminó la rama. El tip diferente `306cac6` ya estaba preservado e integrado en `main`.
- Verificación: `node --check game.js` y `node --check dist/game.js` aprobaron. `git fetch --prune` confirmó que no quedan refs remotas `opencode-checkpoints/*` ni `opencode-resume/*`.
- No se ejecutó preview de navegador: solo hubo cambios documentales y de refs; la evidencia de navegador previa está resumida en `roadmap/boot.md`.
- `AGENTS.md` conserva SOP omgithub v3.2 y su cierre.

## Siguiente
1. Empezar por Prioridad 0 de `roadmap/producto-recuperado.md`: inventario verificable de recursos de AO Libre, con ruta, licencia/crédito, utilidad y estado real de integración.
2. Mantener separadas las tareas confirmadas, aproximaciones existentes y decisiones pendientes; no afirmar fidelidad sin comparación reproducible.
3. Antes de una tarea de producto, revisar alcance, verificar el navegador y actualizar el estado de la hoja de ruta.

## Decisiones y bloqueos
- La hoja de ruta recuperada es el backlog de producto; las instrucciones de Git/BOOT no se clasificaron como requisitos.
- La interfaz inspirada en AO y la importación de recursos son objetivos; la fidelidad visual, inventario completo y reglas reales siguen pendientes de evidencia.
- `gh auth status` se reportó sin autenticación, así que no se completó el censo de issues.
- No hay `package.json` ni suite de tests declarada; la verificación de sintaxis disponible es `node --check`.

## Riesgos
- El subset de recursos puede existir en disco sin estar cargado o visualmente verificado; distinguir esos estados en el inventario.
- Las referencias visuales históricas no forman todavía una comparación controlada con versión y resolución fijadas.
