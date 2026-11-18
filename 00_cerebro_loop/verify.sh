#!/usr/bin/env bash
# Preflight del loop. No reemplaza la verificación en navegador.
set -Eeuo pipefail

ROOT="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd -P)"
cd "$ROOT"

FAIL=0
say() { printf '%s\n' "$*"; }
ok() { say "OK   $*"; }
bad() { say "FAIL $*"; FAIL=1; }

say "== Preflight del loop =="
say "Repo: $ROOT"
say ""

# 1. Sintaxis JavaScript
if node --check game.js >/dev/null 2>&1; then ok "node --check game.js"; else bad "node --check game.js"; fi
if node --check dist/game.js >/dev/null 2>&1; then ok "node --check dist/game.js"; else bad "node --check dist/game.js"; fi

# 2. Copias de despliegue sincronizadas
for f in index.html styles.css game.js favicon.svg; do
  if [[ ! -f "$f" ]]; then bad "falta $f"; continue; fi
  if [[ ! -f "dist/$f" ]]; then bad "falta dist/$f"; continue; fi
  if cmp -s "$f" "dist/$f"; then ok "dist/$f sincronizado"; else bad "dist/$f difiere de $f"; fi
done

# 3. JSON de assets válido
if python3 - <<'PY'
import json
import pathlib
import sys

fail = False
paths = sorted(pathlib.Path("assets/ao").rglob("*.json"))
if not paths:
    print("FAIL no hay JSON en assets/ao")
    sys.exit(1)
for path in paths:
    try:
        json.loads(path.read_text(encoding="utf-8"))
    except Exception as exc:
        print(f"FAIL JSON inválido: {path}: {exc}")
        fail = True
if not fail:
    print(f"OK   {len(paths)} JSON de assets/ao válidos")
sys.exit(1 if fail else 0)
PY
then :; else FAIL=1; fi

# 4. Whitespace / errores de diff
if git diff --check >/dev/null 2>&1; then ok "git diff --check"; else bad "git diff --check"; fi

# 5. Archivos canónicos del loop presentes
for f in README.md PROTOCOL.md USER_REQUESTS.md ROADMAP.md TODO.md HANDOFF.md DECISIONS.md HISTORY.md; do
  if [[ -s "00_cerebro_loop/$f" ]]; then ok "00_cerebro_loop/$f"; else bad "00_cerebro_loop/$f ausente o vacío"; fi
done

# 6. Enlaces locales de la documentación
if python3 - <<'PY'
import pathlib
import re
import sys

root = pathlib.Path(".")
files = [*root.glob("00_cerebro_loop/*.md"), root / "README.md", root / "Agents.md"]
missing = []
for path in files:
    text = path.read_text(encoding="utf-8")
    for match in re.finditer(r"\[[^\]]+\]\(([^)#]+)(?:#[^)]*)?\)", text):
        target = match.group(1).strip()
        if target.startswith(("http://", "https://", "mailto:", "#")):
            continue
        if not (path.parent / target).exists():
            missing.append(f"{path}: {target}")
if missing:
    print("FAIL enlaces locales rotos:")
    for item in missing:
        print(f"  - {item}")
    sys.exit(1)
print(f"OK   enlaces locales en {len(files)} Markdown")
PY
then :; else FAIL=1; fi

say ""
say "Verificación manual obligatoria (navegador):"
say "  1) PORT=3002 bash start.sh"
say "  2) playwright-cli open http://localhost:3002"
say "  3) playwright-cli console        # 0 errores / 0 advertencias"
say "  4) probar escritorio 1440x1000 y móvil 390x844"
say "  5) guardar capturas en /tmp/opencode/shots/"
say ""

if (( FAIL )); then
  say "RESULTADO: ROJO — corregir antes de cerrar la tarea."
  exit 1
fi
say "RESULTADO: VERDE (preflight). Falta la validación en navegador."
