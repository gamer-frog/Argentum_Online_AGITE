# USER REQUESTS — lista rescatada (fuente de verdad del loop)

> **Rescate completo 2026-11-13.** Esta es la lista de pedidos que se había perdido. Se reconstruyó leyendo:
> - `.omgithub/conversation.json` en los **83 commits** que lo tocaron: **141 mensajes de usuario únicos** (2026-11-07 → 2026-11-13).
> - `README.md`, secciones «Pendientes solicitados para el combate de agite» y «Hoja de ruta para la práctica PvP».
> - `roadmap/producto-recuperado.md`, `roadmap/hechizos-referencia.md` y `roadmap/inventario-recursos-ao.md`.
> - **Todas las refs**: `main`, `opencode-checkpoints/*`, `opencode-deployments/*`, `opencode-resume/*`, tags `save-*` y `graveyard-*`.
>
> No se agregó ninguna feature nueva. Estados: `[x]` verificado en Chromium con consola 0/0; `[~]` implementado con límites; `[ ]` pendiente. **Ante duda, ejecutar el próximo `[ ]` de este archivo antes que cualquier idea propia.** El usuario pidió explícitamente no hacer «mejoras random» (2026-11-12/13).
>
> **Auditoría del loop 2026-11-16:** se eliminaron duplicados entre secciones, se unificó la decisión de mapas (`D1`) y el alcance de inventario (`D2`), y se alineó la regla de publicación con la sesión actual (sin commit/push sin pedido explícito). Las decisiones abiertas y sus asunciones viven en `DECISIONS.md`; la cola viva, en `TODO.md`.

## 0. Reglas permanentes del usuario (proceso, no producto)

- [x] Trabajar en `main`; no llenar el repo de branches. Publicar cuando el usuario lo pida y mantener el preview actualizado al publicar. En esta sesión: no commit ni push sin pedido explícito.
- [x] No hacer mejoras no pedidas: ejecutar los pedidos concretos de este archivo.
- [x] Verificar en navegador (`http://localhost:3002`) con consola 100% limpia antes de publicar; usar `?.` y código defensivo.
- [x] Es una build request: no preguntar, asumir y avisar los supuestos al terminar.
- [x] Mantener `game.js` y `dist/game.js` sincronizados en cada cambio.
- [x] Si un pedido cambia (ej.: «recarga de maná» → «pociones infinitas»), vale la última versión; la anterior queda como superseded.

## 1. Pedidos implementados y verificados

