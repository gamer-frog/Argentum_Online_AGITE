# HANDOFF (Estado Actual)

## Última acción completada
Se amplió el extractor de AO Libre para admitir múltiples mapas y manifiestos de hashes. La extracción fijada contiene los mapas 2 y 3; se verificaron los hashes registrados de los 65 archivos, la geometría 100×100 de cada mapa y que `map.json` coincide byte a byte con `maps/2.json`. Se actualizaron el inventario de recursos, el aviso de atribución y el seguimiento. No se modificó lógica del juego ni se hizo una nueva prueba de navegador en esta tarea.

## Estado del build/navegador
🟢 Verde en la versión actual. Chromium en `http://localhost:3002`: interacción del botón COMBATIENTES comprobada en desktop (1440×1000) y móvil (390×844); consola con cero errores y advertencias. En móvil el panel se abre debajo del contenido del dock (`y≈439`), por lo que queda parcialmente fuera del viewport y requiere desplazamiento. El prototipo no es un cliente completo ni multijugador en red; revisar el README para sus límites conocidos.

## Decisiones de diseño tomadas
- Se conserva el juego existente y su documentación; sus reglas y valores se describen como aproximados, no como una recreación fiel de AO.
- `game.js` es el código fuente del juego y `dist/game.js` su copia de despliegue. Mantenerlos sincronizados cuando cambie código.
- El archivo técnico existente se llama `Agents.md` (A mayúscula), por lo que se agregó allí la jerarquía solicitada sin borrar sus instrucciones de entorno.
- No se integran ramas anteriores a ciegas; los detalles históricos de checkpoints rescatados o descartados están en `CEMETERY.md`.

## PRÓXIMO PASO INMEDIATO
🚀 No adoptar el movimiento del panel del checkpoint 44: mejora la visibilidad móvil, pero lo deja fuera de pantalla en desktop. Conservar el diseño actual y, si el problema móvil se prioriza como cambio de producto, implementar y verificar una solución móvil específica sin cambiar el anclaje desktop. La prioridad de producto pendiente sigue siendo fijar una referencia visual AO y completar la auditoría de licencias/atribución por recurso antes de ampliar assets.

## Contexto importante
- Ejecutar desde la raíz con `PORT=3002 bash start.sh`; abrir `http://localhost:3002`.
- Controles: flechas/WASD para moverse; clic, lista o Tab para objetivo; F/Enter para atacar; teclas 1–3 y clic para habilidades; Esc para cerrar panel/guía; botón de pausa para pausar.
- El combate es local e infinito, sin puntuación ni fin de partida. Inventario, equipo, persistencia y multijugador en red no están implementados.
- Historial del BOOT: el checkpoint 40 se absorbió por fast-forward. La limpieza de refs documentada entonces fue histórica; una consulta directa actual (`git ls-remote`) encuentra checkpoints 43–46 y un resume. Sus hashes y la decisión de no fusionar están en `CEMETERY.md`.
- Estado Git verificado: rama `opencode/42552277598`; `HEAD` y `origin/main` coinciden en `8900ab9d6562c738280cffa5f22052f1b76014d9`. El árbol estaba limpio antes de esta actualización documental. No hay cambio de interfaz/código pendiente de publicar; no forzar ni integrar refs históricas.
- Captura de la verificación: `screenshots/brain-foundation.png`. La ruta completa `screenshots/` está ignorada por `.gitignore`; se conserva como evidencia local y no se fuerza su inclusión.

## Historial de verificación conservado
- En la continuación anterior se publicó en `main` el commit `9880942` tras validar `game.js`/`dist/game.js`, sincronía de archivos y controles de habilidades en Chromium en `http://127.0.0.1:3000`; consola con cero errores y advertencias.
- La inicialización del protocolo se probó previamente desde `http://127.0.0.1:3000/`; se reportó documento/canvas visibles y consola limpia. En esta sesión se repitió la verificación en el puerto 3002 con el Chromium administrado por `playwright-cli`.
- El análisis histórico identificó el checkpoint #31 (`711c0d0`) como no verificado por un build fallido; el checkpoint 39 quedó preservado tras conflictos documentales. No resucitar esos cambios mediante merge ciego; consultar `CEMETERY.md`.
