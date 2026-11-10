# Hoja de ruta de producto recuperada

Este documento organiza solicitudes concretas encontradas en `README.md` y en el historial disponible de `.omgithub/conversation.json`. No convierte instrucciones de Git/BOOT, comentarios de aprobación ni mensajes como «continúa» en requisitos de producto. Las tareas siguen abiertas salvo donde se indica explícitamente que existe una implementación parcial; ninguna aproximación se presenta como fidelidad confirmada a AO.

## Contexto y límites

- Objetivo del proyecto: una práctica local de PvP/agite inspirada en Argentum Online, avanzando gradualmente hacia una interfaz y reglas visualmente y mecánicamente fieles a la referencia elegida.
- Fuente indicada: AO Libre, cliente `ao-libre/ao-cliente`, revisión `7d32d61759d6b95069aba72ae12bed03c1d13700`; revisar también el servidor fijado en README cuando se validen reglas. Mantener licencias, créditos y atribuciones de cada recurso.
- Estado conocido por README: existe una arena local 4v4, assets seleccionados del cliente y algunos efectos; inventario/equipo funcionales, persistencia, backend y multijugador en red siguen sin implementar. Parte de la IA y la interfaz es aproximada.
- «Clon exacto» expresa la meta del usuario, no un estado ya conseguido. No afirmar que una pantalla, regla, asset o estadística es auténtica sin comparación y verificación.
- Las referencias visuales web quedaron anotadas en el historial, pero no hay una captura subida al repositorio que permita una comparación visual controlada. Antes de declarar fidelidad de píxeles, recuperar una referencia estable y definir la resolución/versión de AO que se toma como patrón.

## Prioridad 0 — Recuperar y fijar las referencias

- [x] **Inventario verificable de importación de AO Libre:** registrar categoría, ruta upstream, formato, licencia/crédito, utilidad, estado de extracción e integración y límites técnicos. Cubrir sprites/gráficos, animaciones y efectos, mapas/tiles, clases/personajes, hechizos, sonidos e interfaz. Ver [`inventario-recursos-ao.md`](inventario-recursos-ao.md); alcance limitado al subset local.
- [x] Revisar el subset integrado separando «presente en el repositorio», «cargado por la app» y «verificado visualmente en juego». La evidencia confirma carga del canvas/recursos seleccionados, no inspección individual ni fidelidad visual; esos límites están registrados en el inventario.
- [x] Revisar los avisos y créditos disponibles en el checkout upstream fijado: declara AGPL-3.0 para Argentum Online y aporta créditos por categorías. Se conserva esa licencia declarada, procedencia y atribuciones disponibles en [`inventario-recursos-ao.md`](inventario-recursos-ao.md) y `assets/ao/ATTRIBUTION.txt`; no se infieren autores individuales donde el crédito no los especifica.
- [ ] Reunir una captura de referencia estable de la interfaz de AO Libre y registrar versión, resolución y procedencia. Las URLs compartidas anteriormente sirven como pistas, no como una referencia visual ya validada ni necesariamente de la misma versión.
- [ ] Aclarar si aún existe un estado recuperable de la app en el antiguo repositorio `PLAYGROUND`: el historial pide rescatar «todo» y recuperar avances/ruta perdidos, pero no identifica aquí una revisión concreta. No copiar ni descartar código hasta localizar y comparar una fuente verificable.

## Prioridad 1 — Interfaz reconocible de Argentum Online

- [ ] Reconstruir la interfaz tomando la referencia visual acordada, no un dashboard genérico; comparar capturas lado a lado en el mismo tamaño y corregir iterativamente las diferencias principales.
- [ ] Organizar la zona lateral para personaje, vida/estadísticas, inventario y mapa según la referencia. Mantener inventario/equipo identificados como incompletos mientras no tengan funcionalidad real.
- [ ] Usar la barra inferior de «objetos» como slots de hechizos, tal como se solicitó; mostrar selección/uso y estados de forma comprensible.
- [ ] Contrastar iconografía, proporciones, marcos, tipografía, colores y distribución con la captura elegida. No inventar detalles ausentes de la referencia.
- [ ] Validar en navegador en escritorio y móvil; una adaptación móvil puede reorganizar la composición, pero no debe ocultar funciones ni romper el flujo.

## Prioridad 2 — Combate de agite legible y practicable