- [x] **Nombres y apuntado (README backlog 1).** Sin «la facción» en el nombre; orientación sagrada/caótica con color celeste/rojo; al apuntar se muestra solo la mira, sin el texto «clase apuntando»; el color de la mira corresponde al hechizo preparado.
- [x] **Miras por hechizo (12/12).** Fuego naranja `#ff9a54`, rayo teal `#64d8d0`, luz/clérigo dorado `#f4df9b`, golpes rojos `#ff685b`, curas verdes `#9ee68b`. Verificado con probe (25 miras, todas con color correcto).
- [x] **Mira del jugador.** Se pinta en vivo entre el personaje y el mouse; click en rival lanza, click en el suelo hace tiro a casilla, click desactiva; Esc/click-derecho desarma; el jugador apunta con el mismo telégrafo que los bots.
- [x] **Hechizos directos al rival clickeado.** Los lanzamientos de daño e Inmovilizar con click directo siguen al rival elegido durante la mira y resuelven sobre él aunque se mueva. Verificado en Chromium con Inmovilizar contra `chaoticPaladin` (se movió durante la mira y recibió el hechizo; textos «Inmovilizar» y «Paralizado»). No cambia tiros a casilla, apuntado NPC ni apoyo/hechizos sobre aliados.
- [x] **Todos los hechizos se apuntan, incluida la cura.** «CURAR» no es instantáneo; tiempos de lanzamiento aleatorios; nadie lanza sin telégrafo.
- [x] **Nombre del hechizo lanzado sobre el personaje.** Los lanzamientos efectivos muestran el nombre sobre el lanzador; verificado en Chromium durante combate real (por ejemplo, «Remover parálisis») junto con estados/daño. Consola limpia. No se modificó código porque la función ya estaba implementada.
- [x] **Texto `ERRADO` sobre el lanzador.** Las tres rutas de error de `resolveNpcAim`/`resolveTileAim` anclan el texto al actor con `addFloatingText(actor, ...)`. Verificado en Chromium forzando fallos: `/tmp/opencode/shots/errado-actor.png` muestra `ERRADO` sobre el personaje; consola limpia. `game.js` y `dist/game.js` sincronizados.
- [x] **Intervalo global de lanzamiento.** El `castCd` compartido impide spam; el melee también deja intervalo. Los NPC no clickean varias veces por segundo.
- [x] **Visión como límite.** Nadie lanza fuera del área en pantalla (~11 casillas Manhattan), jugador y NPC, incluido apoyo a aliados; se revalida al resolver («fuera de vista»).
- [x] **Maná visible debajo de la vida.** Barra azul y valor real para mago/clérigo/paladín; el guerrero no tiene maná y la fila/barra queda oculta.
- [x] **Inmovilizar (no Paralizar) + Remover Parálisis** como hechizos propios de mago, clérigo y paladín; costos de maná; el congelado intenta auto-removerse.
- [x] **Skin por clase y por facción** (raza humana por ahora); nombres propios coloreados por bando.
- [x] **Balance Imperium nivel 40.** Guerrero 380 vida sin maná; mago 260/1400; clérigo 300/1200; paladín 330/1000. Melee 85-105 / 75-95 / 45-60 / 50-65; golpe + dos hechizos ≈ letal contra ~300 de vida.
- [x] **Hechizos de la wiki de Imperium AO.** Apocalipsis 117-119, Juicio Final 142-144, Ráfaga Ígnea 98-100, Sanar 40-45, Castigo Divino 90-92, Fuente de vida 25-32. Detalle y límites en `roadmap/hechizos-referencia.md`.
- [x] **Pociones rojas y azules infinitas** (teclas 5/6 y botones); beber bloquea atacar/lanzar durante la acción y viceversa; cooldown visible en el slot.
- [x] **Lanzar un hechizo NO frena al jugador:** camina mientras apunta y el hechizo sale desde su posición actual.
- [x] **Atajos:** E = Inmovilizar, Q = Remover Parálisis, ESPACIO = pegar (además de F/Enter).
- [x] **Movimiento de agite.** Nadie se queda quieto; persecución permanente del blanco más cercano; regreso al puesto si no hay blancos; `STEP_DURATION = .22` s (Imperium AO Classic, ~4,5 casilleros/s) tras iterar .095 → .21 → .4 → .22; pasos encadenados sin pausa; flanqueo y jitter; el mago nunca entra a melee y se retira si lo presionan; blancos inmovilizados prioritarios.
- [x] **Roles de equipo.** Paladín inmoviliza y golpea; guerrero golpea; mago se mantiene lejos y lanza; clérigo apoya/remueve al paladín y ataca objetivos inmovilizados. Etiquetas tácticas aún no contrastadas con AO Libre.
- [x] **Cursores/miras persistentes de cada NPC.** Puntería imperfecta (82% contra blanco móvil, casi 100% contra inmovilizado), re-apuntado hasta 2 veces y disco de lock contra inmovilizados.
- [x] **Apoyo aliado con demora ocasional.** Magos y clérigos curan/remueven estados de compañeros sin ser instantáneos; tope de reintentos para no quedar plantados.
- [x] **PvP infinito sin contador de bajas ni condición de victoria.** Las bajas son informativas; se eliminó el marcador/condición de ronda que el usuario prohibió.
- [x] **Spawn/respawn sano.** Conserva la formación, los muertos no bloquean casillas, el kill-feed tolera nombres ausentes.
- [x] **Importación de AO Libre.** Subset inventariado: cinco mapas de 100×100; 1.262 IDs Grh distintos referenciados por sus capas; 1.511 registros Grh (1.472 estáticos y 39 animados); 203 PNG (201 referenciados por los registros Grh y dos no referenciados); 3 WAV; 3 cuerpos/4 cabezas/tres efectos, con atribución versionada. La carga/render del canvas se observó en Chromium, sin verificación individual de cada recurso ni comparación completa con el cliente original. Inventario y límites en `roadmap/inventario-recursos-ao.md`.
- [x] **Textos de estado propios de AO**, más pequeños («Paralizado», «Removida», «esquivó», «falló»), y nombres de clase solos cuando se pidió (luego evolucionó a nombres propios por facción).
- [x] **Hechizos a cualquier distancia** como regla de práctica (jugador y bots), con el alcance clásico como referencia y no como límite.

## 2. Pedidos parciales (implementados con límites)

