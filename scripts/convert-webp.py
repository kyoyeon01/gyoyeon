from pathlib import Path
from PIL import Image, ImageFilter

ROOT = Path(r"C:/Users/EZEN/Desktop/github/gyoyeon")
IMG = ROOT / "assets" / "images"
EXTS = {".png", ".jpg", ".jpeg"}


def has_alpha(im):
    if im.mode in ("RGBA", "LA"):
        return True
    if im.mode == "P" and "transparency" in im.info:
        return True
    return False


def classify(path, im):
    name = path.name.lower()
    rel = path.relative_to(IMG).as_posix()
    alpha = has_alpha(im)

    if alpha and (
        "star" in name
        or "question" in name
        or name.startswith("logo")
        or name.startswith("contact")
        or path.stat().st_size < 400_000
    ):
        return "lossless"

    if "projects/" in rel.replace("\\", "/"):
        if "썸네일" in path.name or path.parent == IMG / "projects":
            return 95
        return 95

    if name in {"profile.jpg", "contact_bg.jpg", "about-stars.png", "background.png"}:
        return 92

    return 95


def max_width_for(path):
    name = path.name
    parent = path.parent.name
    rel = path.relative_to(IMG).as_posix()

    if rel.startswith("projects/"):
        if parent == "projects" or "썸네일" in name:
            return 1800
        return 2560
    if name.startswith("skill") or name.startswith("skil"):
        return None
    if "star" in name.lower() and name != "about-stars.png":
        return None
    if name == "about-question.png":
        return None
    if name.startswith("profile"):
        return 1600
    if name in {f"{i}.png" for i in range(1, 9)} or name == "main.png":
        return None
    if name.startswith("contact") and name != "contact_bg.jpg":
        return None
    if name in {"contact_bg.jpg", "background.png", "about-stars.png"}:
        return 2560
    if name == "logo_white.png":
        return None
    return None


def prepare(im, path):
    im = im.convert("RGBA") if has_alpha(im) else im.convert("RGB")
    max_w = max_width_for(path)
    w, h = im.size
    if max_w and w > int(max_w * 1.15):
        nh = round(h * (max_w / w))
        im = im.resize((max_w, nh), Image.Resampling.LANCZOS)
        im = im.filter(ImageFilter.UnsharpMask(radius=0.6, percent=70, threshold=2))
    return im


def save_webp(im, dest, setting):
    dest.parent.mkdir(parents=True, exist_ok=True)
    kwargs = {"method": 6}
    if setting == "lossless":
        kwargs["lossless"] = True
        if has_alpha(im):
            pass
    else:
        kwargs["quality"] = int(setting)
    im.save(dest, "WEBP", **kwargs)


def main():
    files = sorted(p for p in IMG.rglob("*") if p.suffix.lower() in EXTS)
    report = []
    for path in files:
        rel = path.relative_to(IMG).as_posix()
        out = path.with_suffix(".webp")
        with Image.open(path) as src:
            setting = classify(path, src)
            converted = prepare(src, path)
            save_webp(converted, out, setting)
        src_size = path.stat().st_size
        dst_size = out.stat().st_size
        w, h = Image.open(out).size
        print(f"{rel} -> {out.name} {w}x{h} {setting} {src_size} -> {dst_size}")
        report.append((rel, w, h, setting, src_size, dst_size))

    (ROOT / "scripts" / "webp-report.txt").write_text(
        "\n".join(
            f"{rel}\t{w}x{h}\t{setting}\t{src}\t{dst}"
            for rel, w, h, setting, src, dst in report
        ),
        encoding="utf-8",
    )
    sizes = {f"assets/images/{rel}": [w, h] for rel, w, h, *_ in report}
    import json

    (ROOT / "scripts" / "webp-sizes.json").write_text(
        json.dumps(sizes, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )
    print("done", len(report))


if __name__ == "__main__":
    main()
