# Argentum Online — Reinos

Prototipo web local inspirado en **Argentum Online**. Presenta un mundo explorable al centro, controles de personaje y paneles laterales para estado, objetivos, habilidades e interfaces futuras. El combate actual es una arena de prueba 4v4; todavía no es un cliente fiel ni una recreación completa de AO.

> **Referencia de fidelidad:** Argentum Online Libre, cliente oficial de la organización [ao-libre](https://github.com/ao-libre), repositorio [ao-libre/ao-cliente](https://github.com/ao-libre/ao-cliente) (rama `master`). Ese repositorio incluye el cliente y carpetas de gráficos (`Graficos/`) y mapas (`Mapas/Alkon/`); es la referencia que debemos consultar para recuperar la apariencia auténtica de AO, no reemplazarla con arte genérico.
>
> **Licencia y recursos:** el repositorio de referencia incluye `LICENSE` AGPL-3.0 y el whitepaper de AO Libre declara que su código y recursos se publican bajo GPL. `INIT/Creditos.txt` atribuye los mapas a ReyarB y lista colaboradores gráficos, aunque no asigna autoría a cada lámina. El extractor conserva esta procedencia en `assets/ao/ATTRIBUTION.txt`; los recursos generados son locales y están excluidos de Git. Antes de redistribuirlos, conserva la licencia upstream y revisa cualquier aviso específico de cada recurso.

## Recursos gráficos locales

Con un checkout completo de [ao-libre/ao-cliente](https://github.com/ao-libre/ao-cliente) que incluya `LICENSE` y `INIT/Creditos.txt`, extraé el mapa 2, sus láminas referenciadas y los datos de personajes:

```bash
python3 scripts/extract_ao_assets.py /ruta/a/ao-cliente
```

El resultado se genera en `assets/ao/` y no se versiona. `ATTRIBUTION.txt` registra revisión del checkout, archivos de origen, créditos consultados y cautelas de licencia. El prototipo mantiene sus actores y combate; usa estos recursos para dibujar el mundo y los personajes cuando los datos están disponibles. Si faltan, se inicia una arena visual alternativa para que el combate siga siendo practicable; esa arena no representa los gráficos auténticos de AO.

## Ejecutar localmente

Necesitás Python 3. Desde la raíz del repositorio, iniciá un servidor HTTP:

```bash
python3 -m http.server 3000
```

Abrí <http://localhost:3000>. No abras `index.html` directamente como archivo: la aplicación carga datos e imágenes mediante HTTP.

## Controles

- **Flechas o WASD:** moverse en dirección cardinal, un casillero por paso.
- **Clic en un rival, en la lista o Tab:** seleccionar objetivo.
- **F o Enter:** atacar al rival cuando esté en un casillero adyacente.
- **Clic en una habilidad o teclas 1–3:** seleccionarla; luego elegí un rival para una habilidad ofensiva o tu personaje para curarte.
- **Esquiva:** los NPC anuncian algunos ataques con una línea y una mira; moverte durante el apuntado puede evitar el impacto.
- **Combatientes:** mostrar u ocultar la lista de combatientes. **Esc** cierra la lista o la guía.
- **☰:** pausar o reanudar.
- En pantallas táctiles, usá el pad en pantalla para moverte y el botón **ATACAR** para golpear.

La arena 4v4 es local e infinita: no tiene puntuación ni estados de fin de partida. Las bajas aparecen únicamente como avisos informativos y cada combatiente reaparece después de **2,4 segundos**. Los ataques y habilidades ofensivas solo pueden dirigirse a rivales. El panel del objetivo muestra su vida, la distancia en casilleros y si el ataque está listo o cuánto falta para recuperarse.

## Estado y alcance

El prototipo incluye:

- Mundo central con movimiento cardinal y una arena de combate 4v4 con reaparición.
- Perfiles de guerrero, mago, clérigo y paladín, con estadísticas y habilidades propias.
- HUD de vida/maná, selección de objetivo con distancia y disponibilidad del ataque, habilidades, curación, inmovilización, esquiva, avisos informativos de bajas y registro de combate.
- Paneles laterales para personaje y objetivo, más marcadores explícitamente incompletos para inventario y equipo.
- Diseño adaptable a pantallas pequeñas; los controles táctiles son básicos.

**Aún no implementado:** inventario funcional, equipamiento, objetos, pociones, persistencia, backend y multijugador en red. La UI es una dirección de prototipo, no una afirmación de fidelidad a una versión concreta de AO.

## Pendientes solicitados para el combate de agite

Estos puntos quedan registrados como backlog; todavía no están implementados. Resolverlos gradualmente, validando cada etapa en el navegador y contrastando las reglas con AO Libre antes de presentarlas como fieles al original.

1. **Nombres y apuntado:** quitar “la facción” de los nombres; indicar la orientación sagrada/caótica en la clase (celeste/rojo). Al apuntar, mostrar solo la mira, sin texto “clase apuntando”. El color de la mira debe corresponder al hechizo preparado.
2. **Lanzamiento legible:** mostrar sobre el personaje el nombre del hechizo que lanza e incorporar animaciones auténticas de hechizos cuando se encuentren y verifiquen recursos compatibles.
3. **Ritmo y pociones:** ajustar los intervalos de ataques y hechizos a tiempos realistas de AO. Dar pociones rojas y azules ilimitadas para la práctica; beber una poción debe impedir atacar/lanzar durante esa acción, y viceversa.
4. **Movimiento:** sustituir los desplazamientos torpes de NPC por movimiento fluido y frenético, sin detenerse para apuntar. Los agentes deben variar trayectorias y decisiones en lugar de agruparse quietos junto al rival.
5. **Roles de clase:** dar tácticas distintas a cada clase y colaboración de equipo: por ejemplo, el mago prioriza distancia y hechizos; clérigo cura/apoya; cada clase usa sus habilidades especializadas. Evitar que el mago se acerque a golpear como táctica habitual.
6. **Reglas y balance:** permitir lanzar hechizos a cualquier distancia. Balancear los hechizos para que el combo buscado sea letal aproximadamente con un golpe y dos hechizos: mago (Apocalipsis/Juicio Final), paladín (hechizos de paladín), clérigo (Ráfaga y Curar heridas graves/Sanar). Confirmar nombres, daño y tiempos contra la versión de AO Libre elegida.
7. **Agite, estados y puntería:** hacer de inmovilizar/remover el centro táctico del combate; aprovechar que un rival inmovilizado es más fácil de apuntar y coordinar ataques aliados. Variar los momentos de inmovilización, remoción, curación y ataque. Los agentes deben apuntar mientras se mueven, fallar con frecuencia de forma humana y perseguir objetivos de manera menos predecible.
8. **Cursores visibles:** mostrar persistentemente en pantalla el cursor/mira de cada jugador como en una pizarra colaborativa, moviéndose mientras intenta apuntar a rivales. Su puntería debe ser imperfecta y mejorar cuando el blanco está inmovilizado.
9. **Mensajes de estado:** reemplazar “inmovilizado”, “libre”, “fallas” y avisos similares por textos y presentación propios de Argentum, más pequeños; verificar terminología y estilo con una referencia concreta de AO.

### Inventario de importación de AO Libre (por hacer)

Antes de importar más contenido, preparar un inventario verificable del cliente y sus recursos: categoría, ruta/archivo upstream, formato, licencia y atribución, utilidad para este prototipo, estado de extracción e integración, y dependencias o límites técnicos. Revisar al menos gráficos y sprites, animaciones de hechizos, mapas/tiles, datos de personajes y clases, hechizos/efectos, sonidos e interfaz; registrar también qué no se puede importar o redistribuir. Usar como fuente el repositorio y la revisión ya citados arriba, conservar sus licencias/créditos, y priorizar primero los assets necesarios para animaciones de hechizos y presentación de combate. No dar por importado un recurso hasta comprobarlo visualmente en el juego.

## Tecnologías

- HTML, CSS y JavaScript vanilla.
- Canvas 2D para el mundo, personajes y efectos de combate.
- El prototipo carga datos JSON e imágenes de `assets/ao/` (`map.json`, `grhs.json`, `characters.json`, `ATTRIBUTION.txt` y láminas en `graphics/`), generados con `scripts/extract_ao_assets.py` desde un checkout de [ao-libre/ao-cliente](https://github.com/ao-libre/ao-cliente). El subset se versiona en Git para que la app publicada muestre los gráficos originales; el manifiesto de atribución viaja junto a los recursos y cualquier redistribución debe conservar la licencia AGPL-3.0 upstream y esos avisos.
- No usa framework, backend ni motor externo.

## Hoja de ruta para la práctica PvP

Fases graduales y verificables. Cada paso se valida en navegador antes de pasar al siguiente, y cada cambio de reglas se contrasta con AO Libre para decidir si es fiel o aproximación.

**Fase 1 — Arena libre legible y confiable (ahora)**
1. Verificar en navegador el flujo completo: mover, seleccionar objetivo (teclado y ciclo), atacar, daño por distancia, caer y reaparecer; la arena debe continuar sin puntuación ni fin de partida.
2. Mejorar el comportamiento de bots 4v4: perseguir, atacar al alcance correcto, curar o apoyar según perfil, con dificultad ajustable.
3. Mantener el reinicio como herramienta local de prueba y las notificaciones de baja como información, sin convertirlas en estadísticas de partida.

**Fase 2 — Reglas de AO aproximadas**
4. Contrastar con AO Libre: paso por casilleros, alcance de ataques, daño de hechizos/ArVersiones si aplica, tiempos de recuperación y dirección cardinal. Marcar cada regla como confirmada o aproximada en el README.
5. Infraestructura de aula de práctica (conexión al referente del cliente AO Libre y análisis de datos de hechizos, clases y morfatalidad), registrada en `assets/ao/` con su atribución correspondiente.
6. Estados de combate fatales: paralizar, inmovilizar, remojar mana. Diferenciar perfiles guerrero/mago/clérigo/paladín en su rol real de equipo.

**Fase 3 — Sentirse AO**
7. Afinar mapa, sprites, animaciones y controles con los recursos originales y su atribución; el prefijo visual de la arena de práctica solo se usa si no hay recursos.
8. Interfaz de AO: inventario y equipamiento mínimos para la práctica (pociones de vida y mana), chat lateral, sonidos de golpes y hechizos si hay assets.
9. Escenarios de práctica: arenas pequeñas de variedad (1v1, 2v2, 3v3) con selectores de formato.

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
