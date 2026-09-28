from pathlib import Path

import cv2
import numpy as np
from PIL import Image, ImageFilter

ROOT = Path(r"C:/Users/EZEN/Desktop/github/gyoyeon")
IMG = ROOT / "assets" / "images"
MODELS = ROOT / "scripts" / "models"

DETAIL_W = 2560
THUMB_W = 1755
COVER_BG_W = 2560


def has_alpha(im: Image.Image) -> bool:
    if im.mode in ("RGBA", "LA"):
        return True
    return im.mode == "P" and "transparency" in im.info


def best_source(webp: Path) -> Path:
    candidates = [webp]
    for ext in (".png", ".jpg", ".jpeg", ".PNG", ".JPG", ".JPEG"):
        alt = webp.with_suffix(ext)
        if alt.exists():
            candidates.append(alt)
    scored = []
    for path in candidates:
        with Image.open(path) as im:
            is_original = 1 if path.suffix.lower() in {".png", ".jpg", ".jpeg"} else 0
            scored.append((im.size[0] * im.size[1], is_original, path.stat().st_size, path))
    scored.sort(reverse=True)
    return scored[0][3]


def target_width(rel: str, name: str) -> int | None:
    posix = rel.replace("\\", "/")
    if posix.startswith("projects/"):
        if posix.count("/") == 1 or "썸네일" in name:
            return THUMB_W
        return DETAIL_W
    if name == "contact_bg.webp":
        return COVER_BG_W
    if name == "about-stars.webp":
        return COVER_BG_W
    return None


def quality_for(rel: str, name: str, alpha: bool) -> str | int:
    posix = rel.replace("\\", "/")
    if alpha and (
        "star" in name.lower()
        or "question" in name
        or name.startswith("logo")
        or name.startswith("contact")
        or name.startswith("skill")
        or name.startswith("skil")
    ):
        return "lossless"
    if posix.startswith("projects/"):
        return 95
    if name in {"contact_bg.webp", "about-stars.webp"}:
        return 93
    return 95


class SuperRes:
    def __init__(self):
        self.models = {}
        for scale in (2, 3):
            sr = cv2.dnn_superres.DnnSuperResImpl_create()
            sr.readModel(str(MODELS / f"FSRCNN_x{scale}.pb"))
            sr.setModel("fsrcnn", scale)
            self.models[scale] = sr

    def upscale_bgr(self, bgr: np.ndarray, scale: int) -> np.ndarray:
        return self.models[scale].upsample(bgr)


def choose_scale(width: int, target: int) -> int:
    if width * 2 >= target:
        return 2
    return 3


def enhance_array(src: Image.Image, target_w: int, sr: SuperRes) -> Image.Image:
    rgba = src.convert("RGBA") if has_alpha(src) else src.convert("RGB")
    arr = np.array(rgba)
    alpha = arr[:, :, 3] if arr.ndim == 3 and arr.shape[2] == 4 else None
    rgb = arr[:, :, :3]
    bgr = cv2.cvtColor(rgb, cv2.COLOR_RGB2BGR)

    w = bgr.shape[1]
    if w < int(target_w * 0.96):
        scale = choose_scale(w, target_w)
        bgr = sr.upscale_bgr(bgr, scale)
        if bgr.shape[1] < int(target_w * 0.96) and scale == 2:
            bgr = sr.upscale_bgr(bgr, 2)
        if alpha is not None:
            alpha = cv2.resize(
                alpha,
                (bgr.shape[1], bgr.shape[0]),
                interpolation=cv2.INTER_CUBIC,
            )

    out_w = bgr.shape[1]
    out_h = bgr.shape[0]
    if out_w > int(target_w * 1.08):
        out_h = round(out_h * (target_w / out_w))
        out_w = target_w
        bgr = cv2.resize(bgr, (out_w, out_h), interpolation=cv2.INTER_AREA)
        if alpha is not None:
            alpha = cv2.resize(alpha, (out_w, out_h), interpolation=cv2.INTER_AREA)

    rgb = cv2.cvtColor(bgr, cv2.COLOR_BGR2RGB)
    if alpha is not None:
        out = Image.fromarray(np.dstack([rgb, alpha]), "RGBA")
    else:
        out = Image.fromarray(rgb, "RGB")

    out = out.filter(ImageFilter.UnsharpMask(radius=1.1, percent=115, threshold=2))
    return out


def save_webp(im: Image.Image, dest: Path, setting: str | int):
    kwargs = {"method": 6}
    if setting == "lossless":
        kwargs["lossless"] = True
    else:
        kwargs["quality"] = int(setting)
    dest.parent.mkdir(parents=True, exist_ok=True)
    im.save(dest, "WEBP", **kwargs)


def main():
    sr = SuperRes()
    webps = sorted(p for p in IMG.rglob("*.webp"))
    report = []
    for webp in webps:
        rel = webp.relative_to(IMG).as_posix()
        target = target_width(rel, webp.name)
        if not target:
            continue
        with Image.open(webp) as current:
            cur_w, cur_h = current.size
        if cur_w >= int(target * 0.96):
            continue

        source = best_source(webp)
        with Image.open(source) as src:
            alpha = has_alpha(src)
            src_w, src_h = src.size
            setting = quality_for(rel, webp.name, alpha)
            enhanced = enhance_array(src, target, sr)
        save_webp(enhanced, webp, setting)
        w, h = enhanced.size
        print(
            f"{rel} src={source.name} {src_w}x{src_h} -> {w}x{h} q={setting}"
        )
        report.append((rel, src_w, src_h, w, h, setting, source.name))

    out = ROOT / "scripts" / "enhance-report.txt"
    out.write_text(
        "\n".join(
            f"{rel}\t{sw}x{sh}\t{w}x{h}\t{setting}\t{src}"
            for rel, sw, sh, w, h, setting, src in report
        ),
        encoding="utf-8",
    )
    print("enhanced", len(report))


if __name__ == "__main__":
    main()
