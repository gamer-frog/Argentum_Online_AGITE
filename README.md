# Argentum Online — Reinos

Prototipo web local inspirado en **Argentum Online**. Presenta un mundo explorable al centro, controles de personaje y paneles laterales para estado, objetivos, habilidades e interfaces futuras. El combate actual es una arena de prueba con formatos 1v1, 2v2, 3v3 y 4v4; todavía no es un cliente fiel ni una recreación completa de AO.

> **Referencia de fidelidad:** Argentum Online Libre, cliente oficial de la organización [ao-libre](https://github.com/ao-libre), repositorio [ao-libre/ao-cliente](https://github.com/ao-libre/ao-cliente), revisión `7d32d61759d6b95069aba72ae12bed03c1d13700`. El cliente incluye gráficos (`Graficos/`), mapas (`Mapas/Alkon/`), efectos y sonidos; esta revisión fijada es la fuente de los recursos seleccionados, no una afirmación de fidelidad completa del prototipo.
>
> **Licencia y recursos:** el repositorio de referencia declara **AGPL-3.0** en su raíz y GitHub API la reporta como `agpl-3.0`, tanto para el cliente como para el servidor fijados. `INIT/Creditos.txt` atribuye los mapas a ReyarB y lista colaboradores gráficos, pero no asigna autoría a cada lámina. Los recursos seleccionados y `assets/ao/ATTRIBUTION.txt` se versionan junto al prototipo; antes de redistribuirlos, conserva los avisos upstream y revisa las condiciones aplicables a cada recurso. La [auditoría por recurso](roadmap/licencias-recursos.md) confirma copias exactas de 203 PNG y 3 WAV, detalla las atribuciones obligatorias, los bloqueos y la obligación de ofrecer fuente si el sitio se publica (AGPL §13). El inventario documenta el alcance y las limitaciones sin presumir una licencia individual que no se haya verificado.

## Recursos gráficos locales

Con un checkout completo de [ao-libre/ao-cliente](https://github.com/ao-libre/ao-cliente) que incluya `LICENSE` y `INIT/Creditos.txt`, extraé los mapas oficiales configurados en `scripts/extract_ao_assets.py` (Ullathorpe 1, Nix 34, Banderbill 59, Lindos 62 y Arena 272), sus láminas referenciadas y los datos de personajes:

```bash
python3 scripts/extract_ao_assets.py /ruta/a/ao-cliente
```

El resultado se genera en `assets/ao/`: incluye cinco mapas de 100×100 en `assets/ao/maps/<ID>.json` y un `maps.json` con nombres y coordenadas oficiales de aparición (coordenadas del servidor, base 1). La rotación aprobada el 2026-11-16 (`D1`) usa **Ullathorpe (1), Nix (34), Banderbill (59), Lindos (62) y Arena (272)**, en ese orden. La partida inicia en un mapa al azar de esa lista, avanza al siguiente cada cinco bajas y, al reiniciar, elige un mapa distinto del inicio anterior y del actual; si ninguno de los otros carga, conserva el actual. Si una carga falla durante la rotación por bajas, también conserva el mapa actual. `ATTRIBUTION.txt` registra revisión, fuentes, créditos y cautelas de licencia. El prototipo mantiene sus actores y combate. Si faltan los datos gráficos, inicia una arena visual alternativa que no representa los gráficos auténticos de AO.

### Efectos y sonidos de hechizos

Se extrajeron de la revisión fijada del cliente tres efectos completos (animación Grh, offset y WAV), referenciados en `assets/ao/spellfx.json` y `assets/ao/ATTRIBUTION.txt`:

| Hechizo AO | ID | FX / Grh / WAV | Uso visual aproximado |
| --- | ---: | --- | --- |
| Dardo Mágico | 2 | 15 / 275 / 114 | Ráfaga Ígnea del clérigo (fallback) |
| Paralizar | 9 | 8 / 183 / 16 | Inmovilizar del mago, clérigo y paladín |
| Apocalipsis | 25 | 13 / 259 / 27 | Apocalipsis y Juicio Final del mago |

Las tres asociaciones con habilidades del prototipo son aproximaciones para reutilizar recursos, no equivalencias de nombre, daño, alcance o reglas. Cuando están disponibles, el canvas dibuja la animación original sobre la casilla objetivo con los offsets de `fxs.ini`, y el audio usa el WAV correspondiente; sin esos recursos se conserva el efecto genérico y el tono de reserva. No hay un WAV asociado a las habilidades de curación actuales.

Auditoría completa de los ocho hechizos del prototipo, con estado `original` / `reutilizado` / `reserva`, Grh, WAV y límites verificados: [`roadmap/fx-hechizos.md`](roadmap/fx-hechizos.md). Resultado: un FX original (Apocalipsis), tres reutilizados y cuatro en reserva.

### Alcance de las reglas de nivel 40

La revisión consultada del servidor es `ao-libre/ao-server` en `ca6ad7ff428a585475373474ec5640eabe05961b`. El análisis fue estático (datos y código; no se ejecutó el servidor): el nivel máximo observado es 55 y la progresión de experiencia hasta nivel 40 usa el multiplicador 1,375. El HUD y los ocho combatientes usan el nivel 40 como contexto del escenario. Esto **no** significa que sus estadísticas reproduzcan las de un personaje de nivel 40: la vida, el maná y los golpes varían por clase, atributos y, para la vida, tiradas aleatorias; los costos y requisitos de hechizos dependen de los datos del hechizo y las condiciones de lanzamiento. Los perfiles de vida, maná, costos, daño y combate de este prototipo son valores de práctica aproximados, no calculados a partir de las reglas del servidor ni una simulación exacta de nivel 40.

La comparación regla por regla —ataque adyacente, intervalos, daño, alcance, apuntado, inmovilización/remoción, maná, stamina y pociones— está en [`roadmap/reglas-combate.md`](roadmap/reglas-combate.md), con valor implementado, línea de código, fuente AO Libre y etiqueta `confirmado` / `aproximado` / `práctica` / `sin dato`.

## Ejecutar localmente

Necesitás Python 3. Desde la raíz del repositorio, iniciá un servidor HTTP:

```bash
python3 -m http.server 3000
```

Abrí <http://localhost:3000>. No abras `index.html` directamente como archivo: la aplicación carga datos e imágenes mediante HTTP.

## Loop de desarrollo

El estado operativo, la cola de tareas y las decisiones del proyecto viven en [`00_cerebro_loop/`](00_cerebro_loop/):

- [`README.md`](00_cerebro_loop/README.md) — manual del ciclo: elegir una tarea, verificarla y cerrarla.
- [`TODO.md`](00_cerebro_loop/TODO.md) — qué se hace ahora y qué sigue.
- [`DECISIONS.md`](00_cerebro_loop/DECISIONS.md) — decisiones abiertas y asunciones vigentes.
- [`HANDOFF.md`](00_cerebro_loop/HANDOFF.md) — estado actual y próximo paso.
- [`HISTORY.md`](00_cerebro_loop/HISTORY.md) — historial de acciones verificadas.

Preflight local: `bash 00_cerebro_loop/verify.sh`. La validación final siempre se hace en navegador, en escritorio y móvil, con consola limpia.

## Controles

- **Flechas o WASD:** moverse en dirección cardinal, un casillero por paso.
- **Clic en un rival, en la lista o Tab:** seleccionar objetivo.
- **F o Enter:** atacar al rival cuando esté en un casillero adyacente.
- **Clic en una habilidad o teclas 1–4:** seleccionarla; luego elegí un rival para una habilidad ofensiva o tu personaje para curarte.
- **Arrastrar una habilidad:** mantené presionada la ranura y arrastrá hacia donde querés apuntar, como en Wild Rift: la mira nace en tu personaje y la orienta el arrastre (más recorrido = más alcance, con tope de visión y de pantalla), no la posición absoluta del dedo. Al pasar sobre un rival válido se engancha y muestra corchetes; al soltar se lanza. Volver al punto de apoyo cancela. En escritorio el riel de hechizos es una columna de 6 sobre el borde derecho del mundo; en móvil horizontal, una columna a la derecha de la pantalla.
- **E / Q:** armar Inmovilizar / Remover parálisis.
- **Teclas 5 y 6:** beber una poción roja (vida) o azul (maná). Son ilimitadas para la práctica, pero beber ocupa al personaje: no podés atacar ni lanzar hechizos mientras dura la acción, y un golpe o hechizo reciente tampoco te deja beber hasta recuperarte.
- **Esquiva:** los NPC anuncian algunos ataques con una línea y una mira; moverte durante el apuntado puede evitar el impacto.
- **Combatientes:** mostrar u ocultar la lista de combatientes. **Esc** cierra la lista o la guía.
- **FORMATO:** elegí **1v1**, **2v2**, **3v3** o **4v4** en la barra del mapa; carga la arena con esa cantidad de combatientes por bando. Mientras dura el escenario la arena no rota; **REINICIAR** sale de la práctica.
- **☰:** pausar o reanudar.
- En pantallas táctiles, usá el pad en pantalla para moverte y el botón **ATACAR** para golpear.

La arena es local e infinita: no tiene puntuación ni estados de fin de partida. El selector de formato permite practicar **1v1, 2v2, 3v3 o 4v4** con los mismos actores y reglas; el escenario de práctica queda fijo en la arena hasta reiniciar. Las bajas aparecen únicamente como avisos informativos y cada combatiente reaparece después de **2,4 segundos**. Los ataques y habilidades ofensivas solo pueden dirigirse a rivales. El panel del objetivo muestra su vida, la distancia en casilleros y si el ataque está listo o cuánto falta para recuperarse.

## Estado y alcance

El prototipo incluye:

- Mundo central con movimiento cardinal y una arena de combate con formatos 1v1 a 4v4 y reaparición.
- Perfiles de guerrero, mago, clérigo y paladín, con estadísticas y habilidades propias.
- HUD de vida/maná, selección de objetivo con distancia y disponibilidad del ataque, habilidades, curación, inmovilización, esquiva, avisos informativos de bajas y registro de combate.
- Paneles laterales para personaje y objetivo, más marcadores explícitamente incompletos para inventario y equipo.
- Diseño adaptable a pantallas pequeñas; los controles táctiles son básicos.

**Aún no implementado:** inventario funcional, equipamiento, objetos de inventario (las pociones son un recurso de práctica ilimitado), persistencia, backend y multijugador en red. La UI es una dirección de prototipo, no una afirmación de fidelidad a una versión concreta de AO.

## Pendientes solicitados para el combate de agite

Estos puntos quedan registrados como backlog; varios están implementados de forma parcial o de práctica. Resolverlos gradualmente, validando cada etapa en el navegador y contrastando las reglas con AO Libre antes de presentarlas como fieles al original.

1. **Nombres y apuntado:** quitar “la facción” de los nombres; indicar la orientación sagrada/caótica en la clase (celeste/rojo). Al apuntar, mostrar solo la mira, sin texto “clase apuntando”. El color de la mira debe corresponder al hechizo preparado.
2. **Lanzamiento legible:** mostrar sobre el personaje el nombre del hechizo que lanza e incorporar animaciones auténticas de hechizos cuando se encuentren y verifiquen recursos compatibles.
3. **Ritmo y pociones (pociones implementadas):** las pociones rojas y azules son ilimitadas (teclas 5 y 6) y beber ocupa al personaje: bloquea atacar y lanzar durante la acción, y viceversa. Lanzar un hechizo también impide atacar brevemente (recuperación de lanzamiento). Los intervalos ya se contrastaron en [`roadmap/reglas-combate.md`](roadmap/reglas-combate.md): 1,1 s local vs 1,2 s AO; siguen siendo una aproximación de práctica.
4. **Movimiento (parcialmente implementado):** los NPC persiguen por rutas transitables, hacen desplazamientos laterales variables y siguen moviéndose durante el apuntado; la navegación penaliza casillas cercanas a aliados. Falta validar y ajustar el ritmo en playtest.
5. **Roles de clase (parcialmente implementado):** las tácticas aproximadas priorizan distancias distintas para guerreros/paladines y magos/clérigos; el mago evita el cuerpo a cuerpo y clérigos/magos prefieren hechizos a distancia. La colaboración actual se limita principalmente a curar y elegir objetivos; falta validar y profundizar.
6. **Reglas y balance (distancia y combo implementados, aproximados):** los hechizos se lanzan hasta la visión del personaje (Manhattan ≤ 11 en el prototipo); el alcance clásico de AO (rectángulo 11×9) queda como referencia y no coincide con esa geometría. El daño se balanceó para que un golpe + dos hechizos del mismo luchador sea aproximadamente letal (combo total ≈ 113–124 contra vidas de 90–145). Nombres, daños, alcance y tiempos ya están contrastados en [`roadmap/reglas-combate.md`](roadmap/reglas-combate.md); las diferencias se presentan como aproximadas o de práctica.
7. **Agite, estados y puntería (parcialmente implementado):** los hechizos de los bots se apuntan con mira y telégrafo (0,38–0,62 s), fallan con frecuencia humana contra blancos en movimiento y casi nunca fallan contra inmovilizados; los bots siguen moviéndose mientras apuntan. Falta variar mejor los momentos de inmovilización/remoción y hacer la persecución menos predecible.
8. **Cursores visibles:** mostrar persistentemente en pantalla el cursor/mira de cada jugador como en una pizarra colaborativa, moviéndose mientras intenta apuntar a rivales. Su puntería debe ser imperfecta y mejorar cuando el blanco está inmovilizado.
9. **Mensajes de estado:** reemplazar “inmovilizado”, “libre”, “fallas” y avisos similares por textos y presentación propios de Argentum, más pequeños; verificar terminología y estilo con una referencia concreta de AO.
10. **Nivel, recursos y apoyo de equipo:** llevar a todos los personajes a nivel 40 y calcular su vida/maná con las estadísticas correspondientes a ese nivel en la versión de AO Libre elegida. Aplicar los costos reales de maná de los hechizos: por ejemplo, un paladín que use varias veces Remover parálisis debe poder quedarse sin maná y necesitar apoyo de sus aliados. Hacer que los aliados (incluidos los magos) también puedan intentar salvar o remover estados de sus compañeros, no solo infligir daño; estas acciones deben tener demora y ocurrir de forma ocasional, no ser automáticas ni instantáneas. Verificar niveles, estadísticas, costos y reglas contra los datos del servidor antes de presentarlos como fieles.

### Inventario de importación de AO Libre

El [inventario verificable del subset](roadmap/inventario-recursos-ao.md) separa extracción, carga por la app y verificación visual. El subset contiene cinco mapas de 100×100, 1.511 registros Grh (1.472 estáticos y 39 animados), 203 PNG (201 referenciados por esos registros y dos no referenciados), tres WAV y datos limitados a 3 cuerpos, 4 cabezas y tres efectos. Los cinco mapas refieren 1.262 IDs Grh distintos. La carga/render del canvas se observó en Chromium, pero no se probaron individualmente todos los recursos ni se compararon con el cliente original. No se importaron assets de interfaz ni datos integrales de clases, objetos o reglas. Las atribuciones disponibles son generales; la [auditoría de licencias](roadmap/licencias-recursos.md) confirma AGPL-3.0 y copias exactas, pero la autoría por archivo sigue sin dato. La [referencia visual versionada](roadmap/referencia-visual.md) fija la geometría del formulario principal del cliente (1022×767 px) para comparar proporciones, no píxeles. No se presenta la fidelidad visual o mecánica como comprobada.

## Tecnologías

- HTML, CSS y JavaScript vanilla.
- Canvas 2D para el mundo, personajes y efectos de combate.
- El prototipo carga datos JSON e imágenes de `assets/ao/` (`maps.json`, `maps/<ID>.json`, `grhs.json`, `characters.json`, `spellfx.json`, `ATTRIBUTION.txt` y láminas en `graphics/`), generados con `scripts/extract_ao_assets.py` desde un checkout de [ao-libre/ao-cliente](https://github.com/ao-libre/ao-cliente). `map.json` es una copia de compatibilidad de la Arena que el cliente actual no solicita. El subset se versiona en Git para que la app publicada muestre los gráficos originales; el manifiesto de atribución viaja junto a los recursos y cualquier redistribución debe conservar la licencia AGPL-3.0 upstream y esos avisos.
- No usa framework, backend ni motor externo.

## Hoja de ruta para la práctica PvP

Fases graduales y verificables. Cada paso se valida en navegador antes de pasar al siguiente, y cada cambio de reglas se contrasta con AO Libre para decidir si es fiel o aproximación.

**Fase 1 — Arena libre legible y confiable (ahora)**
1. Verificar en navegador el flujo completo: mover, seleccionar objetivo (teclado y ciclo), atacar, daño por distancia, caer y reaparecer; la arena debe continuar sin puntuación ni fin de partida.
2. Mejorar el comportamiento de bots 4v4: perseguir, atacar al alcance correcto, curar o apoyar según perfil, con dificultad ajustable.
3. Mantener el reinicio como herramienta local de prueba y las notificaciones de baja como información, sin convertirlas en estadísticas de partida.

**Fase 2 — Reglas de AO aproximadas**
4. Contrastar con AO Libre: paso por casilleros, alcance de ataques, daño de hechizos/ArVersiones si aplica, tiempos de recuperación y dirección cardinal. Marcar cada regla como confirmada, aproximada, práctica o `sin dato` en [`roadmap/reglas-combate.md`](roadmap/reglas-combate.md).
5. Infraestructura de aula de práctica (conexión al referente del cliente AO Libre y análisis de datos de hechizos, clases y morfatalidad), registrada en `assets/ao/` con su atribución correspondiente.
6. Estados de combate fatales: paralizar, inmovilizar, remojar mana. Diferenciar perfiles guerrero/mago/clérigo/paladín en su rol real de equipo.

**Fase 3 — Sentirse AO**
7. Afinar mapa, sprites, animaciones y controles con los recursos originales y su atribución; el prefijo visual de la arena de práctica solo se usa si no hay recursos.
8. Interfaz de AO: inventario y equipamiento mínimos para la práctica (pociones de vida y mana), chat lateral, sonidos de golpes y hechizos si hay assets.
9. Escenarios de práctica: arenas pequeñas de variedad (1v1, 2v2, 3v3) con selectores de formato. **Hecho (T9, 2026-11-18):** selector en la barra del mapa, 1v1/2v2/3v3/4v4 sobre la arena existente; el escenario de práctica no rota de mapa.

**Fase 4 — Más allá de la práctica**
10. Multijugador en red local y persistencia de personaje, solo después de definir el alcance y sostener la fases anteriores.

Cada ítem se entrega pequeño, probado y publicado en `main`, con una etiqueta clara de qué queda pendiente.

<!-- omgithub:readme:start -->
## 🚀 Build, play, and remix with OMGithub

**Remixed using [OMGithub.com](https://go.ondev.store/).**

[![OMGithub](https://img.shields.io/badge/OMGithub-Open%20project-orange?style=for-the-badge)](https://go.ondev.store/gamer-frog/Argentum_Online_AGITE)
[![GitHub](https://img.shields.io/badge/GitHub-Source-181717?logo=github&style=for-the-badge)](https://github.com/gamer-frog/Argentum_Online_AGITE)

- 🎮 [Open the project](https://go.ondev.store/gamer-frog/Argentum_Online_AGITE).
- ✨ [Remix this project](https://go.ondev.store/gamer-frog/Argentum_Online_AGITE?remix=1).
- 💻 [Explore the source](https://github.com/gamer-frog/Argentum_Online_AGITE).
- 🛠️ [Check build runs](https://github.com/gamer-frog/Argentum_Online_AGITE/actions).
- 🐛 [Report an issue](https://github.com/gamer-frog/Argentum_Online_AGITE/issues).
- 👤 [Explore the creator's projects](https://go.ondev.store/gamer-frog).
- 🌍 [Create with OMGithub](https://go.ondev.store/).
- 🧬 [Explore the remix source](https://github.com/gamer-frog/Argentum_Online_AGITE).
<!-- omgithub:readme:end -->
