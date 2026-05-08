"""Generate AutoLift icons (16/48/128) using PIL.

Design: amber sun on dark rounded square. Rays at larger sizes,
simple solid disc at 16px for clarity at small size.
"""
from PIL import Image, ImageDraw, ImageFont
import math
from pathlib import Path

JP_FONT = "/usr/share/fonts/opentype/ipafont-gothic/ipag.ttf"
EN_FONT = "/usr/share/fonts/opentype/ipafont-gothic/ipag.ttf"

OUT_DIR = Path(__file__).resolve().parent.parent / "icons"
OUT_DIR.mkdir(parents=True, exist_ok=True)

BG_COLOR = (24, 28, 36, 255)
SUN_COLOR = (251, 191, 36, 255)
SUN_HIGHLIGHT = (254, 215, 102, 255)


def rounded_rect_mask(size: int, radius: int) -> Image.Image:
    mask = Image.new("L", (size, size), 0)
    d = ImageDraw.Draw(mask)
    d.rounded_rectangle((0, 0, size - 1, size - 1), radius=radius, fill=255)
    return mask


def make_icon(size: int) -> Image.Image:
    scale = 4
    s = size * scale
    img = Image.new("RGBA", (s, s), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)

    radius = int(s * 0.22)
    d.rounded_rectangle((0, 0, s - 1, s - 1), radius=radius, fill=BG_COLOR)

    cx, cy = s / 2, s / 2

    if size >= 32:
        ray_count = 8
        ray_inner = s * 0.26
        ray_outer = s * 0.42
        ray_width = max(2, int(s * 0.045))
        for i in range(ray_count):
            angle = (i / ray_count) * 2 * math.pi
            x1 = cx + math.cos(angle) * ray_inner
            y1 = cy + math.sin(angle) * ray_inner
            x2 = cx + math.cos(angle) * ray_outer
            y2 = cy + math.sin(angle) * ray_outer
            d.line([(x1, y1), (x2, y2)], fill=SUN_COLOR, width=ray_width)
        sun_radius = s * 0.20
    else:
        sun_radius = s * 0.30

    d.ellipse(
        (cx - sun_radius, cy - sun_radius, cx + sun_radius, cy + sun_radius),
        fill=SUN_COLOR,
    )

    if size >= 48:
        hl_r = sun_radius * 0.45
        hl_offset = sun_radius * 0.35
        d.ellipse(
            (
                cx - hl_offset - hl_r,
                cy - hl_offset - hl_r,
                cx - hl_offset + hl_r,
                cy - hl_offset + hl_r,
            ),
            fill=SUN_HIGHLIGHT,
        )

    img = img.resize((size, size), Image.LANCZOS)
    return img


def make_promo(width: int, height: int, sub_text: str = "動画の暗いシーンを明るく") -> Image.Image:
    img = Image.new("RGB", (width, height), (24, 28, 36))
    d = ImageDraw.Draw(img)

    cx, cy = width * 0.18, height * 0.5
    sun_radius = min(width, height) * 0.16

    ray_count = 12
    ray_inner = sun_radius * 1.4
    ray_outer = sun_radius * 2.1
    ray_width = max(3, int(min(width, height) * 0.012))
    for i in range(ray_count):
        angle = (i / ray_count) * 2 * math.pi
        x1 = cx + math.cos(angle) * ray_inner
        y1 = cy + math.sin(angle) * ray_inner
        x2 = cx + math.cos(angle) * ray_outer
        y2 = cy + math.sin(angle) * ray_outer
        d.line([(x1, y1), (x2, y2)], fill=SUN_COLOR, width=ray_width)
    d.ellipse(
        (cx - sun_radius, cy - sun_radius, cx + sun_radius, cy + sun_radius),
        fill=SUN_COLOR,
    )

    text_x = width * 0.36
    available_w = width - text_x - width * 0.04

    title = "AutoLift"
    title_size = int(height * 0.22)
    title_font = ImageFont.truetype(EN_FONT, title_size)

    sub_size = int(height * 0.085)
    sub_font = ImageFont.truetype(JP_FONT, sub_size)
    while sub_size > 10:
        bbox = d.textbbox((0, 0), sub_text, font=sub_font)
        if bbox[2] - bbox[0] <= available_w:
            break
        sub_size -= 1
        sub_font = ImageFont.truetype(JP_FONT, sub_size)

    title_bbox = d.textbbox((0, 0), title, font=title_font)
    title_h = title_bbox[3] - title_bbox[1]
    sub_bbox = d.textbbox((0, 0), sub_text, font=sub_font)
    sub_h = sub_bbox[3] - sub_bbox[1]
    gap = int(height * 0.05)
    total_h = title_h + gap + sub_h
    text_y = (height - total_h) / 2 - title_bbox[1]

    d.text((text_x, text_y), title, fill=(245, 245, 245), font=title_font)
    sub_y = text_y + title_h + gap - (sub_bbox[1] - title_bbox[1])
    d.text((text_x, sub_y), sub_text, fill=(180, 188, 200), font=sub_font)

    return img


def main() -> None:
    for size in (16, 32, 48, 128):
        img = make_icon(size)
        out = OUT_DIR / f"icon{size}.png"
        img.save(out)
        print(f"wrote {out} ({size}x{size})")

    promo_dir = OUT_DIR.parent / "store-assets"
    promo_dir.mkdir(parents=True, exist_ok=True)
    small_promo = make_promo(440, 280)
    small_promo.save(promo_dir / "promo-small-440x280.png")
    print(f"wrote {promo_dir / 'promo-small-440x280.png'}")
    marquee_promo = make_promo(1400, 560)
    marquee_promo.save(promo_dir / "promo-marquee-1400x560.png")
    print(f"wrote {promo_dir / 'promo-marquee-1400x560.png'}")


if __name__ == "__main__":
    main()
