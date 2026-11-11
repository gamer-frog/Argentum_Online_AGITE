# HANDOFF (Estado Actual)

## Última acción completada
2026-11-11 · GAUNTLET LOOP v6.0 · Iteración 4 [B]: nombres sin facción + mira sin texto + textos AO. Nombres propios (Thalira, Bendrick, Aldric, Drakar, Morvath, Valthor, Grimwald) en ACTORS, roster, HUD y feed, con color celeste/rojo por bando (`.name-sacred`/`.name-chaotic`); la etiqueta del propio jugador se actualiza al cambiar clase. Mira de NPC sin texto "APUNTANDO", coloreada por hechizo (`SPELL_AIM_COLORS` por FX) o roja para golpe; anillo punteado del jugador con color del hechizo preparado (verde curas). Textos flotantes AO más pequeños: "Paralizado", "Removida", "esquivó", "falló". Fix adicional: targetStatus mostraba HP absoluta con % (112%) en vez del porcentaje real. Verificado en Chromium: consola 0 errores, canvas pintado, color enemigo rgb(229,122,109), mira con habilidad seleccionada sin errores.

## Estado del build/navegador
🟢 Verde. `http://localhost:3002` sirve `dist/` vía `start.sh` (copia `game.js`→`dist/game.js` al arrancar). Consola limpia; el juego es jugable: mover, seleccionar objetivo (Tab/clic), atacar (F), habilidades 1–3, esquiva, pausa y reinicio. Los bots combaten activamente (el jugador recibe daño si no se mueve).

## PRÓXIMO PASO INMEDIATO
🚀 Iteración 5 [B] — Cursores/miras persistentes de cada NPC mientras intenta apuntar y puntería imperfecta que mejora contra blancos inmovilizados (backlog 8): hoy la mira existe durante el telégrafo; falta que los NPCs mantengan la mira mientras persiguen (no solo al disparar) y que el bono de puntería contra inmovilizados sea visible para el jugador. Después: apoyo aliado con demora ocasional y validación de playtest. La cola completa vive en `ROADMAP.md`.

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
