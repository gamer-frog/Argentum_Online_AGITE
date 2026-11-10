#!/usr/bin/env python3
"""Extract map and sprite data for local use by the AO browser prototype.

Usage: python3 scripts/extract_ao_assets.py /path/to/ao-cliente
The source client is not bundled. Only extract and use resources you are
permitted to use; generated files in assets/ao/ retain upstream licensing.
"""
from __future__ import annotations

import argparse
import hashlib
import json
import re
import shutil
import struct
import subprocess
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


def parse_map(path: Path) -> tuple[list[list[dict[str, object]]], set[int]]:
    raw_map = path.read_bytes()
    if len(raw_map) < 273:
        raise SystemExit(f"Unexpected {path.name} size: header is truncated")
    cursor = 273
    tiles: list[list[dict[str, object]]] = []
    roots: set[int] = set()
    for y in range(MAP_SIDE):
        row = []
        for x in range(MAP_SIDE):
            if cursor >= len(raw_map):
                raise SystemExit(f"Unexpected {path.name} size at tile ({x}, {y})")
            flags = raw_map[cursor]
            cursor += 1
            layers = []
            for bit in (0, 2, 4, 8):
                if bit == 0 or flags & bit:
                    if cursor + 4 > len(raw_map):
                        raise SystemExit(f"Unexpected {path.name} size in layers at tile ({x}, {y})")
                    graphic = struct.unpack_from("<I", raw_map, cursor)[0]
                    cursor += 4
                    layers.append(graphic)
                    if graphic:
                        roots.add(graphic)
                else:
                    layers.append(0)
            for bit in (16, 32):
                if flags & bit:
                    if cursor + 2 > len(raw_map):
                        raise SystemExit(f"Unexpected {path.name} size in tile metadata at ({x}, {y})")
                    cursor += 2
            row.append({"b": bool(flags & 1), "g": layers})
        tiles.append(row)
    if cursor != len(raw_map):
        raise SystemExit(f"{path.name} parse ended at {cursor}; file is {len(raw_map)} bytes")
    return tiles, roots


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as file:
        for chunk in iter(lambda: file.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def main() -> None:
    parser = argparse.ArgumentParser(description="Extract selected AO Libre maps and referenced assets.")
    parser.add_argument("source", type=Path, help="path to an ao-cliente checkout")
    parser.add_argument(
        "--map", dest="map_ids", action="append", type=int, metavar="ID",
        help="map ID to extract (repeatable; defaults to 2)",
    )
    args = parser.parse_args()
    source = args.source.resolve()
    map_ids = args.map_ids or [2]
    if any(map_id <= 0 for map_id in map_ids):
        parser.error("map IDs must be positive integers")
    if len(set(map_ids)) != len(map_ids):
        parser.error("map IDs must not be repeated")
    root = Path(__file__).resolve().parents[1]
    output = root / "assets" / "ao"
    graphics_dir = output / "graphics"
    audio_dir = output / "audio"
    graphics_dir.mkdir(parents=True, exist_ok=True)
    audio_dir.mkdir(parents=True, exist_ok=True)

    maps_dir = source / "Mapas/Alkon"
    parsed_maps: dict[int, list[list[dict[str, object]]]] = {}
    roots: set[int] = set()
    for map_id in map_ids:
        map_path = maps_dir / f"Mapa{map_id}.map"
        if not map_path.is_file():
            raise SystemExit(f"Map not found: {map_path}")
        tiles, map_roots = parse_map(map_path)
        parsed_maps[map_id] = tiles
        roots.update(map_roots)

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
    for graphic in sorted(needed):
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
    generated_paths: set[Path] = set()
    extracted_maps = []
    map_output_dir = output / "maps"
    map_output_dir.mkdir(parents=True, exist_ok=True)
    for map_id in map_ids:
        map_path = maps_dir / f"Mapa{map_id}.map"
        map_json = json.dumps(
            {"width": MAP_SIDE, "height": MAP_SIDE, "tileSize": TILE_SIZE, "tiles": parsed_maps[map_id]},
            separators=(",", ":"), sort_keys=True,
        )
        map_output = map_output_dir / f"{map_id}.json"
        map_output.write_text(map_json, encoding="utf-8")
        generated_paths.add(map_output)
        extracted_maps.append({
            "id": map_id,
            "source": f"Mapas/Alkon/Mapa{map_id}.map",
            "sourceSha256": sha256_file(map_path),
            "output": f"maps/{map_id}.json",
            "outputSha256": sha256_file(map_output),
        })
        if map_id == map_ids[0]:
            legacy_map = output / "map.json"
            legacy_map.write_text(map_json, encoding="utf-8")
            generated_paths.add(legacy_map)

    generated_json = {
        "grhs.json": grhs,
        "characters.json": {"bodies": selected_bodies, "heads": selected_heads},
        "spellfx.json": {"sourceRevision": revision, "serverRevision": AO_SERVER_REVISION, "spells": selected_fx},
    }
    for filename, data in generated_json.items():
        path = output / filename
        path.write_text(json.dumps(data, separators=(",", ":"), sort_keys=True), encoding="utf-8")
        generated_paths.add(path)
    generated_paths.update(graphics_dir / f"{image_id}.png" for image_id in image_ids)
    generated_paths.update(audio_dir / f"{spell['wav']}.wav" for spell in selected_fx.values())
    manifest = {
        "schemaVersion": 1,
        "source": {
            "repository": "https://github.com/ao-libre/ao-cliente",
            "revision": revision,
            "expectedRevision": "7d32d61759d6b95069aba72ae12bed03c1d13700",
        },
        "compatibilityMapId": map_ids[0],
        "maps": extracted_maps,
        "generatedFiles": {
            path.relative_to(output).as_posix(): sha256_file(path)
            for path in sorted(generated_paths)
        },
    }
    (output / "manifest.json").write_text(
        json.dumps(manifest, indent=2, sort_keys=True) + "\n", encoding="utf-8",
    )
    print(
        f"Extracted {len(parsed_maps)} map(s), {len(grhs)} Grh records, "
        f"{len(image_ids)} sheets, {len(selected_fx)} spell effects and sounds to {output}"
    )


if __name__ == "__main__":
    main()