- [~] **Interfaz clon visual de AO.** Existen HUD, panel de personaje/objetivo y roster, pero no es un clon fiel: inventario/equipo están incompletos. La comparación lado a lado a 1023×770 se completó el 2026-11-15; la diferencia de proporción no se ajustó por falta de especificación (`D3`). **T1 completado el 2026-11-16:** inventario 5×7/35, equipo 2×2, títulos AO y ranuras biseladas, sin mecánicas ni cambio de ancho del HUD. Falta la funcionalidad de objetos (`D2=B`).
- [~] **FX de lanzamiento.** El nombre del hechizo ya se muestra sobre el lanzador; falta incorporar animaciones auténticas cuando se verifiquen recursos compatibles y distinguirlas del fallback.
- [~] **FX de hechizos.** Auditoría 2026-11-16 (`roadmap/fx-hechizos.md`): 1 FX original (Apocalipsis), 3 reutilizados (Juicio Final, Ráfaga Ígnea, Inmovilizar) y 4 en reserva (Sanar, Castigo Divino, Fuente de vida, Remover parálisis). No hay FX original de AO Libre para los seis hechizos de Imperium.
- [~] **Reglas contrastadas con AO Libre.** Nombres/daños de Imperium verificados; alcances, tiempos exactos y costos de maná siguen siendo aproximados o de práctica.
- [~] **Nivel 40.** Vida/maná de Imperium usados, pero las fórmulas de atributos de AO Libre no se verificaron.
- [~] **Roles de clase.** La táctica está implementada; las etiquetas de rol no se validaron contra AO Libre.
- [~] **Estados y remociones.** Funcionan; falta variar mejor los momentos y confirmar terminología/estilo con una referencia AO concreta.
- [~] **Cada clase con comportamiento propio.** Hay rangos, prioridades y retirada del mago; falta profundizar.
- [~] **Más extracción de AO Libre.** El subset es limitado; falta auditoría de licencia/atribución por archivo.
- [~] **Referencia visual de AO.** La galería oficial está disponible y sirve para comparar estilo/layout; se inspeccionaron sus seis imágenes (1023×770 o 1024×770). No indican versión ni fecha de captura. El `Last-Modified` de los archivos no acredita la toma ni el cliente, y el «V:5» visible en una imagen no basta para fijar una versión verificable. La comparación lado a lado con la captura actual se completó el 2026-11-15 a 1023×770; el detalle está en `HISTORY.md`. No se ajustó el layout porque no hay especificación que justifique estrechar el panel y reducir el espacio de juego (`D3`).
- [~] **Mira persistente / intenciones visibles.** Implementada en NPC; revisar duración y cambio de hechizo para que casi siempre se lea qué intentan hacer.

## 3. Pedidos pendientes (lista perdida, rescatada)

