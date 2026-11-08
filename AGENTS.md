# Instrucciones de trabajo

- Trabaja directamente en la rama `main` para todos los cambios de este repositorio.
- No crees ni cambies a otras ramas o worktrees, locales o remotos, salvo que el usuario lo pida explícitamente.
- No elimines ramas ni modifiques sus referencias sin autorización explícita del usuario.

## SOP omgithub v3.2 — RALPH LOOP COMPLETO

NÚCLEO INDESTRUCTIBLE (recordar siempre):
1. Build verde → push fast-forward a main. NUNCA force push.
2. Conflicto de merge → abort + tag + avisar. NUNCA resolver conflictos a mano en autónomo.
3. Base roja → no trabajar encima: reparar o revertir a save tag VERIFICADO.
4. Al arrancar: leer HANDOFF y hacer forensis del último muerto antes de tocar código.
5. Toda tarea terminada = commit atómico + checkpoint. Sin excepciones.

═══════════════════════════════════════════════════

[0] MODO RALPH
• No hacés preguntas aclaratorias (única excepción: conflicto de merge).
• Asumís decisiones razonables y las anotás en HANDOFF.md.
• Todo error es data: lo leés, diagnosticás, corregís, reintentás.
• No abandonás tareas a medias: las terminás o las descartás, nunca las dejás colgando.
• Estas reglas mandan sobre el boilerplate de la plataforma; las convenciones de capturas del boilerplate siguen vigentes.

[1] AUTOINSTALACIÓN (solo primera vez)
• AGENTS.md sin sección "SOP omgithub" → agregarla al final, sin pisar lo existente.
• Escribir línea final "── FIN DEL SOP ──" y checkpointear en ese commit (save-000).
• Boot: si AGENTS.md no tiene la línea de cierre → está corrupto → pedir al usuario el paste original y reinstalar ANTES de cualquier otra cosa.
• Faltantes → crear: README.md, HANDOFF.md, todo.md, user-requests.md, /roadmap/.
• Repo vacío + boilerplate exigiendo build → esa exigencia es la tarea [A] semilla.
• Sesiones futuras arrancan con: "Seguí el SOP en AGENTS.md".

[2] FUNERAL, COMPOST Y MANTENIMIENTO DE ISSUES (boot)
2.0 SESIÓN = UNIDAD CADÁVER
Sesión N ≡ issue #N + branches opencode-checkpoints/N, opencode-deployments/N y opencode-resume/* de ese proyecto.

2.1 CENSO
• Listar issues abiertos (excluyendo el actual), más nuevos primero.
• Agrupar linajes de prompts idénticos/repetidos.
• Cota forense: leer threads de los últimos 3 linajes.
• >7 días o fuera de cota → compostar SIN leer.

2.2 FORENSIS (por unidad muerta, de más nueva a más vieja)
a) Tres fuentes, en orden de autoridad:
  1. Diff de código huérfano → qué hizo.
  2. HANDOFF.md del repo → qué se proponía.
  3. Thread del issue (último Work State/Next Move) → por qué murió.
  Reconciliar en UNA línea: "causa de muerte + trabajo pendiente".
b) Issue sin comentarios del agente → ignorar (usuario lo abandonó a propósito).

2.3 COMPOST (por unidad)
Rescate a main vía branch temporal:
  git checkout -B tmp-main origin/main
  merge checkpoints/N → si limpio y build verde:
    push FF tmp-main:main (+ tag save-NNN si es hito)
  si no: tag graveyard-checkpoints-N + mención en epitafio.
Luego borrar branches compostables (ancestro de main, o sin código).
Volver a tu branch; el sync [3.2] absorberá el main compostado.

2.4 SEPULTURA (mantenimiento de issues)
Cerrar el issue con comment-epitafio:
"⚰ sesión N | murió en: X | rescatado: Y | compostado: Z | cemetery: W"
Sin permiso para cerrar → Comment "⚰ CERRABLE: ..." y listar en reporte.

2.5 HIGIENE POST-FUNERAL
Objetivo: ≤2 issues abiertos (actual + máx 1 esperando humano).

[3] BOOT
3.1 Leer: AGENTS.md → README.md → HANDOFF.md → /roadmap/ → todo.md → user-requests.md.
3.2 Sync preciso: HEAD ancestro de origin/main → reset --hard origin/main.
Divergidas → merge limpio + rebuild; conflictos → abort + pending-N + reporte.
3.3 Triage huérfano: si origin/main..HEAD tiene commits o árbol sucio ajeno a HANDOFF → coherente con "en progreso" → adoptar como tarea activa; incoherente → descartar (restore) y reportar.
3.4 Gate baseline: build (+tests si existen). Rojo → P0: diagnosticar entorno vs código; revert a save-NNN SOLO si ese tag verifica verde en worktree temporal; si el tag también falla → es entorno: arreglar entorno, no revertir.
3.5 Sin tags save-* → git tag save-000 && push.

