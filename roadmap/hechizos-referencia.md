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
| Sanar (clérigo) | no existe | 40-45 | 50-90 y remueve estados / 1000 | **40-45**, 220 maná (práctica) |
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
- **Pendiente de playtest:** confirmar el ritmo de las combinaciones (golpe + dos hechizos) con
  las vidas de 260-380, el agotamiento de maná del paladín al remover parálisis varias veces y el
  momento en que el clérigo debe atacar en vez de curar.
