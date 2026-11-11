# HANDOFF (Estado Actual)

## Última acción completada
2026-11-11 · [A] Lote grande del usuario: balance Imperium AO nivel 40 (guerrero 380 vida SIN maná, mago 260/1400, clérigo 300/1200, paladín 330/1000; Paralizar 350 / Remover 330; daño melee 85-105/75-95/45-60/50-65 y hechizos ~95-120), Inmovilizar y Remover Parálisis como hechizos propios de mago/clérigo/paladín, skins por clase y facción (FACTION_LOOKS), barra de maná bajo la de vida (oculta para guerrero), límite de visión ~11 casilleros con revalidación al resolver ("fuera de vista"), jugador que apunta como los bots (telégrafo + mira EN VIVO del personaje al cursor + tiro a casilla con "al vacío"), atajos 1-4 hechizos / 5-6 pociones con 4º slot, y movimiento agite v3: nadie se queda quieto (persigue siempre, vuelve a su puesto sin blancos, baile en el anillo) a velocidad real de AO (STEP_DURATION .24 s/casillero ≈ 4 tiles/s tras correcciones del usuario: .13 "imposible", .4 "lento"). Verificaciones en Chromium: consola 0/0 tras cada cambio; probe 40 s con 7 parálisis liberadas end-to-end ("Removida"), ERRADO/esquivó activos, cap de visión respetado (máx 11); camino del jugador probado con eventos sintéticos (tecla 1 → click en suelo → aiming → resolución 'al vacío').

## Estado del build/navegador
🟢 Verde. `http://localhost:3002` sirve `dist/` vía `start.sh` (copia `game.js`→`dist/game.js` al arrancar). Consola limpia; jugable: mover, objetivo (Tab/clic), atacar (F), hechizos 1-4 con apuntado y tiro a casilla, pociones 5-6, esquiva, pausa y reinicio. NPCs combaten constantemente (quieto = morir); curas/remociones/apoyo operativos.

## PRÓXIMO PASO INMEDIATO
🎮 Playtest con el usuario del nuevo ritmo (velocidad .24 s, baile, telégrafos 0,38-0,62 s) y ajuste fino de números si algo chirría. Después: pulir densidad de parálisis (168 "Paralizado" en 30 s de probe puede sentirse encadenado) y probar Inmovilizar del jugador (mago/clérigo/paladín). La cola completa vive en `ROADMAP.md`.

## Decisiones de diseño tomadas
- La fuente de verdad del cerebro es `00_cerebro_loop/`; `HANDOFF.md`/`todo.md`/`user-requests.md` en la raíz son duplicados legacy del BOOT y no se actualizan.
- La regla v6.0 del usuario anula instrucciones previas del repo; por eso el bloque "REGLA SUPREMA" se retiró de `Agents.md` en esta iteración (el cambio ya estaba en el árbol de trabajo y coincide con la anulación solicitada).
- `game.js` es la fuente y `dist/game.js` la copia de despliegue: mantenerlos sincronizados en cada commit (start.sh también los copia al arrancar).
- Las mecánicas del prototipo siguen siendo aproximaciones de AO, no fidelidad confirmada; contrastar con AO Libre antes de presentar reglas como fieles.

## Contexto importante
- Ejecutar desde la raíz con `PORT=3002 bash start.sh`; abrir `http://localhost:3002`.
- Controles actuales: flechas/WASD mover; clic/Tab objetivo; F/Enter atacar; 1-4 hechizos (mira en vivo hasta el click, click en suelo = tiro a casilla); 5-6 pociones; Esc/click-derecho desarma el hechizo; Esc cerrar/pausar; botón pausa.
- La sesión parte de `868700d` (rama `opencode/42952272654`), igual a `origin/main` tras fetch. Publicar solo con fast-forward (`git push origin HEAD:main`), nunca force push.
- Ignorar por completo branches/tags `opencode-*` y `graveyard-*` viejos; no mergearlos a ciegas.
- `playwright-cli` necesita `playwright-cli install-browser chromium` si la caché está vacía. Este modelo de agente no puede leer imágenes: verificar con `playwright-cli eval` (píxeles pintados del canvas, texto del HUD, estado de juego) y `playwright-cli console`.
- Los screenshots se guardan fuera del repo (`/tmp/opencode/shots`); `screenshots/` está ignorado por `.gitignore`.

## Historial de verificación conservado
- 2026-11-11: consola 0 errores/0 advertencias tras cargar y jugar (Tab, F, W); canvas 917×675 con >600k píxeles pintados; HUD vivo (`healthValue` cayó a 20/130 por daño de bots durante la prueba).
- Sesiones previas: verificación del cerebro en 3002 con capturas desktop/mobile, recursos HTTP 200 y consola limpia; commits `9880942` y `868700d` publicados en `main` tras validar `game.js`/`dist/game.js` en Chromium.