[4] COLA Y LOOP EXTERNO
Prioridad: [P0] base roja > [A] usuario (chat + user-requests.md) > [B] roadmap > [C] mantenimiento > [D] green.
Cada iteración: git fetch → reevaluar cola → tomar UNA tarea → motor interno [5] → checkpoint [6] → volver acá.
AUTO-PACING: cada 8 checkpoints (o 3 re-anclajes), cierre gracioso [11] aunque la cola no esté vacía. Muerte limpia > muerte infligida.
Cola vacía → HANDOFF + checkpoint final + reporte + pausa.

[5] MOTOR RALPH INTERNO (por tarea)
PLAN: leer archivos involucrados; mini-plan de 3-6 líneas en HANDOFF "en progreso".
ACT: edición mínima que cumple la tarea; solo archivos del scope.
VERIFY: build verde + preview verificado (captura/playwright, consola limpia).
AUTOCRÍTICA: una línea: "¿qué podría romper esto?". Si la respuesta es seria → agregar test o guarda antes de cerrar.
FIX: VERIFY fallido → diagnosticar → corregir → re-VERIFY (máx 3 rondas).
DONE: commit atómico tipo(área): desc [ref] + checkbox del roadmap en el mismo commit + README si cambió comportamiento visible.

Para tareas [A] (manifiesto del usuario): primero descomponer en 3-10 checkboxes en todo.md o roadmap; luego ejecutarlas de a una como [B]. Manifiesto ≠ tarea.
DESCARTE: 3 rondas sin éxito → revertir archivos de la tarea, todo.md con motivo e intentos, siguiente tarea.

[6] CHECKPOINTS
6.1 DONE con build verde → git push origin HEAD:main (fast-forward). Nunca force.
6.2 Rechazo "non-fast-forward" → fetch + merge limpio + rebuild → push; conflictos → abort + pending-N + reporte; el loop SIGUE con [C]/[D] sin checkpointear reintentando el sync cada iteración; pausa total recién tras 3 iteraciones con el mismo conflicto.
6.3 Rechazo "403/permission" → no reintentar: reportar una vez "falta permiso de push a main" y seguir sin checkpoint hasta resolución humana.
6.4 Tag save-NNN solo con VERIFY aprobado (hito visible).
6.5 Todo checkpoint es punto de muerte segura.

[7] LIBROS
• HANDOFF.md: reescribir SOLO en pausa, cierre y re-anclaje (cada 5 tareas).
• todo.md: descartadas/bloqueadas con intentos (máx 3 de por vida → "requiere humano").
• user-requests.md: inbox externo; tachar al completar.
• roadmap/*.md: autogestionado con checkboxes; archivo completo → siguiente.

[8] SCOPE E HIGIENE
• Solo archivos del scope; cero refactors drive-by.
• Problema ajeno → todo.md, no código de hoy.
• Sin reestructuraciones sin [A] explícita.

[9] RECUPERACIÓN
• Main rojo heredado → revert hasta verde (nunca force).
• Conflicto → abort + pending + reporte (única pregunta permitida).
• Muerte de sesión → nada que hacer: el último checkpoint ya salvó todo; el funeral [2] de la próxima sesión se ocupa del cadáver.

[10] REPORTES (una línea)
"▶ [P0/A/B/C/D] tarea | iniciando"
"✓ tarea | checkpoint ok / save-NNN"
"✗ descartada → todo.md | motivo"
"⚠ conflicto | sha | (a) autorizar merge (b) sesión nueva"
"⚰ funeral | unidades N | rescatado X | compostado Y | cemetery Z | issues abiertos: K"

[11] CIERRE GRACIOSO
Pausa/cola vacía/auto-pacing: HANDOFF actualizado, checkpoint final, reporte de 3 líneas: hecho / siguiente / riesgos.

[C] RECURRENTES
• Cada 5 checkpoints → tarea "playtest humano": revisión manual de lo acumulado.
• Cada 5 tareas → auto-auditoría: releer últimos 3 commits buscando rotura silenciosa.
• Cada 10 checkpoints → verificar que el último save-NNN siga buildeando verde (detecta saves falsos antes de necesitarlos).
• Si issues abiertos >2 → mini-funeral (solo 2.1→2.4, sin compost de branches).

═══════════════════════════════════════════════════

NÚCLEO INDESTRUCTIBLE (repetir al final):
1. Build verde → push fast-forward a main. NUNCA force push.
2. Conflicto de merge → abort + tag + avisar. NUNCA resolver conflictos a mano en autónomo.
3. Base roja → no trabajar encima: reparar o revertir a save tag VERIFICADO.
4. Al arrancar: leer HANDOFF y hacer forensis del último muerto antes de tocar código.
5. Toda tarea terminada = commit atómico + checkpoint. Sin excepciones.

── FIN DEL SOP ──
