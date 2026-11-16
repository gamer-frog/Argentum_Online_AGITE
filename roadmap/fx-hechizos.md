# FX de hechizos: auditoría de recursos locales

> **Fecha:** 2026-11-16 · **Tarea:** `T3` · **Alcance:** inventario y trazabilidad, sin cambios de código.
> Fuente de reglas: [`hechizos-referencia.md`](hechizos-referencia.md). Atribución: [`../assets/ao/ATTRIBUTION.txt`](../assets/ao/ATTRIBUTION.txt).

## Qué se auditó

1. `assets/ao/spellfx.json`: manifiesto de FX extraído del cliente AO Libre.
2. `assets/ao/grhs.json` + `assets/ao/graphics/*.png`: animaciones Grh y láminas locales.
3. `assets/ao/audio/*.wav`: sonidos locales.
4. `game.js`: perfiles de clase, llamada a `addSpellEffect`, resolución de Grh y render.

**Revisión de origen:** cliente `ao-libre/ao-cliente` en `7d32d61759d6b95069aba72ae12bed03c1d13700`; servidor `ao-libre/ao-server` en `ca6ad7ff428a585475373474ec5640eabe05961b` (análisis estático). Datos del cliente: `INIT/fxs.ini`, `INIT/Graficos.ini` y `AUDIO/WAV/{114,16,27}.wav`.

## Inventario local verificado

### Manifiesto `spellfx.json`

| Hechizo AO | ID | FX | Grh de animación | WAV | `loops` | Offset |
| --- | ---: | ---: | ---: | ---: | ---: | --- |
| Dardo Mágico | 2 | 15 | 275 | 114 | 2 | 0, 0 |
| Paralizar | 9 | 8 | 183 | 16 | 0 | 0, 32 |
| Apocalipsis | 25 | 13 | 259 | 27 | 0 | 0, 0 |

El manifiesto contiene **solo tres hechizos**. No hay entradas para ningún otro nombre o ID.

### Animaciones referenciadas

| Grh | Cuadros | `speed` (ms) | Duración de un ciclo | Láminas | ¿Lámina local? |
| ---: | ---: | ---: | ---: | --- | --- |
| 275 | 8 | 444 | 444 ms | `3106.png` (128×128) | Sí |
| 183 | 10 | 555 | 555 ms | `3089.png` (512×512) | Sí |
| 259 | 21 | 1166 | 1166 ms | `3000.png`–`3020.png` (256×256) | Sí |

`game.js` calcula la duración como `speed × (loops + 1)`: 1.332 s para Dardo Mágico (3 ciclos), 0.555 s para Paralizar y 1.166 s para Apocalipsis. La animación se dibuja sobre la casilla objetivo y aplica el offset de `spellfx.json`.

### Audio local

| WAV | Hechizo | Tamaño |
| --- | --- | ---: |
| `audio/114.wav` | Dardo Mágico | 57.636 bytes |
| `audio/16.wav` | Paralizar | 8.230 bytes |
| `audio/27.wav` | Apocalipsis | 97.172 bytes |

No hay WAV para curas, limpieza de estados ni para los hechizos sin manifiesto. En esos casos `playSpellSound` usa el tono sintético de reserva.

### Grh animados en el recorte local

`grhs.json` contiene 1.511 definiciones, de las cuales **39 son animadas**. Solo **3** están asociadas a hechizos por `spellfx.json` (275, 183 y 259). Las otras 36 pertenecen a mapas, personajes u otros efectos y **no hay evidencia local** de que sean FX de hechizos; no se les asigna ningún hechizo en esta auditoría.

## Los ocho hechizos del prototipo

Estados usados:

- **Original:** el manifiesto local asocia el hechizo AO del mismo nombre a una animación y un WAV.
- **Reutilizado:** el prototipo usa un FX AO real, pero de otro hechizo; no es el FX original del nombre mostrado.
- **Reserva:** no hay animación ni WAV; el canvas dibuja el efecto genérico y suena el tono sintético.

