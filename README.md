# Argentum Online — Reinos

Prototipo web jugable de combate inspirado en **Argentum Online**. El proyecto recupera el juego y sus recursos desde el repositorio PLAYGROUND; el mapa, personajes y gráficos utilizados están en `assets/ao/`.

## Ejecutar localmente

Necesitás Python 3. Desde la raíz del repositorio, iniciá un servidor HTTP:

```bash
python3 -m http.server 3002
```

Abrí <http://localhost:3002>. No abras `index.html` directamente como archivo: la app carga datos e imágenes mediante HTTP.

## Cómo jugar

- **Flechas o WASD:** moverse por el mapa.
- **Clic en un personaje o en la lista / Tab:** seleccionar objetivo.
- **F o Enter:** atacar al objetivo cuando esté en un tile adyacente.
- **Clic en un hechizo o teclas 1–3:** seleccionar/cancelar una habilidad; luego clic en un rival para atacar o en tu personaje para curarte.
- **Combatientes:** mostrar u ocultar el marcador. **Esc** cierra el panel o la guía.
- **☰:** pausar o reanudar.
- En pantallas táctiles, usá el pad en pantalla para moverte y el botón **ATACAR** para golpear.

El objetivo de la arena es alcanzar **5 bajas**.
