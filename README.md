# Argentum Online — Reinos

Prototipo web local inspirado en **Argentum Online**. Presenta un mundo explorable al centro, controles de personaje y paneles laterales para estado, objetivos, habilidades e interfaces futuras. El combate actual es una arena de prueba 4v4; todavía no es un cliente fiel ni una recreación completa de AO.

> **Referencia de fidelidad pendiente:** aún no se eligió una versión específica de Argentum Online como referencia. Las decisiones visuales y de mecánicas que dependan de ella quedan abiertas.
>
> **Recursos externos no incluidos:** el prototipo necesita datos y gráficos en `assets/ao/`, pero esa carpeta no se incluye en el repositorio. Su procedencia y permisos están pendientes de verificación; no los publiques ni redistribuyas sin confirmar licencias y atribuciones. No se presentan como material original del proyecto.

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
- El prototipo solicita datos JSON e imágenes de `assets/ao/`. Sin esos archivos, el mundo y la partida no pueden cargarse; la carpeta está excluida de Git hasta verificar la procedencia y los permisos.
- No usa framework, backend ni motor externo.

## Próximos pasos

1. Elegir y documentar una versión de AO como referencia de fidelidad.
2. Verificar procedencia, licencias y atribuciones de cada recurso antes de cualquier distribución pública; sustituir los recursos que no puedan aclararse.
3. Validar movimiento, inmovilización, esquiva e interfaz en navegador, escritorio y móvil.
4. Diseñar e implementar inventario y equipo solo después de definir el alcance del cliente.
5. Evaluar funciones en línea únicamente si el prototipo avanza hacia un cliente multijugador.
