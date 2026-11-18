# Referencia visual estable (versión y fecha)

> **Tarea:** T12 · **Fecha de fijación:** 2026-11-18 · **Uso:** patrón reproducible para layout y proporciones del HUD.
> Esta referencia **no** demuestra fidelidad de píxeles, colores ni skins: fija geometría y procedencia.

## Referencia primaria (versionada)

| Campo | Valor |
| --- | --- |
| Repositorio | [`ao-libre/ao-cliente`](https://github.com/ao-libre/ao-cliente) |
| Revisión | `7d32d61759d6b95069aba72ae12bed03c1d13700` |
| Fecha del commit | **2025-09-22T05:18:21Z** (merge PR #924) |
| Archivo | `CODIGO/Formularios/frmMain.frm` |
| Tamaño / SHA-256 | 112.869 bytes · `1769e4e44ed06d391a697a15ec12e00f6eb74ceb8d9dda310099cd1c38ab83ff` |
| Superficie del formulario | **1022 × 767 px** (`ScaleWidth = 1022`, `ScaleHeight = 767`) |
| Conversión | `ClientWidth = 15330` twips y `ClientHeight = 11505` twips → **15 twips = 1 px** |

El formulario principal es una fuente **estable y versionada**: sus coordenadas están en twips y se convierten a píxeles dividiendo por 15. Eso permite reconstruir la geometría sin depender de una captura sin versión.

## Regiones principales

Coordenadas en píxeles desde el borde superior izquierdo del formulario. `x, y, ancho × alto`.

| Región | Control(es) | Rectángulo | Notas |
| --- | --- | --- | --- |
| Chat (historial) | `RecTxt` | `8, 20, 628 × 111` | Arriba a la izquierda; fuente Tahoma 8,25. |
| Entrada del chat | `SendTxt` | `24, 160, 713 × 24` | Debajo del historial, antes del viewport. |
| Consola inferior | `SendCMSTXT` | `24, 720, 713 × 24` | Entrada inferior de comandos. |
| Viewport del mundo | `MainViewPic` | `12, 155, 736 × 608` | Termina en `y = 763`, casi el alto total. |
| Minimapa | `MiniMapa` | `645, 28, 100 × 100` | Superpuesto arriba a la derecha del viewport. |
| Nombre y nivel | `lblName`, `Label6`, `lblLvl`, `lblPorcLvl` | `800, 22` a `957, 100` | Cabecera de la columna derecha. |
| Inventario / equipo | `InvEqu`, `btnInventario`, `btnHechizos` | `792, 128, 198 × 297` | Pestañas de 97×33 / 89×33 sobre el panel. |
| Botones de acción | `btnLanzar`, `btnInfo` | `792, 376, 81 × 33` y `912, 376, 81 × 33` | Dos botones principales. |
| Estadísticas | `lblEnergia`, `lblHambre`, `lblSed`, `lblMana`, `lblVida` | `798, 504` a `993, 562` | Barras y etiquetas numéricas. |
| Rejilla de botones | `btnMapa`, `btnGrupo`, `btnEstadisticas`, `btnOpciones`, `btnClanes`, `btnRetos`, `btnAmigos`, `btnQuests` | `792, 568` a `993, 657` | Dos columnas de 97×17, 24 px entre filas. |
| Equipo inferior | `lblArmor`, `lblHelm`, `lblShielder`, `lblWeapon` | `824, 677` a `993, 724` | Etiquetas `0/0`. |
| Coordenadas | `Coord` | `786, 744, 97 × 17` | Última fila del panel derecho. |

> Los controles `uAOButton`, `Shape` e `Image` toman su aspecto de recursos `.frx` y skins. La geometría es verificable; **el aspecto renderizado no** se deduce solo del `.frm`.

## Referencia secundaria (solo estilo)

La galería oficial de `argentumonline.org` se revisó el **2026-11-14**:

- Seis capturas de la interfaz completa: tres de **1023×770** y tres de **1024×770**.
- La página solo las etiqueta «Screenshot»; **no indica versión ni fecha de captura**.
- Los PNG no traen metadatos de versión; `Last-Modified: 2026-10-22` es la publicación del archivo, no la fecha del cliente.
- El «V:5» visible en una captura no identifica una versión completa.

**Conclusión:** la galería sirve para **estilo general** (paleta, densidad, proporciones), no como patrón de píxeles. La referencia primaria para geometría es `frmMain.frm` en la revisión fijada.

## Qué se puede comparar y qué no

| Elemento | ¿Comparable? | Límite |
| --- | --- | --- |
| Superficie total (1022×767) | **Sí** | El prototipo usa un layout web responsive; no replica la ventana VB6. |
| Posición y tamaño del viewport, chat, panel derecho | **Sí** | Sirve para proporciones, no para copiar coordenadas a CSS. |
| Altura de filas y botones (17 px, 33 px) | **Sí** | Depende de la escala del prototipo. |
| Colores, gradientes y skins | **No** | Provienen de `.frx`/controles propietarios; no están en el subset. |
| Tipografía exacta | **No** | Tahoma 8,25 en VB6 no equivale a la fuente web. |
| Iconos de hechizos e inventario | **No** | No se importaron assets de GUI. |
| Comportamiento de botones | **No** | La referencia es geométrica, no funcional. |

## Cómo reproducir la referencia

```bash
SHA=7d32d61759d6b95069aba72ae12bed03c1d13700
curl -sL "https://raw.githubusercontent.com/ao-libre/ao-cliente/$SHA/CODIGO/Formularios/frmMain.frm" -o /tmp/frmMain.frm
sha256sum /tmp/frmMain.frm   # 1769e4e4…ab83ff
```

Extracción de geometría (twips → px, ÷15):

```bash
node - <<'NODE'
const fs=require('fs');
const lines=fs.readFileSync('/tmp/frmMain.frm','latin1').split(/\r?\n/);
const stack=[], out=[];
for(const line of lines){
  let m=line.match(/^(\s*)Begin\s+(.+?)\s+(\w+)\s*$/);
  if(m){
    const indent=m[1].length, node={type:m[2].trim(),name:m[3],indent,props:{},children:[]};
    while(stack.length && stack[stack.length-1].indent>=indent) stack.pop();
    (stack.length?stack[stack.length-1].node.children:out).push(node);
    stack.push({indent,node}); continue;
  }
  if(/^\s*End\s*$/.test(line)){ stack.pop(); continue; }
  m=line.match(/^\s*([A-Za-z_][\w]*)\s*=\s*(.*)$/);
  if(m && stack.length){ const p=stack[stack.length-1].node.props; if(!(m[1] in p)) p[m[1]]=m[2].trim(); }
}
const px=v=>Math.round(Number(String(v).replace(/[^0-9.-]/g,''))/15);
for(const c of out[0].children){
  const p=c.props, l=px(p.Left), t=px(p.Top), w=px(p.Width), h=px(p.Height);
  if([l,t,w,h].every(Number.isFinite)) console.log(c.name, l,t,w,h);
}
NODE
```

## Límites y próximos pasos

- **No hay captura del cliente con versión y fecha verificables.** La referencia geométrica cubre layout; una comparación de píxeles sigue pendiente y requeriría ejecutar el cliente fijado en un entorno reproducible.
- El prototipo **no** debe copiar coordenadas literalmente: es responsive y su HUD ya está adaptado a escritorio/móvil.
- Si en el futuro se consigue una captura versionada, registrar: revisión del cliente, resolución, sistema/DPI, fecha, procedencia y hash del archivo.
- Mantener esta referencia separada de las capturas de regresión del prototipo (`/tmp/opencode/shots/`), que no se versionan.

---

Volver al [producto recuperado](producto-recuperado.md) · [inventario de recursos](inventario-recursos-ao.md) · [cola del loop](../00_cerebro_loop/TODO.md).
