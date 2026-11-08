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
- El prototipo carga datos JSON e imágenes de `assets/ao/` (`map.json`, `grhs.json`, `characters.json` y láminas en `graphics/`), generados con `scripts/extract_ao_assets.py`. La carpeta está excluida de Git; su manifiesto de atribución se genera junto a los recursos.
- No usa framework, backend ni motor externo.

## Próximos pasos

1. Validar y ajustar la práctica PvP: lectura del objetivo y alcance, ritmo de ataques, comportamiento de bots y escenarios cortos repetibles.
2. Contrastar paso por casilleros, alcance, daño, tiempos y habilidades con AO Libre, separando las reglas confirmadas de las aproximaciones.
3. Afinar mapa, sprites, animaciones y controles con los recursos originales y su atribución.
4. Probar interfaz y combate en navegador, escritorio y móvil; revisar avisos de recursos antes de redistribuirlos.
5. Diseñar inventario/equipo y evaluar juego en línea solo después de definir su alcance.
