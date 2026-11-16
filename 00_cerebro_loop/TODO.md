# TODO — cola viva

> **Actualizado:** 2026-11-16. **Regla:** una sola tarea en «Ahora». Las bloqueadas no detienen el loop.
> Orden completo y dependencias: [`ROADMAP.md`](ROADMAP.md). Decisiones: [`DECISIONS.md`](DECISIONS.md).

## Ahora

### T1 — Inventario/equipamiento: fase 1 visual

**Estado:** lista para empezar.
**Depende de:** `D2` (asunción A: solo presentación, sin mecánicas).
**Pedido:** interfaz clon visual de AO; inventario/equipo incompletos (`USER_REQUESTS.md` §2/§3).

**Alcance**

- Comparar el panel derecho actual con la captura de referencia a 1023×770.
- Rehacer la presentación de inventario y equipamiento con estética AO: grilla/slots, marcos, jerarquía y estados vacíos honestos.
- Reemplazar textos de «en desarrollo» por un estado vacío claro (por ejemplo, «sin objetos») solo si la referencia respalda la presentación.
- Mantener la estructura de datos y la lógica actuales; no agregar objetos, pesos, requisitos ni equipamiento funcional.

**No incluye**

- Mecánicas de inventario/equipamiento, objetos, pociones integradas ni persistencia.
- Cambiar el ancho global del HUD, la proporción del panel o el área de juego (`D3`).
- Rotación de mapas ni cambios de balance.

**Criterios de aceptación**

- [ ] Lista de brechas visuales (máximo 5) con captura de referencia y captura actual al mismo tamaño.
- [ ] Cada cambio de HTML/CSS se puede trazar a una diferencia observada; nada inventado.
- [ ] Inventario y equipo se leen como paneles AO, no como placeholders de dashboard.
- [ ] Sin overflow ni contenido cortado a 1440×1000 y 390×844.
- [ ] Consola 0 errores / 0 advertencias; controles básicos intactos.
- [ ] `dist/` sincronizado; `bash 00_cerebro_loop/verify.sh` verde.
- [ ] Evidencia y próximo paso registrados en `HISTORY.md` y `HANDOFF.md`.

**Evidencia**

- Referencia: galería oficial de `argentumonline.org` (1023×770 / 1024×770), inspeccionada el 2026-11-14.
- Captura actual: `/tmp/opencode/shots/hud-current-1023x770.png`.
- Recorte del panel derecho actual: `/tmp/opencode/shots/dock-current-1023x770.png`.
- Comparación previa: `HISTORY.md` (2026-11-15).

## Siguiente

### T2 — Rotación de mapas

**Estado:** bloqueada por `D1`.
**Pedido:** empezar en mapas distintos de una lista acordada y cambiar cada 5 bajas; el bosque actual entre Nix y Ullathorpe no gusta.

**Alcance al aprobarse**

- Fijar la lista aprobada (propuesta: Ullathorpe 1, Nix 34, Banderbill 59, Lindos 62, Arena 272).
- Garantizar un mapa inicial distinto entre partidas (sin repetir el inmediato anterior).
- Mantener el avance cada 5 bajas y el fallback si un mapa no carga.
- Verificar los cinco mapas en navegador y la rotación completa.

**Criterio de desbloqueo:** `D1` resuelta en `DECISIONS.md`.

### T3 — Animaciones auténticas de hechizos

**Estado:** pendiente; requiere verificar recursos compatibles.
**Pedido:** FX de lanzamiento/hechizos con animaciones originales y distinción clara del fallback (`USER_REQUESTS.md` §2).
**Primer paso:** auditar `assets/ao/spellfx.json` y los Grh/WAV disponibles; registrar qué hechizos tienen animación verificada y cuáles siguen en fallback.

### T4 — Contraste completo con AO Libre

**Estado:** investigación continua; no bloquea T1.
**Pedido:** ataques, hechizos, alcance, direcciones, tiempos, requisitos, estados, costos de maná y nivel 40, con etiqueta confirmado/aproximado/práctica.
**Primer paso:** matriz de reglas con fuente y estado; empezar por lo que afecta al combate actual.

## Bloqueadas / requieren decisión

- **D1 — Lista de mapas:** opciones A/B/C en `DECISIONS.md`. Mientras no se resuelva, no se toca la lista ni la lógica.
- **D2 — Alcance de inventario/equipo:** A visual (asunción actual), B funcional mínimo, C diferir.
- **Auditoría de licencias por recurso:** necesaria antes de redistribuir o ampliar assets; no bloquea el desarrollo local.
- **Referencia visual estable con versión/fecha:** deseable; la galería oficial alcanza para estilo/layout, no para fidelidad de píxeles.

## Terminadas recientemente

- [x] **Loop funcional (2026-11-16):** manual operativo, decisiones, cola única, historial separado, preflight y punteros legacy.
- [x] **Comparación visual y ataque aislado (2026-11-15):** panel derecho más denso en la referencia; daño `-90` confirmado sobre `chaoticPaladin`; sin cambio de layout.
- [x] **HUD sin contador de bajas (2026-11-14):** PvP infinito sin marcador; `dist/` sincronizado.
- [x] **`ERRADO` sobre el lanzador (2026-11-14):** las tres rutas de fallo anclan el texto al actor.
- [x] **Hechizos clickeados siguen al rival (2026-11-14):** daño e Inmovilizar resuelven aunque el blanco se mueva.
- [x] **Nombre del hechizo sobre el lanzador (2026-11-14):** verificado en combate real; sin cambios de código.

## Historial completo

Las tareas cerradas y su evidencia están en [`HISTORY.md`](HISTORY.md). No duplicar aquí el historial.
