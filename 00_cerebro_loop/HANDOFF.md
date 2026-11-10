# HANDOFF (Estado Actual)

## Última acción completada
Se amplió el extractor de AO Libre para admitir múltiples mapas y manifiestos de hashes. La extracción fijada contiene los mapas 2 y 3; se verificaron los hashes registrados de los 65 archivos, la geometría 100×100 de cada mapa y que `map.json` coincide byte a byte con `maps/2.json`. En una revisión posterior del checkout upstream se confirmó que `LICENSE` declara AGPL-3.0 y se revisaron los créditos generales. La atribución conserva licencia declarada, procedencia y créditos disponibles, sin inventar atribuciones individuales que la fuente no especifica. No se modificó lógica del juego ni se hizo una nueva prueba de navegador en esta tarea.

## Estado del build/navegador
🟢 Verde en la versión actual. Chromium en `http://localhost:3002`: interacción del botón COMBATIENTES comprobada en desktop (1440×1000) y móvil (390×844); consola con cero errores y advertencias. En móvil el panel se abre debajo del contenido del dock (`y≈439`), por lo que queda parcialmente fuera del viewport y requiere desplazamiento. El prototipo no es un cliente completo ni multijugador en red; revisar el README para sus límites conocidos.

## Decisiones de diseño tomadas
- Se conserva el juego existente y su documentación; sus reglas y valores se describen como aproximados, no como una recreación fiel de AO.
- `game.js` es el código fuente del juego y `dist/game.js` su copia de despliegue. Mantenerlos sincronizados cuando cambie código.
- El archivo técnico existente se llama `Agents.md` (A mayúscula), por lo que se agregó allí la jerarquía solicitada sin borrar sus instrucciones de entorno.
- No se integran ramas anteriores a ciegas; los detalles históricos de checkpoints rescatados o descartados están en `CEMETERY.md`.

## PRÓXIMO PASO INMEDIATO
🚀 Completar la prueba desktop de curación exitosa y revisar procedencia de `Agents.md` y `assets/ao/ATTRIBUTION.txt`; buscar y fijar una referencia visual AO estable antes de afirmar fidelidad. Verificaciones nuevas: en móvil (390×844) una curación exitosa restauró 17 HP (88→105/105), gastó 18 de maná (145→127), mostró el toast «Sanar: recuperaste 17 de vida.» y la consola no registró errores. Captura: `/tmp/opencode/ao-mobile-heal-success.png`. Al revisar la imagen se confirma también el flotante verde `+17` sobre el personaje; la captura incluye además un `-13` de combate simultáneo. El daño móvil sigue pendiente: se cambió al mago, se seleccionó un objetivo desde el panel, pero el objetivo murió por la IA antes de ejecutar el hechizo; no se validó el flotante de daño. En desktop, el Rayo acertó y `/tmp/opencode/ao-rayo-final-test-100ms.png` muestra daño e «INMOVILIZADO» sobre el rival con consola limpia. La prueba de curación desktop sigue pendiente; no afirmar aún que el flotante verde fue verificado visualmente.

## Contexto importante
- Ejecutar desde la raíz con `PORT=3002 bash start.sh`; abrir `http://localhost:3002`.
- Controles: flechas/WASD para moverse; clic, lista o Tab para objetivo; F/Enter para atacar; teclas 1–3 y clic para habilidades; Esc para cerrar panel/guía; botón de pausa para pausar.
- El combate es local e infinito, sin puntuación ni fin de partida. Inventario, equipo, persistencia y multijugador en red no están implementados.
- Historial del BOOT: el checkpoint 40 se absorbió por fast-forward. La limpieza de refs documentada entonces fue histórica; una consulta directa actual (`git ls-remote`) encuentra checkpoints 43–46 y un resume. Sus hashes y la decisión de no fusionar están en `CEMETERY.md`.
- Estado Git actual: rama `opencode/42743119187`; `origin/main` (`fae9f146`) se integró mediante el merge `00bc34b` tras revisar que su cambio funcional era actualizar los cuatro pins del workflow de OpenCode. `.github/workflows/opencode.yml` coincide con `origin/main`. Los commits locales `445a51e` (extracción) y `59aff65` (licencia/créditos) están sobre `origin/main`; `git ls-remote` confirmó que `main` sigue en `fae9f146`. No se hizo push. El único cambio pendiente es `Agents.md`, excluido por tener procedencia/tratamiento sin aclarar.
- Captura de la verificación: `screenshots/brain-foundation.png`. La ruta completa `screenshots/` está ignorada por `.gitignore`; se conserva como evidencia local y no se fuerza su inclusión.

## Historial de verificación conservado
- En la continuación anterior se publicó en `main` el commit `9880942` tras validar `game.js`/`dist/game.js`, sincronía de archivos y controles de habilidades en Chromium en `http://127.0.0.1:3000`; consola con cero errores y advertencias.
- La inicialización del protocolo se probó previamente desde `http://127.0.0.1:3000/`; se reportó documento/canvas visibles y consola limpia. En esta sesión se repitió la verificación en el puerto 3002 con el Chromium administrado por `playwright-cli`.
- El análisis histórico identificó el checkpoint #31 (`711c0d0`) como no verificado por un build fallido; el checkpoint 39 quedó preservado tras conflictos documentales. No resucitar esos cambios mediante merge ciego; consultar `CEMETERY.md`.
