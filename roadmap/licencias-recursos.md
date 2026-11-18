# Licencias y atribución por recurso

> **Tarea:** T11 · **Fecha:** 2026-11-18 · **Alcance:** auditar qué se puede redistribuir del subset `assets/ao/` y qué avisos son obligatorios.
> Este documento es técnico, no asesoramiento legal. No reemplaza una revisión de licencia por archivo hecha por quien corresponda.

## Fuentes fijadas y método

| Dato | Valor |
| --- | --- |
| Cliente | [`ao-libre/ao-cliente`](https://github.com/ao-libre/ao-cliente), revisión `7d32d61759d6b95069aba72ae12bed03c1d13700` |
| Servidor (solo análisis estático) | [`ao-libre/ao-server`](https://github.com/ao-libre/ao-server), revisión `ca6ad7ff428a585475373474ec5640eabe05961b` |
| Licencia declarada del cliente | **AGPL-3.0** (`LICENSE` en la raíz; GitHub API informa `agpl-3.0`) |
| Licencia declarada del servidor | **AGPL-3.0** (GitHub API informa `agpl-3.0`) |
| Créditos upstream | `INIT/Creditos.txt`, copiados a [`../assets/ao/ATTRIBUTION.txt`](../assets/ao/ATTRIBUTION.txt) |
| Inventario del subset | [`inventario-recursos-ao.md`](inventario-recursos-ao.md) |

**Método.** Se descargaron `LICENSE`, `INIT/Creditos.txt` y el árbol Git de la revisión fijada. Para cada archivo local se comparó el **SHA de blob Git** (`git hash-object`) con el SHA del mismo archivo en el árbol upstream. Eso distingue copias exactas de datos derivados.

**Resultado de la comparación byte a byte:**

- **203/203 PNG** de `assets/ao/graphics/` son **idénticos** a `Graficos/<id>.png` del upstream fijado.
- **3/3 WAV** de `assets/ao/audio/` son **idénticos** a `AUDIO/WAV/<id>.wav`.
- Los cinco `assets/ao/maps/<ID>.json` son **datos derivados** de `Mapas/Alkon/Mapa<ID>.map` (binario), no copias byte a byte.
- `grhs.json`, `characters.json`, `maps.json` y `spellfx.json` son **datos derivados** de INI/`.map`/`fxs.ini`.
- `map.json` es una copia de compatibilidad derivada de `maps/272.json`; **hoy no la carga el cliente** y está desincronizada en una casilla (ver hallazgo H4).

## Tabla por familia de recursos

Estados: **confirmado** = verificado contra la fuente fijada; **aproximado** = se infiere de la licencia global del repositorio, sin cesión explícita por archivo; **sin dato** = no hay información suficiente.

| # | Recurso local | Origen upstream | Licencia / términos | Atribución requerida | Estado | ¿Redistribuible? |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | `graphics/*.png` (203 láminas) | `Graficos/<id>.png` | AGPL-3.0 declarada en la raíz del repo; **no hay aviso de licencia por lámina** | Conservar `LICENSE` AGPL-3.0 upstream, `ATTRIBUTION.txt` y créditos generales; no atribuir autoría individual inexistente | **aproximado** (copia exacta confirmada; autoría por archivo sin dato) | Sí, bajo AGPL-3.0 y conservando avisos; no se puede relicenciar como propietario |
| 2 | `grhs.json` (1.511 registros Grh) | Recorte de `INIT/Graficos.ini` | AGPL-3.0 del repo; dato derivado | Igual que #1; indicar que es dato derivado/recortado | **aproximado** | Sí, bajo AGPL-3.0; el derivado debe compartirse en la misma licencia |
| 3 | `characters.json` (3 cuerpos, 4 cabezas) | `INIT/Personajes.ini`, `INIT/Cabezas.ini` | AGPL-3.0 del repo; dato derivado | Igual que #1 | **aproximado** | Sí, bajo AGPL-3.0 |
| 4 | `maps/{1,34,59,62,272}.json` | `Mapas/Alkon/Mapa<ID>.map` | AGPL-3.0 del repo; mapas acreditados a **ReyarB** | Crédito de mapas a ReyarB + `ATTRIBUTION.txt` + AGPL-3.0 | **aproximado** | Sí, bajo AGPL-3.0 |
| 5 | `maps.json` (selección, nombres, spawns) | Datos derivados de los mapas y del servidor fijado | AGPL-3.0 del repo; datos derivados | Igual que #4 | **aproximado** | Sí, bajo AGPL-3.0 |
| 6 | `spellfx.json` (3 FX) | `INIT/fxs.ini`, `INIT/Graficos.ini` | AGPL-3.0 del repo; dato derivado | Igual que #1; aclarar que el mapeo a habilidades del prototipo es propio y aproximado | **aproximado** | Sí, bajo AGPL-3.0 |
| 7 | `audio/*.wav` (3 sonidos) | `AUDIO/WAV/{114,16,27}.wav` | AGPL-3.0 declarada en la raíz; **no hay licencia por WAV ni autoría individual** | Igual que #1. `INIT/Creditos.txt` lista remasterizaciones musicales de terceros, pero **no** identifica estos WAV; no se incluyó música en el subset | **aproximado** | Sí, bajo AGPL-3.0; si se amplía el audio, revisar cada pista (las remasterizaciones citadas tienen autores propios) |
| 8 | `map.json` (compatibilidad) | Copia derivada de `Mapa272.map` | AGPL-3.0 | Igual que #4 | **aproximado** | Sí, bajo AGPL-3.0; es legacy y no lo carga el cliente |
| 9 | `ATTRIBUTION.txt` | Redactado por este proyecto a partir de la fuente upstream | Debe viajar con los recursos; no es una licencia nueva | Es el aviso de atribución local | **confirmado** (contenido), **aproximado** (cesión de medios) | Sí; debe conservarse junto a los recursos |
| 10 | Código y UI del prototipo: `game.js`, `index.html`, `styles.css`, `dist/`, `scripts/`, `roadmap/` | Obra propia del proyecto; la UI no usa assets de GUI upstream | **Sin licencia declarada en la raíz del proyecto** | Ninguna upstream para el código propio, pero el conjunto distribuido incorpora recursos AGPL-3.0 | **sin dato** | El código propio no tiene términos publicados; la distribución combinada queda condicionada por los recursos AGPL-3.0 |
| 11 | Datos del servidor fijado | `ao-libre/ao-server` | AGPL-3.0 | Crédito y licencia si se distribuyera código/datos del servidor | **confirmado** (licencia), **no distribuido** | No se distribuye servidor ni su dataset; solo se usó para análisis estático |

## Atribuciones obligatorias

Tomadas de `INIT/Creditos.txt` y conservadas en `assets/ao/ATTRIBUTION.txt`:

- **Programación:** Recox, Jopiortiz, Chots, Cucsifae, FrankoH298, Wyr0X, Shak, Wolftein, Lorwik, MateoMiccino, Lherkiev.
- **Colaboración gráfica:** ReyarB, Aizanoth (interfaz), guidota (logo).
- **Indexación:** Neo, ReyarB.
- **Mapas:** ReyarB.
- **Testeo:** BelerianD, Neoranger, Neo, Plusin.
- **Traducción al inglés:** ReyarB, Jopiortiz, Recox.
- **Música (remasterizaciones de algunos MP3):** Noninpretio, NicoDeBonis, reduz, TheAinurMusic, PeachGod, Alejandro Pastor VGM. **No se distribuye música en este subset**, pero la lista se conserva para no perder el aviso si se amplía.
- **Webmaster:** Recox.
- **Migración CVS→Git:** Recox. **Mantenimiento de repositorios:** Recox, Jopiortiz.

`INIT/Creditos.txt` **no asigna autoría a cada PNG, Grh o WAV**. Por eso la tabla usa «aproximado» para los medios: hay créditos generales y una licencia global, no una cesión por archivo.

## Qué se puede redistribuir y qué bloquea

### Se puede, con condiciones

1. **Redistribuir el subset actual** (203 PNG, 3 WAV, mapas y JSON derivados) bajo **AGPL-3.0**, conservando:
   - el texto de la licencia AGPL-3.0 del upstream;
   - `assets/ao/ATTRIBUTION.txt` con los créditos;
   - la indicación de que son recursos de AO Libre, no obra original del prototipo.
2. **Publicar el sitio** que los sirve, siempre que se cumpla la cláusula de red de AGPL §13 (ver abajo).
3. **Crear datos derivados** (recortes, JSON, mapeos), que deben quedar bajo la misma licencia y compartirse como fuente.

### Bloqueos y riesgos

- **B1 — Licencia del código propio sin declarar.** No hay `LICENSE` en la raíz del proyecto. Eso deja el código propio en «todos los derechos reservados» por defecto y hace ambiguo el término del conjunto. **No impide** cumplir AGPL para los recursos, pero conviene decidir una licencia para el proyecto (por ejemplo, AGPL-3.0 para todo el repo) antes de presentarlo como proyecto abierto.
- **B2 — AGPL §13 en uso por red.** Si la app se sirve por HTTP, hay que **ofrecer la Corresponding Source** a quien interactúa remotamente. Hoy el repositorio es público, pero la app no muestra un enlace ni una oferta de fuente. Es una acción de cumplimiento pendiente, no un cambio de assets.
- **B3 — Autoría/licencia por medio no documentada.** La única licencia es la global del repositorio. No hay archivo que diga «estos PNG/WAV están bajo X». Se asume AGPL-3.0 por distribución conjunta; **no** hay permiso separado para usar los medios fuera de AGPL.
- **B4 — Medios de terceros no identificados.** Los créditos mencionan colaboradores gráficos y remasterizaciones musicales de autores externos. No se encontró una cesión explícita de esos colaboradores al proyecto. En el subset actual no hay MP3, y los WAV no están atribuidos individualmente; el riesgo aumenta si se amplía el audio o se agregan GUI/logos.
- **B5 — Nombre y marca.** «Argentum Online» y el logo son de sus autores. El prototipo se presenta como «inspirado en», no como cliente oficial; conviene mantener esa fórmula y no usar logos de terceros sin permiso (el logo de guidota **no** está en el subset).
- **B6 — Sin garantía de fidelidad ni de licencia por archivo.** El inventario ya advierte que no hay prueba de que cada medio tenga idéntica concesión. Esta auditoría confirma la licencia global, no una cadena de títulos por archivo.

## Cláusula de red (AGPL §13), en concreto

Si el prototipo se publica en un sitio web:

1. Debe ofrecer a los usuarios remotos la **Corresponding Source** del trabajo cubierto (idealmente, enlace visible a este repositorio y a la revisión desplegada).
2. La oferta debe incluir el código propio que combine con los recursos AGPL y los datos derivados necesarios para regenerarlos.
3. El aviso de licencia y `ATTRIBUTION.txt` deben seguir accesibles desde el sitio o el repositorio publicado junto con la versión servida.

## Acciones pendientes (no ejecutadas en T11)

| ID | Acción | Responsable | Estado |
| --- | --- | --- | --- |
| L1 | Decidir y declarar la licencia del código propio (recomendado: AGPL-3.0 para todo el repo) | Producto | Pendiente |
| L2 | Agregar oferta visible de fuente/licencia en la app o en el pie del sitio publicado | Producto | Pendiente |
| L3 | Incorporar el texto AGPL-3.0 upstream al repo distribuido (o enlazarlo de forma estable) | Producto | Pendiente |
| L4 | Corregir `map.json` o retirarlo: no lo carga el cliente y difiere de `maps/272.json` en `tiles[43][31].b` | Datos | Pendiente |
| L5 | Si se amplía audio/GUI, auditar autoría y términos de cada pista/recurso antes de extraer | Producto | Pendiente |
| L6 | No relicenciar los medios como propietarios ni presentarlos como obra original | Producto | Regla permanente |

## Hallazgos verificados

- **H1.** `LICENSE` del cliente fijado = AGPL-3.0 (texto completo, 34.520 bytes) y GitHub API lo declara `agpl-3.0`. El servidor fijado también declara `agpl-3.0`.
- **H2.** 203 PNG y 3 WAV locales coinciden **exactamente** con los blobs del upstream fijado: son copias, no recreaciones.
- **H3.** No existe aviso de licencia por archivo ni cesión específica de medios; solo la licencia global y `INIT/Creditos.txt`.
- **H4.** `assets/ao/map.json` no coincide con `assets/ao/maps/272.json`: difiere en `tiles[43][31].b` (`true` vs `false`). El extractor lo genera aparte y el cliente no lo solicita; es una copia legacy desactualizada. Se documenta, no se modifica en T11.
- **H5.** El proyecto no tiene `LICENSE` propio; su código queda sin términos declarados.
- **H6.** `ATTRIBUTION.txt` ya conserva revisión, licencia, créditos y la cautela de verificar condiciones; es el aviso que debe viajar con el subset.

## Evidencia reproducible

```bash
# Licencia upstream
curl -sL https://raw.githubusercontent.com/ao-libre/ao-cliente/7d32d61759d6b95069aba72ae12bed03c1d13700/LICENSE | head -3

# Comparación byte a byte contra los blobs del upstream fijado
curl -sL "https://api.github.com/repos/ao-libre/ao-cliente/git/trees/7d32d61759d6b95069aba72ae12bed03c1d13700?recursive=1" -o /tmp/ao-tree.json
node - <<'NODE'
const fs=require('fs'), cp=require('child_process');
const tree=JSON.parse(fs.readFileSync('/tmp/ao-tree.json','utf8')).tree;
const byPath=new Map(tree.map(x=>[x.path,x.sha]));
const sha=p=>cp.execFileSync('git',['hash-object',p],{encoding:'utf8'}).trim();
let ok=0,total=0;
for(const f of fs.readdirSync('assets/ao/graphics')){ if(!f.endsWith('.png'))continue; total++; if(sha('assets/ao/graphics/'+f)===byPath.get('Graficos/'+f))ok++; }
console.log('PNG idénticos:',ok+'/'+total);
NODE
```

**Resultado:** PNG `203/203`, WAV `3/3` idénticos. Mapas y JSON: derivados.

---

Volver al [inventario del subset](inventario-recursos-ao.md) · [cola del loop](../00_cerebro_loop/TODO.md) · [atribución local](../assets/ao/ATTRIBUTION.txt).
