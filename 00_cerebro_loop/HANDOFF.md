# HANDOFF (Estado Actual)

## Última acción completada
Se revisó la evidencia documental de licencia y atribución disponible para el subset actual de AO Libre. Se actualizaron `assets/ao/ATTRIBUTION.txt`, `roadmap/inventario-recursos-ao.md`, `roadmap/producto-recuperado.md`, `todo.md` y los seguimientos del cerebro para distinguir la licencia raíz del upstream de los términos todavía no confirmados por medio. No se amplió el subset ni se presumieron permisos individuales.

## Estado del build/navegador
🟢 Verde. Chromium abrió `http://localhost:3002`; canvas y escena visibles, solicitudes de `map.json`, `grhs.json`, `characters.json` y `spellfx.json` respondieron HTTP 200, y la consola registró 0 errores y 0 advertencias. Se guardó una captura local en `screenshots/brain-foundation.png` (ruta ignorada por Git). El prototipo no es un cliente completo ni multijugador en red; revisar el README para sus límites conocidos.

## Decisiones de diseño tomadas
- Se conserva el juego existente y su documentación; sus reglas y valores se describen como aproximados, no como una recreación fiel de AO.
- `game.js` es el código fuente del juego y `dist/game.js` su copia de despliegue. Mantenerlos sincronizados cuando cambie código.
- El archivo técnico existente se llama `Agents.md` (A mayúscula), por lo que se agregó allí la jerarquía solicitada sin borrar sus instrucciones de entorno.
- No se integran ramas anteriores a ciegas; los detalles históricos de checkpoints rescatados o descartados están en `CEMETERY.md`.

## PRÓXIMO PASO INMEDIATO
🚀 Mantener abierta la prioridad de producto: fijar una referencia visual AO estable y obtener documentación o confirmación upstream de los términos/créditos específicos de los medios antes de ampliar o redistribuir el subset. La revisión de evidencia disponible quedó completada, pero no equivale a autorización por archivo. El cierre/publicación técnica sigue pendiente: el checkout es shallow, los cambios están sin commit y la rama actual es `opencode/42944998414`; no publicar hasta que el estado y la sincronización puedan reevaluarse con seguridad.

## Contexto importante
- Ejecutar desde la raíz con `PORT=3002 bash start.sh`; abrir `http://localhost:3002`.
- Controles: flechas/WASD para moverse; clic, lista o Tab para objetivo; F/Enter para atacar; teclas 1–3 y clic para habilidades; Esc para cerrar panel/guía; botón de pausa para pausar.
- El combate es local e infinito, sin puntuación ni fin de partida. Inventario, equipo, persistencia y multijugador en red no están implementados.
- Historial del BOOT: el checkpoint 40 se absorbió por fast-forward, y las refs remotas `opencode-checkpoints/*` y `opencode-resume/*` se verificaron vacías en la continuación anterior. Los tips preservados están documentados en `CEMETERY.md`.
- Estado Git comprobado: HEAD `868700d5f5d0d511582382e0ea405e9095ac65b6` en la rama `opencode/42944998414`; `origin/main` apunta al mismo hash. El checkout es shallow, hay cambios documentales sin commit y existe un diff previo en `Agents.md`, que se preservó sin modificar durante esta tarea. No se creó commit ni se publicó.
- Captura actual: `screenshots/brain-foundation.png`. La ruta está ignorada por `.gitignore`; se conserva como evidencia local y no se fuerza su inclusión.

## Historial de verificación conservado
- En la continuación anterior se publicó en `main` el commit `9880942` tras validar `game.js`/`dist/game.js`, sincronía de archivos y controles de habilidades en Chromium en `http://127.0.0.1:3000`; consola con cero errores y advertencias.
- La inicialización del protocolo se probó previamente desde `http://127.0.0.1:3000/`; se reportó documento/canvas visibles y consola limpia. En esta sesión se repitió la verificación en el puerto 3002 con el Chromium administrado por `playwright-cli`.
- El análisis histórico identificó el checkpoint #31 (`711c0d0`) como no verificado por un build fallido; el checkpoint 39 quedó preservado tras conflictos documentales. No resucitar esos cambios mediante merge ciego; consultar `CEMETERY.md`.
