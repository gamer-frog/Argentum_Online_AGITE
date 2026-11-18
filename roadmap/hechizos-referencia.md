# Hechizos: contraste AO Libre / Imperium

Registro de la verificación pedida el 2026-11-12 («Buscamos en wiki de imperium ao también»).
Cada valor se clasifica como **confirmado** (fuente citada), **aproximado** (adaptación de
práctica) o **decisión propia**. Ningún número se presenta como fidelidad completa.

## Fuentes consultadas

- **AO Libre** — servidor `ao-libre/ao-server`, revisión `ca6ad7ff428a585475373474ec5640eabe05961b`,
  `Dat/Hechizos.dat`; cliente `ao-libre/ao-cliente`, revisión `7d32d61759d6b95069aba72ae12bed03c1d13700`.
- **Imperium Classic** — manual público `manual.imperiumclassic.com/doku.php?id=magia`, tabla de
  hechizos por `SpellIndex`, daños/curaciones y clases.
- **Wiki de Imperium AO** — foro `imperiumao.activo.mx/t15-hechizos` (publicado el 2012-12-26),
  hechizos de mago, clérigo y paladín con maná, energía y efecto.
- **Proyecto** — `game.js`, `CLASS_PROFILES`; `assets/ao/spellfx.json` (solo tres FX locales:
  2 Dardo Mágico, 9 Paralizar, 25 Apocalipsis).

## Tabla comparativa

| Hechizo | AO Libre (daño / maná) | Imperium Classic (daño/curación) | Wiki Imperium AO (daño / maná) | Implementado |
| --- | --- | --- | --- | --- |
| Apocalipsis (mago) | 85-100 / 1000 | 117-119 | 102-124 / 1050 | **117-119**, 230 maná (práctica), FX 25 |
| Juicio Final (mago) | no existe | 142-144 | 145-150 / 1800 | **142-144**, 350 maná (práctica), FX 25 |
| Ráfaga Ígnea (clérigo) | no existe | 98-100 | 88-102 / 700 | **98-100**, 230 maná (práctica), FX 2 (fallback) |
| Sanar (clérigo) | `Curar Heridas Graves` #5: 12-35 / 40, MinSkill 38, 5 stamina — nombre distinto, no equivalente | 40-45 | 50-90 y remueve estados / 1000 | **40-45**, 220 maná (práctica) |
| Castigo Divino (paladín) | no existe | 90-92 | 80-95 / 520 | **90-92**, 40 maná (práctica) |
| Fuente de vida (paladín) | no existe | 25-32 | 30-45 / 300 | **25-32**, 220 maná (práctica) |
| Inmovilizar | nombre del spell 24; 300 maná; FX 12 | spellIndex 24 | 230 maná | **350 maná** (Paralizar), FX 9 |
| Paralizar | nombre del spell 9; 450 maná; FX 8 | spellIndex 9 | 400 maná | mismo slot que Inmovilizar |
| Remover parálisis | `Devolver Movilidad`, spell 10; 300 maná; WAV 110 | spellIndex 10 | 340 maná | **330 maná** |

## Decisiones y límites

- **Daños y curas:** se usan los valores del manual de Imperium Classic porque es la fuente que
  fijó el pedido de nivel 40 y la que cita el pedido de maná (Paralizar 350 / Remover 330). La wiki
  de 2012 queda registrada como contraste: sus manás (1050/1800/700/1000) pertenecen a otra escala
  de progresión y no entran en las reservas de 1400/1200/1000 del nivel 40; por eso los costos de
  maná implementados son **aproximaciones de práctica**, no valores «reales».
- **Sanar:** el manual Classic publica 40-45 sin remoción de estados; la wiki de 2012 publica 50-90
  y remoción. Se implementó la versión Classic (cura simple); la remoción sigue en el hechizo
  separado `Remover parálisis`.
- **Inmovilizar:** el pedido textual del usuario usa «Inmovilizar» y le asigna 350 de maná, que es
  el costo de Paralizar en el manual y en la wiki. El efecto implementado (no puede moverse ni
  apuntar/golpear) es el de **Paralizar**; se conserva el nombre pedido y el FX local de Paralizar.
  Queda pendiente decidir si se agrega un Inmovilizar barato que solo bloquee el movimiento.
