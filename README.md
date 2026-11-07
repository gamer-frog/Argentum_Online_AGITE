# Argentum Online — Reinos

Prototipo web local inspirado en **Argentum Online**. Presenta un mundo explorable al centro, controles de personaje y paneles laterales para estado, objetivos, habilidades e interfaces futuras. El combate actual es una arena de prueba 4v4; todavía no es un cliente fiel ni una recreación completa de AO.

> **Referencia de fidelidad:** Argentum Online Libre, cliente oficial de la organización [ao-libre](https://github.com/ao-libre), repositorio [ao-libre/ao-cliente](https://github.com/ao-libre/ao-cliente) (rama `master`). Ese repositorio incluye el cliente y carpetas de gráficos (`Graficos/`) y mapas (`Mapas/Alkon/`); es la referencia que debemos consultar para recuperar la apariencia auténtica de AO, no reemplazarla con arte genérico.
>
> **Licencia y recursos:** `ao-cliente` declara licencia AGPL-3.0 para el repositorio, pero eso no confirma por sí solo los derechos/licencias de cada gráfico, mapa u otro recurso incluido. Antes de copiar o redistribuir recursos en esta app, verificar sus avisos, procedencia, atribución y permisos específicos. Los recursos convertidos para este prototipo no están incluidos en Git y se esperan bajo `assets/ao/`.

## Ejecutar localmente

Necesitás Python 3. Desde la raíz del repositorio, iniciá un servidor HTTP:

```bash
python3 -m http.server 3002
```

Abrí <http://localhost:3002>. No abras `index.html` directamente como archivo: la aplicación carga datos e imágenes mediante HTTP.

## Controles

- **Flechas o WASD:** moverse en dirección cardinal, un casillero por paso.
- **Clic en un rival, en la lista o Tab:** seleccionar objetivo.
- **F o Enter:** atacar al rival cuando esté en un casillero adyacente.
- **Clic en una habilidad o teclas 1–3:** seleccionarla; luego elegí un rival para una habilidad ofensiva o tu personaje para curarte.
- **Esquiva:** los NPC anuncian algunos ataques con una línea y una mira; moverte durante el apuntado puede evitar el impacto.
- **Combatientes:** mostrar u ocultar el marcador. **Esc** cierra el marcador o la guía.
- **☰:** pausar o reanudar.
- En pantallas táctiles, usá el pad en pantalla para moverte y el botón **ATACAR** para golpear.

La arena termina al alcanzar **5 bajas**. Los ataques y habilidades ofensivas solo pueden dirigirse a rivales.

## Estado y alcance

El prototipo incluye:

- Mundo central con movimiento cardinal y una arena de combate 4v4 con reaparición.
- Perfiles de guerrero, mago, clérigo y paladín, con estadísticas y habilidades propias.
- HUD de vida/maná, selección de objetivo, ataques, habilidades, curación, inmovilización, esquiva, bajas y registro de combate.
- Paneles laterales para personaje y objetivo, más marcadores explícitamente incompletos para inventario y equipo.
- Diseño adaptable a pantallas pequeñas; los controles táctiles son básicos.

**Aún no implementado:** inventario funcional, equipamiento, objetos, pociones, persistencia, backend y multijugador en red. La UI es una dirección de prototipo, no una afirmación de fidelidad a una versión concreta de AO.

## Tecnologías

- HTML, CSS y JavaScript vanilla.
- Canvas 2D para el mundo, personajes y efectos de combate.
- El prototipo solicita datos JSON e imágenes de `assets/ao/` (`map.json`, `grhs.json`, `characters.json` y láminas en `graphics/`). Sin esos archivos, el mundo no puede cargarse. Consultar [ao-libre/ao-cliente](https://github.com/ao-libre/ao-cliente) como fuente de referencia; la carpeta de recursos de este prototipo está excluida de Git hasta documentar y verificar los permisos y atribuciones de los archivos concretos.
- No usa framework, backend ni motor externo.

## Próximos pasos

1. Revisar `Graficos/`, `Mapas/Alkon/` y los datos del cliente en [ao-libre/ao-cliente](https://github.com/ao-libre/ao-cliente) para adaptar el cargador web a los recursos reales y recuperar la estética auténtica de AO.
2. Verificar procedencia, licencias y atribuciones de cada recurso concreto antes de copiarlo o distribuirlo; documentar y conservar los avisos aplicables.
3. Validar movimiento, inmovilización, esquiva e interfaz en navegador, escritorio y móvil.
4. Diseñar e implementar inventario y equipo solo después de definir el alcance del cliente.
5. Evaluar funciones en línea únicamente si el prototipo avanza hacia un cliente multijugador.