| Hechizo del prototipo | Clase | `fxSpellId` | Entrada usada | Grh / cuadros | WAV | Estado | Qué falta |
| --- | --- | ---: | --- | --- | ---: | --- | --- |
| Apocalipsis | Mago | 25 | Apocalipsis (25) | 259 / 21 | 27 | **Original** | Nada para el FX actual. |
| Juicio Final | Mago | 25 | Apocalipsis (25) | 259 / 21 | 27 | **Reutilizado** | FX propio de Juicio Final; no existe en AO Libre según la referencia. |
| Ráfaga Ígnea | Clérigo | 2 | Dardo Mágico (2) | 275 / 8 | 114 | **Reutilizado** | FX propio de Ráfaga Ígnea; no existe en AO Libre según la referencia. |
| Inmovilizar | Mago, clérigo y paladín | 9 | Paralizar (9) | 183 / 10 | 16 | **Reutilizado** | FX de Inmovilizar; el recurso local es de Paralizar y así se documentó. |
| Sanar | Clérigo | — | — | — | — | **Reserva** | Animación y WAV de curación verificados. |
| Castigo Divino | Paladín | — | — | — | — | **Reserva** | Animación y WAV de Castigo Divino verificados. |
| Fuente de vida | Paladín | — | — | — | — | **Reserva** | Animación y WAV de Fuente de vida verificados. |
| Remover parálisis | Mago, clérigo y paladín | — | — | — | — | **Reserva** | Animación y WAV de Remover parálisis; la referencia menciona WAV 110 para el hechizo 10 de AO Libre, pero **no está extraído**. |

**Resumen:** 1 original (Apocalipsis), 3 reutilizados (Juicio Final, Ráfaga Ígnea, Inmovilizar) y 4 en reserva (Sanar, Castigo Divino, Fuente de vida, Remover parálisis).

## Cómo se renderiza hoy

1. `addSpellEffect` busca `spellFx[spellId]` y toma `definition.animation` (`game.js`, `addSpellEffect`).
2. Si el Grh animado existe y su lámina está cargada, `drawCombatEffects` dibuja la animación en la casilla objetivo con `offsetX`/`offsetY`.
3. Si no hay animación o lámina, dibuja un círculo con estela:
   - curación/limpieza: verde, solo círculo;
   - daño de mago: naranja;
   - daño o inmovilización de clérigo/paladín: dorado.
4. `playSpellSound` reproduce el WAV del manifiesto o un tono sintético de reserva (340 Hz para daño/cura, 520 Hz para limpieza, 620 Hz para inmovilización y mago).

**Observación técnica:** el campo `fx` de `spellfx.json` (15, 8 y 13) se conserva como dato de origen, pero el render no lo consume; usa directamente `animation` (275, 183 y 259). No es un defecto: evita una segunda tabla de equivalencias, pero conviene no presentar `fx` como el Grh dibujado.

## Límites y afirmaciones no verificadas

- Los hechizos **Juicio Final, Ráfaga Ígnea, Sanar, Castigo Divino, Fuente de vida y Remover parálisis** no existen en AO Libre según [`hechizos-referencia.md`](hechizos-referencia.md). Por lo tanto, no hay un FX «original de AO Libre» que se pueda extraer para ellos con la fuente fijada.
- La reutilización de Apocalipsis, Dardo Mágico y Paralizar es una decisión visual documentada, no una equivalencia de reglas, daño, alcance o nombre.
- No se afirma que las 36 animaciones restantes sean FX de hechizos: el recorte de `grhs.json` no incluye su propósito.
- No se verificó el contenido visual cuadro por cuadro de las animaciones; se verificó su existencia, dimensiones, cantidad de cuadros, `speed` y láminas.
- La auditoría **no modificó código**. No se agregaron assets ni se cambiaron daños, costos o tiempos.

## Próximo paso sugerido

Para mejorar la fidelidad visual sin inventar recursos:

1. Decidir si se acepta el estado actual (1 original + 3 reutilizados + 4 en reserva) como definitivo para el prototipo.
2. Si se quiere avanzar, buscar una fuente compatible y con licencia para los FX de los hechizos de Imperium y registrar revisión, autoría y licencia antes de extraer.
3. Si no aparece una fuente verificable, mantener los reutilizados y la reserva, y no presentarlos como FX originales.

Cualquier extracción nueva debe actualizar `spellfx.json`, `ATTRIBUTION.txt` y este documento en el mismo cambio.