- [x] **Rotación de mapas (`D1` aprobada el 2026-11-16, pedido textual, issues #47-#48).** Lista fija en `game.js`: Ullathorpe (1) → Nix (34) → Banderbill (59) → Lindos (62) → Arena (272). Inicio aleatorio dentro de la lista, sin repetir el inicio anterior al reiniciar, avance cada 5 bajas y fallback al mapa actual si una carga falla. Verificado en navegador con la rotación completa (25 bajas) y capturas de los cinco mapas.
- [ ] **Interfaz clon visual fiel de AO (`T1` completado en fase visual).** Reconstruir el layout con personaje/vida/stats/inventario/mapa a la derecha; usar la barra inferior de «objetos» como slots de hechizos; comparar capturas al mismo tamaño; validar escritorio y móvil sin ocultar funciones. Hecho: seis ranuras en una fila a 320/390/1440 px, sin Google Fonts y sin contador de bajas. La comparación a 1023×770 se completó el 2026-11-15: la referencia tiene panel más estrecho/denso e inventario/equipo funcionales; el HUD actual reserva más área al campo de batalla y esas secciones estaban incompletas. **2026-11-16:** inventario 5×7/35, equipo 2×2, títulos AO y ranuras biseladas; sin cambio de ancho (`D3`) ni mecánicas. Falta funcionalidad de objetos y pulido fino contra la referencia.
- [ ] **Inventario funcional, equipamiento y objetos/pociones integrados (`D2`).** Hoy son secciones visuales sin objetos. La fase visual A se ejecutó en T1; sigue pendiente B) definir contrato de objetos y funcionalidad mínima. No inventar reglas de objetos ni mecánicas sin decisión.
- [ ] **Animaciones auténticas de hechizos** cuando se encuentren/verifiquen recursos compatibles; distinguir visualmente el fallback. Auditoría local completa; solo Apocalipsis tiene FX original, porque los demás nombres no existen en AO Libre o carecen de recurso extraído.
- [ ] **Chat lateral y sonidos de golpes/hechizos** si hay recursos licenciados.
- [ ] **Escenarios de práctica 1v1, 2v2 y 3v3** con selector de formato.
- [ ] **Multijugador en red y persistencia de personaje**, pospuestos hasta definir alcance y sostener las fases anteriores.
- [~] **Metadatos de referencia visual AO** (versión/fecha de captura aún no confirmadas). Evaluación 2026-11-14: la galería oficial enlaza seis capturas que muestran el HUD completo, disponibles para la comparación visual; la página sólo usa el alt genérico «Screenshot» y no identifica versión/fecha de captura. Sus PNG miden 1023×770 (1–3) y 1024×770 (4–6), sin metadatos de versión o fecha. `Last-Modified: 2026-10-22` data la publicación del archivo, no la captura; «V:5» en pantalla no identifica una versión verificable. La limitación se documenta. La comparación lado a lado ya se ejecutó el 2026-11-15; no requiere bloquear tareas visuales, aunque tampoco justifica por sí sola cambiar proporciones del HUD.
- [ ] **Auditoría de licencias/atribuciones por recurso** antes de redistribuir.
- [ ] **Contraste completo con AO Libre:** ataques, hechizos, alcance, direcciones, tiempos, requisitos, estados, costos de maná y estadísticas de nivel 40. Registrar cada regla como confirmada, aproximada o decisión de práctica.
- [ ] **Ajuste del combo:** confirmar Curar heridas graves vs Sanar; evaluar `Fuente de vida` 30-45 (wiki 2012); validar mago (Apocalipsis/Juicio Final), paladín y clérigo (Ráfaga + Sanar). No inventar valores «reales».
- [ ] **Agotamiento de maná del paladín** tras varios Remover Parálisis y necesidad de apoyo aliado (hoy los costos son de práctica).
- [ ] **Variar momentos de inmovilización/remoción/curación/ataque;** persecución menos predecible; evitar oscilaciones, bloqueos y pares quietos cara a cara.
- [ ] **Terminología y estilo de los mensajes de estado** contra una referencia AO concreta.
- [~] **Acelerar la visualización de cambios en live preview:** el loop deja cada tarea verificada y lista para publicar; en esta sesión se publica solo cuando el usuario lo pide explícitamente. No acumular tareas sin registrar estado.

### 3.1 Decisiones abiertas

El detalle, las opciones y la asunción vigente están en [`DECISIONS.md`](DECISIONS.md):

- **D1 — Lista de mapas:** resuelta el 2026-11-16 con la lista Ullathorpe (1), Nix (34), Banderbill (59), Lindos (62) y Arena (272); implementada y verificada en `T2`.
- **D2 — Inventario/equipo:** A) visual primero (asunción actual), B) funcional mínimo, C) diferir.

## 4. Pedidos explícitamente descartados o superseded

- [x] **Contador de bajas / condición de victoria / fin de partida:** descartado por pedido del usuario («no hay objetivo por ahora, es solo pvpear infinitamente»).
- [x] **Recarga de maná 100% más rápida:** reemplazado por «pociones de vida y maná infinitas».
- [x] **Nombres de rol (Guerrero/Clerigo/…):** se pidió primero, luego se cambió a solo nombre de clase y después a nombres propios con color de facción.
- [x] **Paralizar:** el hechizo pedido es **Inmovilizar**, no Paralizar.

## 5. Citas textuales rescatadas (para trazabilidad)

Transcripción literal, con errores originales, de los pedidos que originaron la lista:

