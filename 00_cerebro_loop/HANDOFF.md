# HANDOFF (Estado Actual)

## Última acción completada
2026-11-12 · [A] Regresión de balance corregida: el ataque melee básico del jugador usaba `rand(11,18)` en vez del daño por clase del pedido Imperium. Ahora usa `MELEE_DAMAGE` (guerrero 85-105, paladín 75-95, mago 45-60, clérigo 50-65) igual que los NPC; además `applyClass` cancela un apuntado en curso y libera `attackCd` para que no quede un hechizo viejo de la clase anterior. Verificación en Chromium: ataque real adyacente al GUERRERO enemigo con delta de vida **102** (`-102` flotante), consola 0 errores/0 advertencias.

## Estado del build/navegador
🟢 Verde. `http://localhost:3002` sirve `dist/` vía `start.sh` (copia `game.js`→`dist/game.js` al arrancar). Consola limpia; jugable: mover, objetivo (Tab/clic), atacar (F), hechizos 1-4 con apuntado y tiro a casilla, pociones 5-6, esquiva, pausa y reinicio. NPCs combaten constantemente (quieto = morir); curas/remociones/apoyo operativos.

## PRÓXIMO PASO INMEDIATO
🛠️ [C] Cerrar la brecha visual/maná del guerrero: ocultar de verdad la fila y barra de maná cuando la clase no tiene maná (hoy muestra "—" y una barra vacía), y sincronizar `dist/index.html` con el HTML actual (el arranque lo copia, pero el archivo versionado quedó viejo). Después: playtest del ritmo de bots (velocidad .22 s, baile, telégrafos 0,38-0,62 s) y ajuste fino de números; la cola completa vive en `ROADMAP.md`.

## Decisiones de diseño tomadas
- La fuente de verdad del cerebro es `00_cerebro_loop/`; `HANDOFF.md`/`todo.md`/`user-requests.md` en la raíz son duplicados legacy del BOOT y no se actualizan.
- La regla v6.0 del usuario anula instrucciones previas del repo; por eso el bloque "REGLA SUPREMA" se retiró de `Agents.md` en esta iteración (el cambio ya estaba en el árbol de trabajo y coincide con la anulación solicitada).
- `game.js` es la fuente y `dist/game.js` la copia de despliegue: mantenerlos sincronizados en cada commit (start.sh también los copia al arrancar).
- Las mecánicas del prototipo siguen siendo aproximaciones de AO, no fidelidad confirmada; contrastar con AO Libre antes de presentar reglas como fieles.

## Contexto importante
- Ejecutar desde la raíz con `PORT=3002 bash start.sh`; abrir `http://localhost:3002`.
- Controles actuales: flechas/WASD mover; clic/Tab objetivo; F/Enter/ESPACIO atacar; 1-4 hechizos (mira en vivo hasta el click, click en suelo = tiro a casilla, lanzar NO frena el movimiento); E arma Inmovilizar; Q arma Remover Parálisis; 5-6 pociones; Esc/click-derecho desarma el hechizo; Esc cerrar/pausar; botón pausa.
- La sesión parte de `868700d` (rama `opencode/42952272654`), igual a `origin/main` tras fetch. Publicar solo con fast-forward (`git push origin HEAD:main`), nunca force push.
- Ignorar por completo branches/tags `opencode-*` y `graveyard-*` viejos; no mergearlos a ciegas.
- `playwright-cli` necesita `playwright-cli install-browser chromium` si la caché está vacía. Este modelo de agente no puede leer imágenes: verificar con `playwright-cli eval` (píxeles pintados del canvas, texto del HUD, estado de juego) y `playwright-cli console`.
- Los screenshots se guardan fuera del repo (`/tmp/opencode/shots`); `screenshots/` está ignorado por `.gitignore`.

## Historial de verificación conservado
- 2026-11-11: consola 0 errores/0 advertencias tras cargar y jugar (Tab, F, W); canvas 917×675 con >600k píxeles pintados; HUD vivo (`healthValue` cayó a 20/130 por daño de bots durante la prueba).
- Sesiones previas: verificación del cerebro en 3002 con capturas desktop/mobile, recursos HTTP 200 y consola limpia; commits `9880942` y `868700d` publicados en `main` tras validar `game.js`/`dist/game.js` en Chromium.
