"""Generate Chrome Web Store screenshots (1280x800).

Creates marketing-style product shots showing the popup UI rendered
as PIL graphics on branded backgrounds.
"""
from PIL import Image, ImageDraw, ImageFont, ImageFilter
from pathlib import Path

OUT = Path(__file__).resolve().parent.parent / "store-assets" / "screenshots"
OUT.mkdir(parents=True, exist_ok=True)

JP_FONT = "/usr/share/fonts/opentype/ipafont-gothic/ipag.ttf"

# Colors aligned with popup.css dark theme
PANEL_BG = (35, 35, 35)
FG = (240, 240, 240)
SUBTLE = (157, 164, 174)
PRIMARY = (245, 158, 11)
BORDER = (56, 56, 56)
TRACK = (45, 45, 45)
GRADIENT_TOP = (24, 28, 36)
GRADIENT_BOTTOM = (10, 14, 22)


def gradient_bg(w, h):
    img = Image.new("RGB", (w, h))
    pixels = img.load()
    for y in range(h):
        ratio = y / h
        r = int(GRADIENT_TOP[0] * (1 - ratio) + GRADIENT_BOTTOM[0] * ratio)
        g = int(GRADIENT_TOP[1] * (1 - ratio) + GRADIENT_BOTTOM[1] * ratio)
        b = int(GRADIENT_TOP[2] * (1 - ratio) + GRADIENT_BOTTOM[2] * ratio)
        for x in range(w):
            pixels[x, y] = (r, g, b)
    return img


