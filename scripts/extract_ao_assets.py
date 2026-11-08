#!/usr/bin/env python3
"""Extract map and sprite data for local use by the AO browser prototype.

Usage: python3 scripts/extract_ao_assets.py /path/to/ao-cliente
The source client is not bundled. Only extract and use resources you are
permitted to use; generated files in assets/ao/ retain upstream licensing.
"""
from __future__ import annotations

import json
import re
import shutil
import struct
import subprocess
import sys
from pathlib import Path

TILE_SIZE = 32
MAP_SIDE = 100
AO_SERVER_REVISION = "ca6ad7ff428a585475373474ec5640eabe05961b"
SPELL_FX = {
    2: {"name": "Dardo Mágico", "fx": 15, "wav": 114, "loops": 2},
    9: {"name": "Paralizar", "fx": 8, "wav": 16, "loops": 0},
    25: {"name": "Apocalipsis", "fx": 13, "wav": 27, "loops": 0},
}


def parse_ini(path: Path) -> dict[int, list[int]]:
    entries: dict[int, list[int]] = {}
    for line in path.read_text(encoding="latin1").splitlines():
        match = re.match(r"Grh(\d+)=(.*)", line.strip(), re.IGNORECASE)
        if not match:
            continue
        try:
            entries[int(match.group(1))] = [int(value.strip()) for value in match.group(2).split("-")]
        except ValueError:
            continue
    return entries


def parse_character_ini(path: Path, prefix: str, keys: list[str]) -> dict[int, dict[str, int]]:
    text = path.read_text(encoding="latin1")
    result = {}
    for match in re.finditer(r"\[" + prefix + r"(\d+)\](.*?)(?=\[|$)", text, re.IGNORECASE | re.DOTALL):
        values = {}
        for key in keys:
            found = re.search(r"^\s*" + key + r"\s*=\s*(-?\d+)", match.group(2), re.IGNORECASE | re.MULTILINE)
            if found:
                values[key] = int(found.group(1))
        if values:
            result[int(match.group(1))] = values
    return result


def main() -> None:
    if len(sys.argv) != 2:
        raise SystemExit("Usage: extract_ao_assets.py /path/to/ao-cliente")
    source = Path(sys.argv[1]).resolve()
    root = Path(__file__).resolve().parents[1]
    output = root / "assets" / "ao"
    graphics_dir = output / "graphics"
    audio_dir = output / "audio"
    graphics_dir.mkdir(parents=True, exist_ok=True)
    audio_dir.mkdir(parents=True, exist_ok=True)

    raw_map = (source / "Mapas/Alkon/Mapa2.map").read_bytes()
    if len(raw_map) < 273 + MAP_SIDE * MAP_SIDE * 5:
        raise SystemExit("Unexpected Mapa2.map size")
    cursor = 273
    tiles = []
    roots: set[int] = set()
    for y in range(MAP_SIDE):
        row = []
        for x in range(MAP_SIDE):
            flags = raw_map[cursor]
            cursor += 1
            layers = []
            for bit in (0, 2, 4, 8):
                if bit == 0 or flags & bit:
                    graphic = struct.unpack_from("<I", raw_map, cursor)[0]
                    cursor += 4
                    layers.append(graphic)
                    if graphic:
                        roots.add(graphic)
                else:
                    layers.append(0)
            if flags & 16:
                cursor += 2
            if flags & 32:
                cursor += 2
            row.append({"b": bool(flags & 1), "g": layers})
        tiles.append(row)
    if cursor != len(raw_map):
        raise SystemExit(f"Map parse ended at {cursor}; file is {len(raw_map)} bytes")

    fx_definitions = parse_character_ini(source / "INIT/fxs.ini", "FX", ["Animacion", "OffsetX", "OffsetY"])
    selected_fx = {}
    for spell_id, spell in SPELL_FX.items():
        definition = fx_definitions.get(spell["fx"])
        sound = source / "AUDIO" / "WAV" / f"{spell['wav']}.wav"
        if not definition or not sound.is_file():
            raise SystemExit(f"Missing FX{spell['fx']} or WAV{spell['wav']} for {spell['name']}")
        selected_fx[str(spell_id)] = {**spell, **{
            "animation": definition["Animacion"],
            "offsetX": definition.get("OffsetX", 0),
            "offsetY": definition.get("OffsetY", 0),
        }}
        roots.add(definition["Animacion"])

    bodies = parse_character_ini(source / "INIT/Personajes.ini", "BODY", ["Walk1", "Walk2", "Walk3", "Walk4", "HeadOffsetX", "HeadOffsetY"])
    heads = parse_character_ini(source / "INIT/Cabezas.ini", "HEAD", ["Head1", "Head2", "Head3", "Head4"])
    selected_bodies = {index: bodies[index] for index in (1, 2, 3) if index in bodies}
    selected_heads = {index: heads[index] for index in (1, 2, 3, 4) if index in heads}
    for entry in selected_bodies.values():
        roots.update(entry[key] for key in ("Walk1", "Walk2", "Walk3", "Walk4"))
    for entry in selected_heads.values():
        roots.update(entry[key] for key in ("Head1", "Head2", "Head3", "Head4"))

    definitions = parse_ini(source / "INIT/Graficos.ini")
    needed: set[int] = set()
    pending = list(roots)
    while pending:
        graphic = pending.pop()
        if graphic <= 0 or graphic in needed:
            continue
        definition = definitions.get(graphic)
        if not definition:
            continue
        needed.add(graphic)
        if definition[0] == 1:
            image_id = definition[1]
            if not (source / "Graficos" / f"{image_id}.png").is_file():
                raise SystemExit(f"Missing graphics sheet {image_id}.png referenced by Grh{graphic}")
        else:
            pending.extend(definition[1:-1])

    image_ids = set()
    grhs = {}
    for graphic in needed:
        definition = definitions[graphic]
        if definition[0] == 1:
            _, image_id, sx, sy, width, height = definition
            image_ids.add(image_id)
            grhs[str(graphic)] = {"image": image_id, "x": sx, "y": sy, "w": width, "h": height}
        else:
            count = definition[0]
            grhs[str(graphic)] = {"frames": definition[1:1 + count], "speed": definition[-1]}

    for image_id in sorted(image_ids):
        shutil.copy2(source / "Graficos" / f"{image_id}.png", graphics_dir / f"{image_id}.png")
    for spell in selected_fx.values():
        shutil.copy2(source / "AUDIO" / "WAV" / f"{spell['wav']}.wav", audio_dir / f"{spell['wav']}.wav")

    source_revision = subprocess.run(
        ["git", "-C", str(source), "rev-parse", "HEAD"],
        check=False, capture_output=True, text=True,
    )
    revision = source_revision.stdout.strip() if source_revision.returncode == 0 else "unknown"
    (output / "map.json").write_text(json.dumps({"width": MAP_SIDE, "height": MAP_SIDE, "tileSize": TILE_SIZE, "tiles": tiles}, separators=(",", ":")))
    (output / "grhs.json").write_text(json.dumps(grhs, separators=(",", ":")))
    (output / "characters.json").write_text(json.dumps({"bodies": selected_bodies, "heads": selected_heads}, separators=(",", ":")))
    (output / "spellfx.json").write_text(json.dumps({"sourceRevision": revision, "serverRevision": AO_SERVER_REVISION, "spells": selected_fx}, separators=(",", ":")))
    print(f"Extracted {MAP_SIDE}x{MAP_SIDE} map, {len(grhs)} Grh records, {len(image_ids)} sheets, {len(selected_fx)} spell effects and sounds to {output}")


if __name__ == "__main__":
    main()
