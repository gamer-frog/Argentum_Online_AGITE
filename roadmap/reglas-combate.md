# Reglas de combate: prototipo vs AO Libre (primer corte)

Comparación estática de las reglas de combate **ya implementadas** en el prototipo contra la revisión fijada de AO Libre. No cambia balance, daños, costos ni tiempos; tampoco extrae assets. La ausencia de un hechizo o de un valor en la fuente **no se interpreta como cero**.

- **Servidor de referencia:** `ao-libre/ao-server`, revisión `ca6ad7ff428a585475373474ec5640eabe05961b`.
- **Cliente de referencia:** `ao-libre/ao-cliente`, revisión `7d32d61759d6b95069aba72ae12bed03c1d13700` (usado para recursos visuales; las reglas de esta matriz salen del servidor).
- **Código del prototipo:** `game.js`; `dist/game.js` es su copia de despliegue.
- **Fecha del corte:** 2026-11-16.

## Cómo leer las etiquetas

| Etiqueta | Significado |
| --- | --- |
| **Confirmado** | La regla o el valor está en la fuente fijada y el prototipo lo replica sin cambio material. |
| **Aproximado** | La regla existe en la fuente y el prototipo la implementa, pero con un valor, geometría o alcance adaptado. La diferencia se explicita. |
| **Práctica** | Valor, regla u omisión decidida para el prototipo, sin equivalente directo en la fuente fijada. No se presenta como fiel. |
| **Sin dato** | La fuente fijada no permite determinar el valor; no se completa por intuición. |

Una regla ausente puede llevar etiqueta `práctica` si la omisión fue una decisión del prototipo, o `sin dato` si lo que falta es la referencia.

## Matriz del núcleo de combate

