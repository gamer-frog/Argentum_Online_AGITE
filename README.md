# Argentum Online — Reinos

Prototipo web jugable de combate inspirado en **Argentum Online**. La arena enfrenta a dos legiones en un combate **4v4**: la Legión Sagrada (azul) contra la Legión Caótica (roja). Cada equipo tiene un guerrero, un mago, un clérigo y un paladín.

## Ejecutar localmente

Necesitás Python 3. Desde la raíz del repositorio, iniciá un servidor HTTP:

```bash
python3 -m http.server 3002
```

Abrí <http://localhost:3002>. No abras `index.html` directamente como archivo: la app carga datos e imágenes mediante HTTP.

## Cómo jugar

- **Flechas o WASD:** moverse por el mapa, un tile por paso y sin diagonales.
- **Clic en un personaje, en la lista o Tab:** seleccionar objetivo.
- **F o Enter:** atacar al rival cuando esté en un tile adyacente.
- **Clic en un hechizo o teclas 1–3:** seleccionar/cancelar una habilidad; luego clic en un rival para lanzar daño o en tu personaje para curarte.
- **Esquiva:** los NPC anuncian su apuntado con una línea, una mira y una etiqueta; mover al personaje durante la preparación puede evitar el impacto.
- **Combatientes:** mostrar u ocultar el marcador. **Esc** cierra el panel o la guía.
- **☰:** pausar o reanudar.
- En pantallas táctiles, usá el pad en pantalla para moverte y el botón **ATACAR** para golpear.

El objetivo de la arena es alcanzar **5 bajas**. Los personajes solo pueden atacar a integrantes de la legión contraria; la selección de objetivos y los hechizos ofensivos respetan esa regla.

## Alcance actual

El MVP incluye:

- Arena 4v4 con ocho combatientes y respawn.
- Perfiles de guerrero, mago, clérigo y paladín, con estadísticas, sprites y habilidades propias.
- Ataque cuerpo a cuerpo, daño, esquiva, curación propia, cooldowns, maná y efectos visuales de hechizos.
- Movimiento cardinal, selección de objetivos, HUD de vida/maná, bajas, registro de batalla y resultado de la partida.
- Mapa y personajes renderizados con recursos locales de AO, incluyendo restauración de transparencia en las hojas de sprites.

**Fuera de alcance por ahora:** inventario, objetos equipables y pociones de vida/maná no están implementados. Tampoco hay backend, persistencia, multijugador en red ni motor externo.

## Tecnologías

- HTML semántico para la interfaz.
- CSS vanilla para layout, HUD, paneles y adaptación visual.
- JavaScript vanilla en el navegador.
- Canvas 2D para el mapa, personajes, apuntado y efectos de combate.
- JSON y PNG locales cargados desde `assets/ao/` mediante `fetch`.
- No se usa framework, backend ni dependencia de motor de juego.

## Recursos y atribuciones

Los datos y gráficos utilizados por el prototipo están en `assets/ao/`:

- `map.json`: mapa y capas de tiles.
- `grhs.json`: definiciones de gráficos y referencias a hojas.
- `characters.json`: cuerpos, cabezas y direcciones de los personajes.
- `graphics/*.png`: hojas de gráficos AO utilizadas por el mapa y los combatientes.

El material fue recuperado dentro del repositorio de trabajo desde el proyecto **PlayGround** y se conserva localmente para esta demostración. La atribución y licencia original de cada recurso deben confirmarse contra la fuente de AO antes de una distribución pública; no se presentan estos recursos como creaciones originales de Reinos. El proyecto conserva la referencia temática a Argentum Online y no pretende ser una importación completa del juego.

## Progreso y pendientes

Completado en este MVP:

- roster 4v4 y separación de equipos;
- selección de clase y perfiles de estadísticas;
- targeting de enemigos, ataques y hechizos sin daño accidental a aliados;
- movimiento cardinal, respawn, HUD y registro de combate;
- apuntado NPC visible con ventana de esquiva;
- carga del mapa y sprites locales con transparencia corregida.

Pendiente:

- validar el flujo completo en navegador en distintos tamaños;
- confirmar atribuciones/licencias de todos los recursos AO;
- inventario, equipamiento y pociones;
- más contenido de clases, mapa y objetos, incorporado de forma incremental;
- orientación horizontal y controles táctiles más completos para Android;
- backend y partidas multijugador, si el prototipo evoluciona hacia ese objetivo.