- **FX:** solo existen tres animaciones locales. Apocalipsis usa su FX auténtico (25); Juicio Final
  reutiliza ese FX; Ráfaga Ígnea usa el FX 2 (Dardo Mágico) como fallback visual documentado. El
  resto usa el destello de respaldo del canvas.
- **Playtest 2026-11-12:** 90 s desde reinicio → 11 bajas (una cada 7,8 s); 4 guerrero / 3 mago /
  2 paladín / 1 clérigo. Los siete bots se movieron 60–88 % del tiempo; el maná tocó mínimos de
  5–92 y nunca quedó en cero; se usaron todos los recursos, incluidos Apocalipsis, Juicio Final,
  Ráfaga, Sanar, Castigo y Fuente. El combo del mago (golpe 45-60 + Apocalipsis 117-119 +
  Juicio Final 142-144 = 304-323) es letal contra ~300 de vida, como se pidió. El paladín concentra
  5 de las 11 muertes; queda como observación para un playtest humano, no como ajuste automático.
- **Pendiente:** la decisión de aplicar `Fuente de vida` 30-45 y de agregar remoción de estados a
  `Sanar` sigue abierta. T5 (2026-11-18) dejó la verificación y las propuestas en las secciones
  siguientes; cualquier cambio debe medirse con el mismo probe de 90 s y documentarse acá.

## Verificación T5 (2026-11-18): `Sanar` vs `Curar Heridas Graves`

Se descargó `Dat/Hechizos.dat` de la revisión fijada `ca6ad7ff…` y se leyeron los campos de los
hechizos 3, 5, 9, 10, 24 y 25. El hechizo 5 de AO Libre es **`Curar Heridas Graves`**:

| Campo | AO Libre #5 | `Sanar` implementado |
| --- | ---: | ---: |
| Nombre | Curar Heridas Graves | Sanar (Imperium) |
| Curación | **12-35** (`MinHP=12`, `MaxHP=35`) | **40-45** |
| Maná | **40** | **220** |
| Stamina | 5 | no implementada |
| `MinSkill` | 38 | no exigido |
| Target | 3 (usuario y NPC) | aliado / uno mismo |

**Veredicto: no son equivalentes.** El nombre `Sanar`, el rango 40-45 y el costo 220 vienen del
manual de Imperium Classic; AO cura 12-35 por 40 de maná. La diferencia no es de escala: el
prototipo cura aproximadamente el doble por lanzamiento y cuesta 5,5× más maná. Tampoco coincide
con la wiki 2012 (50-90 y remoción de estados por 1000 maná). Por eso `Sanar` sigue etiquetado como
**práctica** y no se renombra a `Curar Heridas Graves`.

Además, `Curar Heridas Graves` no está limitado por clase: `PuedeLanzar` solo exige `MinSkill` de
Magia, maná y stamina (`modHechizos.bas:534-541,589`). La restricción «solo clérigo» es del
prototipo, no de AO.

Si en el futuro se quiere fidelidad AO para ese slot, hay que **agregar** `Curar Heridas Graves`
como hechizo aparte (12-35 / 40 maná / `MinSkill` 38) en vez de reetiquetar `Sanar`. Eso agrega una
habilidad y queda fuera del alcance de T5.

## Evaluación de `Fuente de vida` 30-45 (wiki 2012)

| Fuente | Curación | Maná | Etiqueta |
| --- | ---: | ---: | --- |
| Implementado (Imperium Classic) | 25-32 | 220 | **práctica** |
| Wiki Imperium AO 2012 | 30-45 | 300 | **práctica** |
| AO Libre | no existe | — | **sin dato** |

Subir la curación a 30-45 manteniendo 220 de maná mejora la eficiencia de 0,114-0,145 a
0,136-0,205 de vida por maná (+5 a +13 de vida por lanzamiento). No resuelve el agotamiento del
paladín: 220 de maná sigue siendo 22 % de la reserva de 1000 y compite con `Inmovilizar` (350) y
`Remover parálisis` (330). Con el costo 300 de la wiki la eficiencia no mejora y el problema de maná
empeora. **Propuesta sin aplicar:** subir solo la curación a 30-45 y dejar el costo en 220
(`práctica`), o no cambiar nada hasta que se apruebe un plan de maná más amplio. Ver la medición y
la tabla de propuestas en [`reglas-combate.md`](reglas-combate.md#capacidad-de-maná-del-paladín-t5).
