# ROADMAP

- [x] Paso 1: actualizar refs con `git fetch origin` e inventariar 29 checkpoints, 23 resumes y 4 deployments.
- [x] Paso 2: crear los cinco archivos de seguimiento en `00_cerebro_loop/`.
- [x] Paso 3: intentar merge de checkpoint 39; conflictos add/add documentales, merge abortado y tip preservado con `graveyard-opencode-checkpoints-39`.
- [x] Paso 4: preservar tips en tags locales `graveyard-*` y eliminar las refs remotas `opencode-checkpoints/*` y `opencode-resume/*`, incluidos los tips 39 y 40 preservados en sus tags de cementerio. `git fetch --prune` y `git ls-remote` verificados.
- [x] Paso 5: merge de `origin/main` limpio; validación en Chromium aprobada (capturas desktop/mobile, canvas visible, ocho personajes y consola 0 errores/advertencias). Cierre publicado mediante fast-forward a `main`; tags `save-000`, `save-001` y `save-004` creados tras verificaciones aprobadas.
- [x] Revisar `roadmap/` y `todo.md` tras cerrar el BOOT: no hay tareas de producto pendientes con alcance definido; backlog vacío, se pausa sin iniciar cambios ajenos.
- [x] Continuación BOOT 2026-11-08: preservar `306cac6` con `graveyard-opencode-checkpoints-40-tip-306cac6`, integrarlo por fast-forward y eliminar `opencode-checkpoints/40`; `git fetch --prune`/`git ls-remote` confirman cero refs remotas checkpoints/resumes.
- [x] Fundación del cerebro: conservar y completar `PROTOCOL.md`, actualizar el handoff y anteponer la regla suprema a `Agents.md` sin eliminar las instrucciones existentes.
- [x] Verificación de la fundación: iniciar el prototipo en `localhost:3002`, inspeccionar canvas/escena, probar controles básicos y confirmar cero errores/advertencias de consola en Chromium.
- [x] Cierre de esta subtarea (2026-11-11): registros de seguimiento completos, verificación en Chromium en `http://localhost:3002` (canvas pintado, combate activo, consola 0 errores/0 advertencias) y publicación segura a `main` con fast-forward.
- [x] Producto: referencia AO estable fijada en README (`ao-libre/ao-cliente` revisión `7d32d61`), atribución versionada en `assets/ao/ATTRIBUTION.txt` e inventario por categoría en `roadmap/inventario-recursos-ao.md`. La auditoría por recurso individual queda documentada como cautela antes de redistribuir; no se presume licencia por archivo no verificada.

## Cola de producto activa (backlog de agite del README)

Orden derivado de "Pendientes solicitados para el combate de agite" del README; cada ítem se verifica en navegador y se publica en `main` antes de pasar al siguiente.

- [x] Pociones rojas y azules ilimitadas para práctica: beber bloquea atacar/lanzar durante la acción y viceversa (backlog 3). Verificado en Chromium: teclas 4/5 y botones, cura con tope en vida máxima, candado de acción mutuo y cooldown visible en el slot.
- [x] Hechizos a cualquier distancia y ritmo realista: el lanzamiento comparte candado de acción con el ataque (backlog 3/6). Verificado en Chromium: "Golpe poderoso" (alcance clásico 1) lanzado a ~7-8 casilleros con daño 46; los bots también lanzan a cualquier distancia, ahora con mira/telégrafo de 0,58 s esquivable y fallo humano (82% contra blancos en movimiento, ~100% contra inmovilizados), cooldowns de hechizo 4,2 s+.
- [x] Balance de combo: un golpe + dos hechizos del mismo luchador aproximadamente letal (backlog 6). Daños ajustados (guerrero 38-50/50-64, mago 40-54/55-70, clérigo 36-48/50-64, paladín 39-51/49-63): combo total ≈ 113-124 contra vidas de 90-145; letal contra magos/clérigos y casi letal contra guerrero/paladín. Pendiente confirmar nombres/daños/tiempos contra AO Libre.
- [x] Nombres sin facción, mira sin texto con color según el hechizo preparado y textos de estado propios de AO, más pequeños (backlog 1/9). Nombres propios (Thalira, Bendrick, Aldric, Drakar, Morvath, Valthor, Grimwald) con color celeste/rojo por bando en roster/HUD/feed; mira de NPC sin texto "APUNTANDO", coloreada por hechizo (FX) o golpe; anillo punteado del jugador con color del hechizo preparado; textos flotantes AO ("Paralizado", "Removida", "esquivó", "falló") en tamaño menor. Corregido además el HUD que mostraba HP absoluta con signo %.
- [ ] Cursores/miras persistentes de cada NPC mientras intenta apuntar; puntería imperfecta que mejora contra blancos inmovilizados (backlog 8).
- [ ] Apoyo aliado con demora ocasional: remoción de parálisis y salvataje por parte de magos y clérigos, no instantáneo (backlog 10).
- [ ] Validación en playtest del ritmo de bots y ajustes de balance resultantes (backlog 4/5/7).
