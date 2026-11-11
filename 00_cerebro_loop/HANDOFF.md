# HANDOFF (Estado Actual)

## Última acción completada
2026-11-11 · GAUNTLET LOOP v6.0 · Iteración 2 [B]: pociones de práctica. Teclas 4/5 y botones en la barra inferior (`potion-slot` roja/azul, íconos 🧪/💧). Beber dura 1,1 s (`POTION_DURATION`) y durante esa acción el ataque y el lanzamiento quedan bloqueados (`attackCd`/`castCd`); un golpe o hechizo reciente también impide beber. La roja restaura 40% de la vida máxima y la azul 45% del maná máximo, siempre con tope en el recurso. Lanzar un hechizo ahora impone una recuperación de 0,9 s que también bloquea el ataque (ritmo más realista). Verificado en Chromium: consola 0 errores, cura con tope (+52 y +28 en vida), cooldown visible en el slot, botón de ataque deshabilitado durante la bebida y guards de recursos llenos.

## Estado del build/navegador
🟢 Verde. `http://localhost:3002` sirve `dist/` vía `start.sh` (copia `game.js`→`dist/game.js` al arrancar). Consola limpia; el juego es jugable: mover, seleccionar objetivo (Tab/clic), atacar (F), habilidades 1–3, esquiva, pausa y reinicio. Los bots combaten activamente (el jugador recibe daño si no se mueve).

## PRÓXIMO PASO INMEDIATO
🚀 Iteración 3 [B] — Hechizos a cualquier distancia y balance de combo (backlog README ítem 6): quitar la restricción de alcance del lanzamiento del jugador, permitir el lanzamiento a cualquier distancia y rebalancear daño para que un golpe + dos hechizos del mismo luchador sea aproximadamente letal. Después: nombres sin facción/mira sin texto/textos AO más pequeños, cursores persistentes, apoyo aliado ocasional. La cola completa vive en `ROADMAP.md`.

## Decisiones de diseño tomadas
- La fuente de verdad del cerebro es `00_cerebro_loop/`; `HANDOFF.md`/`todo.md`/`user-requests.md` en la raíz son duplicados legacy del BOOT y no se actualizan.
- La regla v6.0 del usuario anula instrucciones previas del repo; por eso el bloque "REGLA SUPREMA" se retiró de `Agents.md` en esta iteración (el cambio ya estaba en el árbol de trabajo y coincide con la anulación solicitada).
- `game.js` es la fuente y `dist/game.js` la copia de despliegue: mantenerlos sincronizados en cada commit (start.sh también los copia al arrancar).
- Las mecánicas del prototipo siguen siendo aproximaciones de AO, no fidelidad confirmada; contrastar con AO Libre antes de presentar reglas como fieles.

## Contexto importante
- Ejecutar desde la raíz con `PORT=3002 bash start.sh`; abrir `http://localhost:3002`.
- Controles actuales: flechas/WASD mover; clic/Tab objetivo; F/Enter atacar; 1–3 habilidades; Esc cerrar/pausar; botón pausa.
- La sesión parte de `868700d` (rama `opencode/42952272654`), igual a `origin/main` tras fetch. Publicar solo con fast-forward (`git push origin HEAD:main`), nunca force push.
- Ignorar por completo branches/tags `opencode-*` y `graveyard-*` viejos; no mergearlos a ciegas.
- `playwright-cli` necesita `playwright-cli install-browser chromium` si la caché está vacía. Este modelo de agente no puede leer imágenes: verificar con `playwright-cli eval` (píxeles pintados del canvas, texto del HUD, estado de juego) y `playwright-cli console`.
- Los screenshots se guardan fuera del repo (`/tmp/opencode/shots`); `screenshots/` está ignorado por `.gitignore`.

## Historial de verificación conservado
- 2026-11-11: consola 0 errores/0 advertencias tras cargar y jugar (Tab, F, W); canvas 917×675 con >600k píxeles pintados; HUD vivo (`healthValue` cayó a 20/130 por daño de bots durante la prueba).
- Sesiones previas: verificación del cerebro en 3002 con capturas desktop/mobile, recursos HTTP 200 y consola limpia; commits `9880942` y `868700d` publicados en `main` tras validar `game.js`/`dist/game.js` en Chromium.