def render_popup(scale=2):
    s = scale
    pw = 280 * s
    pad = 16 * s

    # Estimate height by sketching once and tracking y
    # Actual UI: header(20) + 16 + brightness(50) + 16 + contrast(50) + 16 + presets(28) + 14 + sep + 10 + footer(28) + pad
    ph_est = pad + 26 * s + 16 * s + 50 * s + 16 * s + 50 * s + 16 * s + 28 * s + 14 * s + 10 * s + 32 * s + pad
    popup = Image.new("RGB", (pw, ph_est), PANEL_BG)
    d = ImageDraw.Draw(popup)

    title_font = ImageFont.truetype(JP_FONT, 16 * s)
    label_font = ImageFont.truetype(JP_FONT, 12 * s)
    val_font = ImageFont.truetype(JP_FONT, 13 * s)
    tick_font = ImageFont.truetype(JP_FONT, 10 * s)
    foot_font = ImageFont.truetype(JP_FONT, 11 * s)

    # Header
    y = pad
    d.text((pad, y), "Video Brightener", fill=FG, font=title_font)
    title_bbox = d.textbbox((0, 0), "Video Brightener", font=title_font)
    title_h = title_bbox[3] - title_bbox[1]

    # Toggle ON
    tw, th = 36 * s, 20 * s
    tx = pw - pad - tw
    ty = y + (title_h - th) // 2
    d.rounded_rectangle([tx, ty, tx + tw, ty + th], radius=th // 2, fill=PRIMARY)
    knob_size = 16 * s
    kx = tx + tw - knob_size - 2 * s
    ky = ty + 2 * s
    d.ellipse([kx, ky, kx + knob_size, ky + knob_size], fill=(255, 255, 255))

    y = pad + 26 * s + 16 * s

    # Brightness
    d.text((pad, y), "明るさ", fill=FG, font=label_font)
    val_bbox = d.textbbox((0, 0), "中", font=val_font)
    d.text((pw - pad - (val_bbox[2] - val_bbox[0]), y - 1 * s), "中", fill=PRIMARY, font=val_font)
    y += 20 * s
    track_w = pw - 2 * pad
    d.rounded_rectangle([pad, y, pad + track_w, y + 4 * s], radius=2 * s, fill=TRACK)
    thumb_x = pad + int(track_w * 0.5) - 8 * s
    d.ellipse([thumb_x, y - 6 * s, thumb_x + 16 * s, y - 6 * s + 16 * s], fill=PRIMARY)
    y += 14 * s
    d.text((pad, y), "弱", fill=SUBTLE, font=tick_font)
    end_bbox = d.textbbox((0, 0), "強", font=tick_font)
    d.text((pw - pad - (end_bbox[2] - end_bbox[0]), y), "強", fill=SUBTLE, font=tick_font)

    y += 24 * s

    # Contrast
    d.text((pad, y), "コントラスト", fill=FG, font=label_font)
    val_bbox = d.textbbox((0, 0), "+10%", font=val_font)
    d.text((pw - pad - (val_bbox[2] - val_bbox[0]), y - 1 * s), "+10%", fill=PRIMARY, font=val_font)
    y += 20 * s
    d.rounded_rectangle([pad, y, pad + track_w, y + 4 * s], radius=2 * s, fill=TRACK)
    thumb_x = pad + int(track_w * 0.2) - 8 * s
    d.ellipse([thumb_x, y - 6 * s, thumb_x + 16 * s, y - 6 * s + 16 * s], fill=PRIMARY)
    y += 14 * s
    d.text((pad, y), "標準", fill=SUBTLE, font=tick_font)
    d.text((pw - pad - (end_bbox[2] - end_bbox[0]), y), "強", fill=SUBTLE, font=tick_font)

    y += 24 * s

    # Presets
    btn_count = 4
    gap = 6 * s
    btn_w = (track_w - gap * (btn_count - 1)) // btn_count
    btn_h = 28 * s
    presets = ["弱", "中", "強", "最強"]
    for i, label in enumerate(presets):
        bx = pad + i * (btn_w + gap)
        d.rounded_rectangle([bx, y, bx + btn_w, y + btn_h], radius=6 * s, outline=BORDER, width=max(1, s))
        bbox = d.textbbox((0, 0), label, font=label_font)
        d.text(
            (bx + (btn_w - (bbox[2] - bbox[0])) // 2 - bbox[0],
             y + (btn_h - (bbox[3] - bbox[1])) // 2 - bbox[1]),
            label, fill=FG, font=label_font,
        )

    y += btn_h + 14 * s

    d.line([(pad, y), (pw - pad, y)], fill=BORDER, width=max(1, s))
    y += 10 * s

    d.text((pad, y), "対応: YouTube / Twitch / ニコニコ /", fill=SUBTLE, font=foot_font)
    y += 14 * s
    d.text((pad, y), "       Vimeo / U-NEXT / ABEMA", fill=SUBTLE, font=foot_font)
    y += 18 * s

    # Crop to content
    return popup.crop((0, 0, pw, y + pad))


def add_shadow(canvas, popup, x, y):
    pw, ph = popup.size
    pad = 30
    shadow = Image.new("RGBA", (pw + pad * 2, ph + pad * 2), (0, 0, 0, 0))
    ImageDraw.Draw(shadow).rounded_rectangle(
        [pad, pad, pad + pw, pad + ph], radius=16, fill=(0, 0, 0, 130)
    )
    shadow = shadow.filter(ImageFilter.GaussianBlur(20))
    canvas.paste(shadow, (x - pad, y - pad), shadow)
    canvas.paste(popup, (x, y))


def screenshot_popup_hero():
    W, H = 1280, 800
    img = gradient_bg(W, H)
    d = ImageDraw.Draw(img)

    tag_font = ImageFont.truetype(JP_FONT, 42)

    tag1 = "動画の暗いシーンを、"
    tag2 = "ワンクリックで明るく。"

    y = 60
    bbox = d.textbbox((0, 0), tag1, font=tag_font)
    d.text(((W - (bbox[2] - bbox[0])) // 2 - bbox[0], y), tag1, fill=(245, 245, 245), font=tag_font)
    y += 60
    bbox = d.textbbox((0, 0), tag2, font=tag_font)
    d.text(((W - (bbox[2] - bbox[0])) // 2 - bbox[0], y), tag2, fill=PRIMARY, font=tag_font)

    popup = render_popup(scale=2)
    pw, ph = popup.size
    px = (W - pw) // 2
    py = H - ph - 25
    add_shadow(img, popup, px, py)

    return img


def screenshot_supported_sites():
    W, H = 1280, 800
    img = gradient_bg(W, H)
    d = ImageDraw.Draw(img)

    title_font = ImageFont.truetype(JP_FONT, 56)
    sub_font = ImageFont.truetype(JP_FONT, 26)
    site_font = ImageFont.truetype(JP_FONT, 38)
    note_font = ImageFont.truetype(JP_FONT, 18)

    y = 100
    title = "対応サイト"
    bbox = d.textbbox((0, 0), title, font=title_font)
    d.text(((W - (bbox[2] - bbox[0])) // 2 - bbox[0], y), title, fill=(245, 245, 245), font=title_font)
    y += 80
    sub = "ストリーミング・動画配信の暗部に効く"
    bbox = d.textbbox((0, 0), sub, font=sub_font)
    d.text(((W - (bbox[2] - bbox[0])) // 2 - bbox[0], y), sub, fill=SUBTLE, font=sub_font)

    sites = [
        ("YouTube", None),
        ("Twitch", None),
        ("ニコニコ動画", None),
        ("Vimeo", None),
        ("U-NEXT", "DRM動作確認済"),
        ("ABEMA", "DRM動作確認済"),
    ]

    grid_top = y + 80
    cols = 3
    rows = 2
    cell_w = 360
    cell_h = 140
    gap_x = 20
    gap_y = 20
    total_w = cols * cell_w + (cols - 1) * gap_x
    grid_left = (W - total_w) // 2

    for idx, (name, badge) in enumerate(sites):
        col = idx % cols
        row = idx // cols
        cx = grid_left + col * (cell_w + gap_x)
        cy = grid_top + row * (cell_h + gap_y)
        d.rounded_rectangle(
            [cx, cy, cx + cell_w, cy + cell_h], radius=12,
            fill=PANEL_BG, outline=BORDER, width=1
        )
        bbox = d.textbbox((0, 0), name, font=site_font)
        nx = cx + (cell_w - (bbox[2] - bbox[0])) // 2 - bbox[0]
        ny = cy + (cell_h - (bbox[3] - bbox[1])) // 2 - bbox[1] - (10 if badge else 0)
        d.text((nx, ny), name, fill=FG, font=site_font)
        if badge:
            bbox_b = d.textbbox((0, 0), badge, font=note_font)
            d.text(
                (cx + (cell_w - (bbox_b[2] - bbox_b[0])) // 2 - bbox_b[0],
                 cy + cell_h - 32),
                badge, fill=PRIMARY, font=note_font,
            )

    return img


def main():
    s1 = screenshot_popup_hero()
    s1.save(OUT / "01-popup-hero.jpg", quality=92)
    print(f"wrote {OUT / '01-popup-hero.jpg'}")

    s2 = screenshot_supported_sites()
    s2.save(OUT / "02-supported-sites.jpg", quality=92)
    print(f"wrote {OUT / '02-supported-sites.jpg'}")


if __name__ == "__main__":
    main()
