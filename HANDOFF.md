# HANDOFF

## Estado
- En progreso: [A] mejorar la IA de los NPC para que corra y zigzaguee, busque ángulos de inmovilización/ataque, conserve espacio entre aliados y respete la distancia de combate de cada clase.
- Forensis del último checkpoint: el checkpoint #31 (`711c0d0`) integró efectos AO; el registro de sesión indica que el workflow acabó como **Build failed**, por lo que no se considera verificado ni se reutiliza como save.
- Cambios locales preexistentes y preservados: nivel 40 del HUD y de los ocho actores, con README aclarando que las estadísticas son aproximadas. No se deben borrar ni mezclar conceptualmente con la IA.
- AGENTS.md tiene SOP omgithub v3.2 y cierre presentes.

## Plan inmediato
1. Revisar la IA actual, el movimiento por casillas, la navegación y las reglas de lanzamiento para definir cambios mínimos.
2. Implementar navegación con preferencia de distancia por rol, trayectorias laterales variables y separación respecto de aliados, sin bloquear el movimiento durante el apuntado.
3. Sincronizar `game.js` con `dist/game.js` y registrar el trabajo en la hoja de ruta.
4. Verificar sintaxis, distribución y ejecución de la arena en navegador; corregir cualquier regresión.
5. Crear commit atómico solo tras verificación. Intentar checkpoint fast-forward únicamente si el estado remoto lo permite.

## Bloqueos / decisiones
- HEAD está en `opencode/42495398582` (`711c0d0`), no en `main`; `origin/main...HEAD` diverge 1/3. No cambiar de rama ni hacer merge a ciegas; si el merge real tiene conflicto, abortar y reportar.
- No hay etiquetas `save-*` verificadas.
- La sesión previa reportó que `gh auth status` no está autenticado. No asumir permiso para publicar; revisar una vez al preparar checkpoint.
- No hay package.json ni suite de tests declarada. Verificación base disponible: `node --check game.js`; la vista previa del navegador queda pendiente.

## Riesgos
- El movimiento se resuelve en casillas; la separación y el zigzag deben evitar oscilaciones y bloqueos en pasillos.
- Los cambios de lógica deben aparecer tanto en `game.js` como en la copia `dist/game.js`.
