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
- **Combatientes:** mostrar u ocultar el marcador. **Esc** cierra el marcador o la guía.
- **☰:** pausar o reanudar.
- En pantallas táctiles, usá el pad en pantalla para moverte y el botón **ATACAR** para golpear.

La arena termina al alcanzar **5 bajas** o al agotarse los **3 minutos**. Los ataques y habilidades ofensivas solo pueden dirigirse a rivales. El panel del objetivo muestra su vida, la distancia en casilleros y si el ataque está listo o cuánto falta para recuperarse. Al caer, el aviso central muestra la cuenta regresiva de **2,4 segundos** hasta reaparecer; desaparece si la ronda termina antes.

## Estado y alcance

El prototipo incluye:

- Mundo central con movimiento cardinal y una arena de combate 4v4 con reaparición.
- Perfiles de guerrero, mago, clérigo y paladín, con estadísticas y habilidades propias.
- HUD de vida/maná, selección de objetivo con distancia y disponibilidad del ataque, habilidades, curación, inmovilización, esquiva, bajas y registro de combate.
- Paneles laterales para personaje y objetivo, más marcadores explícitamente incompletos para inventario y equipo.
- Diseño adaptable a pantallas pequeñas; los controles táctiles son básicos.

**Aún no implementado:** inventario funcional, equipamiento, objetos, pociones, persistencia, backend y multijugador en red. La UI es una dirección de prototipo, no una afirmación de fidelidad a una versión concreta de AO.

## Tecnologías

- HTML, CSS y JavaScript vanilla.
- Canvas 2D para el mundo, personajes y efectos de combate.
- El prototipo carga datos JSON e imágenes de `assets/ao/` (`map.json`, `grhs.json`, `characters.json`, `ATTRIBUTION.txt` y láminas en `graphics/`), generados con `scripts/extract_ao_assets.py` desde un checkout de [ao-libre/ao-cliente](https://github.com/ao-libre/ao-cliente). El subset se versiona en Git para que la app publicada muestre los gráficos originales; el manifiesto de atribución viaja junto a los recursos y cualquier redistribución debe conservar la licencia AGPL-3.0 upstream y esos avisos.
- No usa framework, backend ni motor externo.

## Hoja de ruta para la práctica PvP

Fases graduales y verificables. Cada paso se valida en navegador antes de pasar al siguiente, y cada cambio de reglas se contrasta con AO Libre para decidir si es fiel o aproximación.

**Fase 1 — Ronda legible y confiable (ahora)**
1. Verificar en navegador el flujo completo: mover, seleccionar objetivo (teclado y ciclo), atacar, daño por distancia, morir, reaparecer, fin de ronda por bajas o por tiempo.
2. Comportamiento de bots 4v4 previsibles: perseguir, atacar al alcance correcto, curar o apoyar según perfil, con dificultad ajustable.
3. Resumen de ronda: victorias por equipo, bajas individuales y daño causado/recibido, con botón para reiniciar al instante.

**Fase 2 — Reglas de AO aproximadas**
4. Contrastar con AO Libre: paso por casilleros, alcance de ataques, daño de hechizos/ArVersiones si aplica, tiempos de recuperación y dirección cardinal. Marcar cada regla como confirmada o aproximada en el README.
5. Infraestructura de aula de práctica (conexión al referente del cliente AO Libre y análisis de datos de hechizos, clases y morfatalidad), registrada en `assets/ao/` con su atribución correspondiente.
6. Estados de combate fatales: paralizar, inmovilizar, remojar mana. Diferenciar perfiles guerrero/mago/clérigo/paladín en su rol real de equipo.

**Fase 3 — Sentirse AO**
7. Afinar mapa, sprites, animaciones y controles con los recursos originales y su atribución; el prefijo visual de la arena de práctica solo se usa si no hay recursos.
8. Interfaz de AO: inventario y equipamiento mínimos para la práctica (pociones de vida y mana), chat lateral, sonidos de golpes y hechizos si hay assets.
9. Escenarios cortos: arenas pequeñas de variedad (1v1, 2v2, 3v3) con selectores y contadores de ronda.

**Fase 4 — Más allá de la práctica**
10. Multijugador en red local y persistencia de personaje, solo después de definir el alcance y sostener la fases anteriores.

Cada ítem se entrega pequeño, probado y publicado en `main`, con una etiqueta clara de qué queda pendiente.
