import json
import re
from pathlib import Path

ROOT = Path(r"C:/Users/EZEN/Desktop/github/gyoyeon")
SKIP_DIRS = {".git", "node_modules", "scripts"}
CODE_EXTS = {".html", ".css", ".js"}
RASTER_EXT = re.compile(r"\.(png|jpg|jpeg)(?=[?\"')\s]|$)", re.I)

sizes = json.loads((ROOT / "scripts" / "webp-sizes.json").read_text(encoding="utf-8"))
size_by_stem = {}
for key, wh in sizes.items():
    webp_key = RASTER_EXT.sub(".webp", key)
    size_by_stem[webp_key.replace("\\", "/")] = wh
    size_by_stem[key.replace("\\", "/")] = wh


def to_webp_text(text):
    return RASTER_EXT.sub(".webp", text)


def patch_code_files():
    changed = []
    for path in ROOT.rglob("*"):
        if not path.is_file() or path.suffix.lower() not in CODE_EXTS:
            continue
        if any(part in SKIP_DIRS for part in path.parts):
            continue
        original = path.read_text(encoding="utf-8")
        updated = to_webp_text(original)
        if updated != original:
            path.write_text(updated, encoding="utf-8")
            changed.append(str(path.relative_to(ROOT)))
    return changed


def rebuild_project_sizes():
    projects = ROOT / "js" / "projects.js"
    text = projects.read_text(encoding="utf-8")
    entries = []
    for key in sorted(size_by_stem):
        if not key.startswith("assets/images/projects/") or not key.endswith(".webp"):
            continue
        w, h = size_by_stem[key]
        entries.append(f'  "{key}": [{w}, {h}],')
    block = "const PROJECT_IMAGE_SIZE = {\n" + "\n".join(entries) + "\n};"
    text = re.sub(
        r"const PROJECT_IMAGE_SIZE = \{.*?\n\};",
        block,
        text,
        count=1,
        flags=re.S,
    )
    projects.write_text(text, encoding="utf-8")


if __name__ == "__main__":
    changed = patch_code_files()
    rebuild_project_sizes()
    print("patched", len(changed))
    for item in changed:
        print(item)