| Regla | Implementado | Código | AO Libre fijado | Etiqueta |
| --- | --- | --- | --- | --- |
| **Ataque cuerpo a cuerpo adyacente** | Solo contra un rival a distancia Manhattan ≤ 1; el atacante gira automáticamente hacia el objetivo. | `game.js:505-516`; `distance()` en `game.js:372` | `UsuarioAtaca` ataca únicamente la casilla que está delante del `heading` (`AttackPos = .Pos` + `HeadtoPos`), sin comprobar una distancia de 1 en todas las direcciones. | **Aproximado**: la adyacencia se conserva, pero AO exige orientación previa y el prototipo auto-orienta. |
| **Intervalo de ataque del jugador** | 0,62 s entre golpes. | `game.js:516` | `IntervaloUserPuedeAtacar=1500` ms (`Server.ini:135`), aplicado por `IntervaloPermiteAtacar` (`modNuevoTimer.bas:96-122`). | **Aproximado**: mismo tipo de intervalo, acelerado ≈2,4× para el loop del prototipo. |
| **Intervalo de ataque de NPC** | Aleatorio entre 0,70 y 1,05 s. | `game.js:516` | `IntervaloPermiteAtacarNpc` usa **3000 ms** hardcodeados (`modNuevoTimer.bas:38-66`). `Server.ini:133` declara `IntervaloNpcPuedeAtacar=1600`, pero el código de esta revisión no lo usa en esa función. | **Aproximado**: mismo tipo de intervalo, acelerado; además la fuente tiene una discrepancia interna entre `.ini` y código. |
| **Daño cuerpo a cuerpo** | Valor plano por clase: guerrero 85-105, paladín 75-95, mago 45-60, clérigo 50-65; jugador y NPC usan la misma tabla. | `game.js:49`, aplicado en `game.js:518-520` y `game.js:589-591` | `CalcularDano` parte de `MinHIT`/`MaxHIT` del arma, aplica el modificador de clase (`Balance.dat`, `[MODATAQUEARMAS]`) y atributos (`SistemaCombate.bas:322-461`). | **Práctica**: escala de Imperium nivel 40; no replica la fórmula de arma/atributos de AO. |
| **Precisión del golpe** | El ataque directo del jugador siempre impacta; el NPC acierta 78% de las veces. | `game.js:95`, `game.js:517-522`; NPC en `game.js:585-591` | `UsuarioImpacto` calcula el impacto con habilidad de arma y agilidad (`SistemaCombate.bas:1258-1270`). | **Práctica**: probabilidad fija, no la fórmula de AO. |
| **Alcance de hechizos** | Distancia Manhattan ≤ 11 desde el lanzador. Los campos `range` 7/7/6/2/1 de `CLASS_PROFILES` (`game.js:58-77`) no se leen al lanzar: el límite efectivo es la visión. | `SPELL_VISION_RANGE = 11` en `game.js:110`; comprobaciones en `game.js:748`, `game.js:772` y `game.js:554` | Visión rectangular: `RANGO_VISION_X = 23 \ 2 = 11`, `RANGO_VISION_Y = 19 \ 2 = 9` (`ModAreas.bas:38-52`); el lanzamiento rechaza `abs(dx) > 11` o `abs(dy) > 9` (`Protocol.bas:3461-3464`). | **Aproximado**: no es la misma geometría. El prototipo permite (6,5) pero no (9,9); AO permite (9,9) y (11,9). |
| **Intervalo de lanzamiento** | Intervalo global de 0,9 s, más cooldown por habilidad: cura 5 s, limpieza 2,5 s, inmovilizar 3,5 s, daño 4,2 + 0,8 × índice. | `CAST_RECOVERY = .9` en `game.js:104`; aplicado en `game.js:647-648`, `game.js:753` y `game.js:774`; cooldowns en `game.js:645` | `IntervaloLanzaHechizo=1400` ms (`Server.ini:131`), aplicado por `IntervaloPermiteLanzarSpell` (`modNuevoTimer.bas:69-94`); además `IntervaloMagiaGolpe=1000` ms (`Server.ini:145`) para encadenar magia y golpe. | **Aproximado** para el intervalo global; **práctica** para los cooldowns por habilidad, que AO no define con esos valores. |
| **Apuntado y telégrafo** | La mira dura 0,38-0,62 s para hechizos y 0,36-0,52 s para golpes; el tiro a casilla falla 18%; los hechizos apuntados por NPC fallan 18% contra blanco móvil y 0% contra inmovilizado; el golpe melee de NPC acierta 78% siempre; el click directo del jugador sigue al rival y resuelve sin esa tirada. | `game.js:533-543`; `game.js:555-591`; `game.js:601-611` | AO resuelve el lanzamiento en el servidor tras validar rango e intervalos (`Protocol.bas:3449-3487`); no hay una mira con duración ni una tirada de apuntado de 18% en el protocolo. El fallo de los golpes físicos sale de `UsuarioImpacto` (`SistemaCombate.bas:1258-1270`). | **Práctica**: el telégrafo y la tirada de apuntado son mecánicas del prototipo. |
| **Inmovilización / parálisis** | Un solo estado `immobilized`, 3,5 s; bloquea el movimiento (`game.js:375`), corta la mira en curso salvo `cleanse` (`game.js:616`) y no impide atacar; un lanzamiento iniciado se corta en la actualización de la mira. Se muestra como «Paralizado». | `game.js:67`, `game.js:73`, `game.js:79` (duración 3,5); `game.js:675-682`; `game.js:1119` | `Paralizar` (#9: 450 maná, 65 stamina, `MinSkill=60`) e `Inmovilizar` (#24: 300 maná, 44 stamina, `MinSkill=60`) comparten `Counters.Paralisis = IntervaloParalizado = 500` (`modHechizos.bas:351-360`), ≈20 s a 40 ms por tick (`mMainLoop.bas:7,151`; `Server.ini:125`). `Paralizado` bloquea caminar (`Protocol.bas:2343`); `Inmovilizado` además impide el giro en el lugar (`Protocol.bas:3980-4003`). `RemoveParalisis` limpia ambos flags (`General.bas:1249-1267`). Solo las clases sin maná pierden la parálisis de inmediato si el lanzador murió, o reducen el contador a `IntervaloParalizadoReducido = 37` ≈1,5 s si el lanzador salió de visión (`Admin.bas:82`; `General.bas:1185-1233`). | **Aproximado**: el prototipo fusiona ambos flags en un solo estado y acorta la duración; los requisitos de maná/stamina/habilidad no coinciden. |
| **Remoción de parálisis** | 330 de maná; quita `immobilized`; si no había nada que quitar, devuelve el maná y el cooldown de la habilidad (no el intervalo global). | `game.js:68`, `game.js:74`, `game.js:80`; `game.js:661-673` | `Devolver Movilidad` (#10): 300 maná, 44 stamina, `MinSkill=45`, `RemoverParalisis=1` (`Hechizos.dat`; `modHechizos.bas:362-369`). | **Aproximado**: mismo efecto; costo y requisitos adaptados. |
| **Requisito de habilidad (`MinSkill`)** | No se exige habilidad de Magia; solo maná, objetivo válido y cooldown. | `game.js:731-754` | `Stats.UserSkills(eSkill.Magia) < MinSkill` bloquea el lanzamiento (`modHechizos.bas:534-536`). Ejemplos: Apocalipsis 100, Paralizar/Inmovilizar 60, Devolver Movilidad 45. | **Práctica**: el prototipo omite el requisito de habilidad. |
| **Stamina** | No hay barra ni costo de stamina. | Sin implementación en `game.js` | Atacar exige al menos 10 de stamina y consume `RandomNumber(1, 10)` (`SistemaCombate.bas:1135-1136`, `1190-1197`); los hechizos consumen `StaRequerido` (`modHechizos.bas:540`, `823`). Ejemplos: Apocalipsis 131, Paralizar 65, Inmovilizar/Devolver Movilidad 44. | **Práctica**: requisito omitido en el prototipo. |
| **Nivel 40 y estadísticas** | Perfiles fijos: guerrero 380 vida/0 maná; mago 260/1400; clérigo 300/1200; paladín 330/1000. | `CLASS_PROFILES` en `game.js:56-82`; contexto en `README.md` §«Alcance de las reglas de nivel 40» | La revisión fijada no trae una tabla de estadísticas de nivel 40 por clase; el nivel máximo observado es 55 y los requisitos de hechizo son `MinSkill`, no un nivel 40 fijo. | **Sin dato** para una tabla AO de nivel 40; los valores del prototipo son **práctica** de Imperium. |

## Costos de maná y equivalencia de hechizos

Los daños y curaciones ya se compararon en [`hechizos-referencia.md`](hechizos-referencia.md); esta tabla solo ordena el **costo de maná** y la existencia de un equivalente en AO Libre.

| Habilidad (clase) | Costo implementado | Equivalente en AO Libre | Etiqueta |
| --- | ---: | --- | --- |
| Apocalipsis (mago) | 230 | `Apocalipsis` #25: 1000 maná, 131 stamina, `MinSkill=100`, daño 85-100. | **Práctica**: el nombre existe, pero el costo implementado no deriva de AO. |
| Juicio Final (mago) | 350 | Sin hechizo con ese nombre en `Hechizos.dat`. | **Práctica**: no hay equivalente AO que comparar. |
| Inmovilizar (mago, clérigo, paladín) | 350 | `Inmovilizar` #24: 300 maná, 44 stamina, `MinSkill=60`. | **Aproximado**: mismo hechizo y efecto; costo adaptado. |
| Remover parálisis (mago, clérigo, paladín) | 330 | `Devolver Movilidad` #10: 300 maná, 44 stamina, `MinSkill=45`. | **Aproximado**: mismo efecto; costo adaptado. |
| Ráfaga Ígnea (clérigo) | 230 | Sin nombre equivalente. No se asume que `Dardo Mágico` #2 (10 maná, `MinSkill=6`) sea el mismo hechizo. | **Práctica**: nombre y costo de Imperium. |
| Sanar (clérigo) | 220 | Sin nombre equivalente. No se asume equivalencia con `Curar Heridas Leves` #3 ni `Curar Heridas Graves` #5 sin verificar daño, clase y requisitos. | **Práctica**: nombre y costo de Imperium. |
| Castigo Divino (paladín) | 40 | Sin hechizo con ese nombre en `Hechizos.dat`. | **Práctica**: no hay equivalente AO que comparar. |
| Fuente de vida (paladín) | 220 | Sin hechizo con ese nombre en `Hechizos.dat`. | **Práctica**: no hay equivalente AO que comparar. |

## Recuperación, pociones y recursos

| Regla | Implementado | Código | AO Libre fijado | Etiqueta |
| --- | --- | --- | --- | --- |
| **Regeneración pasiva de vida** | No existe: la vida solo sube con curas o pociones. | `update()` no modifica `hp` por tiempo (`game.js:1115-1123`). | `Sanar` sube `RandomNumber(2, 5% MaxSta)` cada 1600 ticks sin descansar (≈64 s a 40 ms/tick) o cada 100 ticks descansando (≈4 s), si no hay hambre/sed (`Server.ini:118-120`; `mMainLoop.bas:198-273`; `General.bas:1424-1458`; `mMainLoop.bas:7`). | **Práctica**: regla omitida; no se simula el descanso. |
| **Regeneración de maná** | 6 puntos por segundo, siempre, incluso en combate. | `MANA_REGEN = 6` en `game.js:50`; aplicado en `game.js:1120` | No hay regeneración pasiva equivalente: AO usa meditación con la habilidad `Meditar` (`DoMeditar`, `Trabajo.bas:2792-2865`), pociones y hechizos concretos. | **Práctica**: el prototipo regala maná continuo para sostener el loop. |
| **Poción roja** | Restaura 40% de la vida máxima, redondeado hacia arriba; infinita. | `POTION_HP_SHARE = .4` en `game.js:103`; `game.js:783-790` | `Poción Roja` restaura `RandomNumber(30, 30)` = 30 HP fijos (`obj.dat` `[OBJ38]`; `InvUsuario.bas:1862-1870`) y consume el objeto. | **Práctica**: porcentaje e infinitas; no replica el valor fijo ni el inventario. |
| **Poción azul** | Restaura 45% del maná máximo; infinita. | `POTION_MANA_SHARE = .45` en `game.js:103`; `game.js:783-790` | `Poción Azul`: `Porcentaje(MaxMAN, 4) + ELV \ 2 + 40 / ELV` (`InvUsuario.bas:1879-1882`; `obj.dat` `[OBJ37]` la declara 12-20, pero el código aplica la fórmula). A nivel 40 son ≈4% del maná máximo + 21. | **Práctica**: porcentaje e infinitas; la diferencia es grande. Con el MaxMAN de 1400 del mago del prototipo, AO restauraría ≈77 y el prototipo 630. |
| **Intervalo de poción** | Beber bloquea atacar/lanzar 1,1 s y no se puede beber durante un golpe o lanzamiento. | `POTION_DURATION = 1.1` en `game.js:103`; `game.js:780-789` | `IntervaloGolpeUsar=1200` ms (`Server.ini:147`), aplicado por `IntervaloPermiteGolpeUsar` (`modNuevoTimer.bas:124-148`); atacar también reinicia ese temporizador. | **Aproximado**: misma idea, 1,1 s vs 1,2 s. |
| **Consumo de pociones** | Ilimitadas; no hay inventario ni cargo. | `game.js:777-795`; HUD muestra «VIDA ∞» / «MANÁ ∞» | Cada poción es un objeto (`otPociones`) que se quita del inventario al usarse (`InvUsuario.bas:1805-1897`). | **Práctica**: el inventario funcional está fuera del alcance (`D2`). |

## Hallazgos del primer corte

1. **Solo tres hechizos del prototipo tienen un homólogo identificable en AO Libre:** Apocalipsis (#25), Inmovilizar (#24) y Remover parálisis → Devolver Movilidad (#10). Comparten nombre y efecto declarado, pero no sus valores. Los otros cinco son de Imperium o no tienen equivalente en `Hechizos.dat`; no se les asigna un costo AO.
2. **El daño cuerpo a cuerpo no usa la fórmula de AO.** AO parte del arma y aplica clase/atributos; el prototipo usa una tabla plana por clase con escala de Imperium nivel 40.
3. **El alcance de hechizos cambia de geometría.** AO usa un rectángulo de 11×9; el prototipo usa Manhattan ≤ 11. En diagonal, el prototipo queda más corto que AO. Además, los `range` 7/6/2/1 declarados en `CLASS_PROFILES` no se leen al lanzar: el único límite efectivo es `SPELL_VISION_RANGE`.
4. **Los tiempos del prototipo son más rápidos:** 0,62 s por golpe vs 1,5 s; 0,9 s de lanzamiento vs 1,4 s; 1,1 s de poción vs 1,2 s. Son adaptaciones para un loop corto, no valores de AO.
5. **Faltan dos requisitos de AO:** stamina (ataque y hechizos) y `MinSkill` de Magia. El prototipo solo exige maná, objetivo y cooldown.
6. **La recuperación no sigue a AO:** no hay regeneración pasiva de vida ni meditación; en cambio hay 6 de maná por segundo siempre. Las pociones son porcentuales e infinitas, mientras AO usa valores fijos o una fórmula por nivel y consume el objeto.
7. **Ninguna fila quedó como `confirmado` en este primer corte:** incluso las reglas que existen en AO cambian valor, geometría o requisitos. La etiqueta se reserva para una réplica sin cambio material y no se forzó para inflar la tabla.

## Sin dato / límites

- **Estadísticas de nivel 40 por clase:** la revisión fijada no ofrece una tabla directamente comparable; por eso no se afirma que vida/maná del prototipo sean los de AO. El `README.md` ya documenta que son valores de práctica.
- **Fórmula exacta de `UsuarioImpacto`:** se verificó que existe y que usa habilidad/agilidad (`SistemaCombate.bas:1258-1270`), pero no se replica en el prototipo; no se presenta el 78% de los NPC como equivalente.
- **Hechizos de Imperium:** daños, curaciones y costos están documentados en [`hechizos-referencia.md`](hechizos-referencia.md); esta matriz no los vuelve a validar contra AO porque no existen con ese nombre en la fuente fijada.
- **Comportamiento de `Paralizado` vs `Inmovilizado` en AO:** la fuente distingue ambos flags y comparte el contador; no se afirma que el prototipo replique todas sus restricciones de acción. Solo se documenta la diferencia de duración y la fusión en un único estado.

## Verificación

- Comparación estática con la revisión fijada: descarga de `Server.ini`, `Dat/Hechizos.dat`, `Dat/obj.dat`, `Dat/Balance.dat` y los módulos citados; lectura de las líneas indicadas.
- No se modificó código de producto ni se extrajeron assets.
- `bash 00_cerebro_loop/verify.sh` quedó verde; al ser un cambio documental no requiere un nuevo playtest de navegador. La última validación de producto sigue siendo la de `T2` (rotación completa, 1440×1000 y 390×844, consola 0/0).
