# Argentum Online — Arena del Robledal

Prototipo web jugable inspirado en Argentum Online. Incluye una arena de combate local, movimiento por tiles, bots, ataques cuerpo a cuerpo, habilidades por clase y controles táctiles; funciona en navegador sin backend.

## Ejecutar

Serví esta carpeta por HTTP, por ejemplo:

```bash
python3 -m http.server 8000
```

Después abrí <http://localhost:8000>.

## Controles

- **Flechas o WASD:** moverse.
- **Clic en un personaje o Tab:** elegir objetivo.
- **F o Enter:** atacar al objetivo adyacente.
- **1–3:** elegir/cancelar habilidad; luego clic en un rival para atacar o en tu personaje para curarte.
- **Combatientes / Esc:** mostrar el marcador o cerrar paneles.
- **☰:** pausar o reanudar.
- **Móvil:** pad táctil para moverse y botón de ataque.

## Archivos

- `index.html`, `styles.css`, `game.js`: aplicación web.
- `assets/ao/`: mapa, datos de personajes y gráficos usados por el juego.
- `scripts/extract_ao_assets.py`: herramienta de extracción de los recursos AO incluidos.

La aplicación y sus recursos fueron recuperados de [gamer-frog/PLAYGROUND](https://github.com/gamer-frog/PLAYGROUND), revisión `fb02a4c` (clonada el 7 de noviembre de 2026). Se copiaron los archivos de la aplicación y sus recursos al repositorio `Argentum_Online_AGITE`; el clon de origen no forma parte de este repositorio.
