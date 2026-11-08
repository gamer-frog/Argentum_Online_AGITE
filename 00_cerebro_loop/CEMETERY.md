# CEMETERY

- `origin/opencode-checkpoints/39` (`d1eb37f`): intento de merge en `opencode/42519370341` abortado tras conflictos add/add en los cinco archivos de `00_cerebro_loop/`, `todo.md` y `user-requests.md`. Se preservó el tip completo con el tag local `graveyard-opencode-checkpoints-39`; esta ref remota se conservó como sesión activa.
- Limpieza remota BOOT: se eliminaron inicialmente 51 refs `opencode-checkpoints/*` y `opencode-resume/*`; cada tip quedó preservado con tag local `graveyard-boot-*` (51 tags). Los tips 39 y 40 también se preservaron en sus tags de cementerio antes de eliminar sus refs remotas. `git fetch --prune` y `git ls-remote` confirmaron que ya no quedan refs remotas `opencode-checkpoints/*` ni `opencode-resume/*`.
- `origin/opencode-checkpoints/40` (`920f4b0`): absorbido por fast-forward desde `save-003`; contiene únicamente metadatos de checkpoint/conversación. Tip preservado con `graveyard-opencode-checkpoints-40` antes de eliminar su ref remota.