- «el "color de las miras" de los personajes, debe coincidir con el hechizo que intetnan tirar. Ademas recorda que tienen que mvoerse mas fluido, comom lo haria un humano…»
- «"CURAR" no es algo "instantaneo" los personajes tienen que puntar absolutamente TODOS los hechizos, y siempre tienen que tener tiempos randoms para tirarlos… errar un hechizo no es "ESQUIVO" es "ERRADO" de parte del lanzador.»
- «los personajes no estan erspetando el intervalo global creo… no pueden tirar hechizos en todo el mapa, solo en el rango de su vision…»
- «se deberia de ver "LA MANA" de los personajes, debajo de su barrita de vida.»
- «inmobilizar y remover paralisis son dos hechizos que deberian de tener tanto magos como clericos como paladines… balanceado a como era en imperium ao, donde a nivel 40, tenes por ahi 300 de vida y te moris de golpe hechizo hechizo.»
- «se deberiade ver tambien "LA MIRA DEL USUARIO" asi como se ve la de los bots.»
- «cuando yo marco un hechizo, se tiene que pintar la mira entre mi personaje y el mouse, hsta que yo haga click nuevamente en algun lado…»
- «en este juego, nadie nunca se queda quieto. Si te quedas quieto = morir. Ademas tampoco tienen que correr a velocidades imposibles…»
- «inmo en la E, remo en la Q. pegar con espacio.»
- «hacer click para laznar hechizo NO TE FRENA.»
- «Los personajes no se deben frenar para apuntar, siempre deben seguir apuntando mientras se mueven. Deben usar pociones… que al igual que un humano, no te apunte perfectamente…»
- «el te4xto errado debe estar SOBRE EL PERSONAJE y no donde hizo el click.»
- «cada vez que empieza el live preview… debe arrancar siempre en un mapa distinto, entre una lista de x ubicaciones que elijamos juntos. Proponeme las mas famosas y te digo cuales usaremos.»
- «cada 5 kills deberiamos de cambiar de mapa. como para cambiar entre los mapas mas "famosos" de argentum online. Las ciudades, las arenas, etc. ahora estamos en un bosque feo entre nix y ulla torpe. no megusta.»
- «Los cambios enfocados a: las skin de los personajes, sus nombres, sus colores, su "mira".»
- «no se esta viendo bien su mira, se tiene que ver todo lo que apuntan incluso curas, no pieden INSTA APUNTAR PERFECTO, deben de fallar, al igual que un humano.»
- «la mira donde elos apuntan debe durar mas tiempo… o ver si cambian de hechizo que cambie esa mira…»
- «nadie puede tirar hechizos fuera de la pantalla… CORREN LENTO COMO SI ESTUVIERAN TRABADOS!»
- «Nisiquiera tiene el color de su propia faccion el nombre de los personajes. deberian ser rojos y celestes los nombres. y los hechizos el texto en color gris…»
- «recorda que los personajes deben correr freneticamente y no acercarse tanto entre si. Sino hasta los magos se van a melee y un mago jamas haria eso… La ia… es medio torpe, no se mueven para todos lados buscando el inmo…»
- «Para la logica de EL AGITE… un paladin=inmo golpe, guerrero=golpe, mago=estar lejos y tirar hechizos, clerigo=remodel pala y hechizos al que tiene inmo.»
- «lo de "cantidad de bajas" sacalo. no hay objetivo por ahora. es solo pvpear infinitamente.»
- «Reconstruí la interfaz como un clon visual fiel de Argentum Online, no como un dashboard genérico… la barra de "objetos" de abajo, es donde deben ir los hechizos.»
- «A esas FILES busca todo tipo de notas tanto en el repo como en la app (hoja de ruta) y en branches anteriores… tenes que encontrar todas las cosas que ya habia pedido y meterlas en esta lista…» (este pedido se perdió; se ejecuta ahora).
- «No te pongas a hacer mejoras random yo había hecho pedidos específicos.» (2026-11-13, detonante de este rescate).
- «Estoy recontra seguro de que hice un montón de pedidos de cambios.» (2026-11-13).
- «Buscamos en wiki de imperium ao también.» (2026-11-13).

## 6. Fuentes y método del rescate

- **Conversaciones:** 83 commits con `.omgithub/conversation.json`; 141 mensajes `type: user` únicos, extraídos con script y deduplicados por hash. Cubren issues #3 a #60.
- **Docs de producto:** `README.md` (10 pendientes + hoja de ruta), `roadmap/producto-recuperado.md` (prioridades 0-5), `roadmap/hechizos-referencia.md`, `roadmap/inventario-recursos-ao.md`.
- **Refs revisadas:** `git log --all` sobre el cerebro, `roadmap/`, `README.md`, `todo.md` y `user-requests.md`; `git for-each-ref` sobre todas las ramas remotas y tags. `main` contiene la versión más completa del cerebro; las ramas viejas no tenían pedidos adicionales, sólo estados intermedios.
- **Descartado:** el único pedido visible que se eliminó a propósito fue el marcador/condición de victoria (`f2f9f22`), porque el usuario lo prohibió.

**Estado de este archivo:** canónico. Si aparece un pedido nuevo del usuario, agregarlo acá con fecha y estado; si se implementa, marcarlo `[x]` con la evidencia de Chromium. No borrar los pedidos pendientes: moverlos a `[x]`/`[~]` con la verificación.
