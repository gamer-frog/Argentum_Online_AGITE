# PROTOCOLO DE TRABAJO (LOOP)

> Manual operativo y cola: [`README.md`](README.md) y [`TODO.md`](TODO.md).
> Este archivo define **cómo** se ejecuta y verifica cada tarea.

## 1. Reglas inquebrantables

1. **Una tarea por ciclo.** No mezclar producto, refactor y documentación en el mismo cambio salvo que sean inseparables.
2. **No inventar alcance.** Si un pedido no está en `USER_REQUESTS.md` o en una decisión de `DECISIONS.md`, no se implementa. Ante duda, preguntar o registrar la asunción.
3. **No hacer `git merge` a ciegas** de branches viejas (`opencode-checkpoints/*`, `opencode-resume/*`, `graveyard-*`). Reconstruir leyendo el código y verificar.
4. **Código defensivo.** No acceder a `obj.prop` sin guardia. Usar `obj?.prop ?? default` o un `if (!obj) return`.
5. **Si se renombra un campo, actualizar todos los usos** en el mismo cambio.
6. **Build verde no es suficiente.** Toda tarea de producto se verifica en navegador con consola 0 errores / 0 advertencias antes de considerarse terminada.
7. **Mantener `game.js` y `dist/game.js` sincronizados**, junto con `index.html`, `styles.css` y `favicon.svg` cuando corresponda. `start.sh` copia al arrancar, pero el repo debe quedar consistente.
8. **Publicar en `main` al cerrar cada tarea** (pedido explícito del usuario, 2026-11-18: si no se pushea, el trabajo no queda guardado). Commit en la rama de trabajo, integración a `main` y `git push origin main`; nunca `--force`. Si `main` divergió, merge y conflictos a favor del estado verificado del loop, conservando la infraestructura que solo está en `main`.
9. **Ignorar `gh`.** Usar `git` directamente. No bloquearse por autenticación de GitHub CLI.
10. **No borrar pedidos pendientes.** Se mueven a `[x]`/`[~]` con evidencia, o se archivan en `HISTORY.md`.

## 2. Antes de empezar

- Leer `HANDOFF.md`, `TODO.md` y `DECISIONS.md`.
- Confirmar que `git status --short` no tiene cambios ajenos sin explicar.
- Verificar que la tarea elegida está en «Ahora» y tiene alcance, no-objetivos y criterios de aceptación.
- Si la tarea depende de una decisión abierta, no tomarla: elegir la siguiente no bloqueada.

## 3. Durante la implementación

- Leer el código real antes de modificarlo; no asumir nombres de campos.
- Hacer el cambio mínimo que cumple el criterio de aceptación.
- No aprovechar para «mejorar» cosas no pedidas.
- Si aparece un bloqueo nuevo, registrarlo en `TODO.md`/`DECISIONS.md` y seguir solo si hay una parte segura que se pueda cerrar.
- Si se toca lógica de combate, no cambiar números de balance sin una tarea específica y evidencia.

## 4. Verificación antes de cerrar

1. `bash 00_cerebro_loop/verify.sh` → debe terminar en verde.
2. Servidor persistente: `PORT=3002 bash start.sh`.
3. Navegador: `playwright-cli open http://localhost:3002`.
4. Consola: `playwright-cli console` → 0 errores / 0 advertencias.
5. Probar el flujo completo afectado y los controles básicos (mover, apuntar, atacar, hechizos, pociones, pausa, reinicio).
6. Revisar escritorio **1440×1000** y móvil **390×844** (o 320 px si la tarea es de layout).
7. Guardar evidencia en `/tmp/opencode/shots/` y anotar la ruta.

## 5. Cierre de tarea

- Marcar la tarea en `TODO.md` y `ROADMAP.md`.
- Agregar una entrada breve en `HISTORY.md` con: qué se hizo, cómo se verificó, qué queda pendiente.
- Actualizar `HANDOFF.md`: estado, próxima tarea y bloqueos.
- Si cambió una decisión, actualizar `DECISIONS.md`.
- Si cambió el alcance visible, actualizar `README.md`.
- Reportar: tarea, resultado, evidencia, próximo paso y si quedó listo para publicar.

## 6. Errores y reversión

- Si aparece `TypeError: Cannot read properties of undefined (reading '...')`, detenerse. Buscar el acceso sin guardia y corregirlo; no seguir agregando features sobre un estado roto.
- Si un cambio rompe el navegador y no se corrige en dos intentos, revertir solo ese cambio (`git restore` de los archivos afectados) y registrar el bloqueo.
- No usar `git reset --hard` sobre trabajo ajeno. No descartar cambios sin inspeccionarlos.

## 7. Reporte (formato compacto)

Usar un formato estable; los emojis son opcionales pero consistentes:

```text
🚀 [T1] Inventario/equipo visual | Comenzando
🔍 Alcance: slots vacíos, sin mecánicas
🟢 Preflight verde | Consola 0/0 | 1440 + 390
📝 TODO/HANDOFF/HISTORY actualizados
✅ [T1] Completado | Evidencia: /tmp/opencode/shots/...
```

Estados: 🚀 inicio · ✅ completado · ⚠️ advertencia · ❌ falló · 🔄 reintento · 🟢 verde · 🔴 rojo · 🛑 detenido · 🧠 cerebro actualizado.

## 8. Regla de oro

**El loop no avanza por cantidad de cambios, sino por tareas cerradas con evidencia.** Es mejor una tarea pequeña, verificada y documentada que cinco cambios a medias.