- [ ] **Nombres y apuntado:** quitar «la facción» de los nombres; expresar orientación sagrada/caótica en la clase con celeste/rojo. Al apuntar, dejar la mira sin el texto «clase apuntando»; asociar el color de la mira al hechizo preparado.
- [ ] **Lanzamiento:** mostrar sobre el personaje el nombre del hechizo lanzado. Incorporar animaciones auténticas solo cuando se haya verificado que el recurso es compatible; distinguir visualmente fallback de recurso original.
- [ ] **Ritmo y pociones:** contrastar tiempos de recuperación con la versión de AO seleccionada. Proporcionar pociones rojas y azules ilimitadas para la práctica; beber una poción y atacar/lanzar deben ser acciones mutuamente excluyentes durante su ejecución.
- [ ] **Alcance:** permitir lanzar hechizos a cualquier distancia, según la solicitud registrada; verificar la regla en la versión elegida y documentar explícitamente si se conserva como regla de práctica o se ajusta a AO.
- [ ] **Estados y puntería:** hacer de inmovilizar/remover un centro táctico. Coordinar ataques sobre rivales inmovilizados, variar los momentos de inmovilización, remoción, curación y ataque, y permitir apuntar mientras se está en movimiento.
- [ ] Hacer la puntería imperfecta y humana, con mayor probabilidad de acertar a blancos inmovilizados; evitar que los agentes se alineen y queden enfrentados de forma estática.
- [ ] Mostrar persistentemente la mira/cursor de cada combatiente como en una pizarra colaborativa; permitir que se mueva mientras busca un blanco y reflejar la mejora de puntería frente a un rival inmovilizado.
- [ ] Sustituir mensajes genéricos como «inmovilizado», «libre» y «fallas» por textos compactos y presentación acordes a AO, una vez comprobados contra una referencia concreta.
- [ ] Mantener la práctica PvP infinita sin contador de bajas ni condición de victoria; las bajas/reapariciones son informativas y no un marcador de partida.

## Prioridad 3 — Movimiento y roles de equipo

- [ ] Hacer que los combatientes se muevan con ritmo frenético y trayectorias variadas, busquen ángulos para inmovilizar/atacar y no se acerquen innecesariamente unos a otros.
- [ ] Respetar distancias por rol: el mago debe priorizar mantenerse lejos y lanzar hechizos, no entrar en melee; diferenciar tácticas de guerreros, paladines, magos y clérigos.
- [ ] Evitar que los agentes se queden quietos o se paren cara a cara; desplazarse y seguir buscando oportunidades durante el apuntado, sin oscilaciones ni bloqueos en pasillos.
- [ ] Definir comportamientos de equipo solicitados: paladín orientado a inmovilizar y golpear; guerrero a golpear; mago a mantenerse a distancia y lanzar hechizos; clérigo a apoyar/remover al paladín y atacar objetivos inmovilizados. Validar estas etiquetas con AO Libre antes de presentarlas como roles oficiales.
- [ ] Revisar separación entre aliados, navegación por casillas transitables y elección de objetivos para evitar agrupamientos, rutas imposibles o persecuciones repetitivas.

**Estado parcial según README:** la navegación ya persigue por rutas, usa desplazamientos laterales variables y penaliza cercanía a aliados; hay preferencias aproximadas de distancia por clase y el apuntado no debería detener el movimiento. Falta playtest y ajuste. No marcar estos puntos terminados hasta verificar el comportamiento real en navegador.

## Prioridad 4 — Reglas, nivel y balance verificables

- [ ] Contrastar ataques, hechizos, alcance, direcciones, tiempos, requisitos, estados y costos de maná con los datos/código de la versión AO Libre fijada. Registrar cada resultado como confirmado, aproximado o decisión propia del modo de práctica.
- [ ] Ajustar el combo solicitado para que las muertes ocurran aproximadamente con un golpe y dos hechizos, probando las combinaciones indicadas: mago (Apocalipsis/Juicio Final), paladín (hechizos de paladín) y clérigo (Ráfaga y Curar heridas graves/Sanar). Confirmar primero nombres, disponibilidad, daños y tiempos; no inventar valores «reales».
- [ ] Llevar a los personajes a nivel 40 con vida/maná calculados a partir de las reglas y atributos pertinentes de la versión elegida; sustituir los perfiles aproximados actuales solo después de comprobar datos y fórmulas.
- [ ] Aplicar costos reales de hechizos y probar el agotamiento de maná del paladín que usa Remover parálisis varias veces, así como la necesidad de apoyo aliado.
- [ ] Permitir que aliados, incluidos magos, intenten salvar o remover estados de compañeros; estas acciones deben tener demora y ocurrir de forma ocasional, no automática ni instantánea.
- [ ] Añadir casos de prueba/playtest para balance, gasto de maná, acciones mutuamente excluyentes y apoyo; documentar qué valores siguen siendo aproximaciones.

## Prioridad 5 — Alcance futuro, sujeto a definición

- [ ] Inventario funcional, equipamiento y objetos/pociones integrados con la interfaz, una vez resuelta la presentación y la interacción básica.
- [ ] Chat lateral y sonidos de golpes/hechizos si hay recursos compatibles y licenciados.
- [ ] Escenarios de práctica 1v1, 2v2 y 3v3 con selección de formato.
- [ ] Multijugador en red y persistencia de personaje: pospuestos hasta que se definan requisitos y se sostengan las fases de práctica local.

## Criterio de cierre por tarea

Cada tarea debe ser pequeña, tener una evidencia de verificación (comparación visual, prueba reproducible o fuente AO Libre), actualizar el estado de este documento y README si cambia el alcance visible, y conservar explícitas las limitaciones. Una etiqueta «parcial» no equivale a completado.
