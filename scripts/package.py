"""Package the extension into a zip for Chrome Web Store submission."""
from pathlib import Path
import json
import zipfile

ROOT = Path(__file__).resolve().parent.parent

INCLUDE = [
    "manifest.json",
    "_locales/en/messages.json",
    "_locales/ja/messages.json",
    "src/content.js",
    "src/popup.html",
    "src/popup.js",
    "src/popup.css",
    "icons/icon16.png",
    "icons/icon32.png",
    "icons/icon48.png",
    "icons/icon128.png",
]


def main() -> None:
    manifest = json.loads((ROOT / "manifest.json").read_text())
    version = manifest["version"]
    out = ROOT / f"video-brightener-v{version}.zip"

    with zipfile.ZipFile(out, "w", compression=zipfile.ZIP_DEFLATED) as z:
        for rel in INCLUDE:
            src = ROOT / rel
            if not src.exists():
                raise FileNotFoundError(f"Missing: {rel}")
            z.write(src, arcname=rel)
            print(f"  + {rel}")

    print(f"\nWrote {out} ({out.stat().st_size / 1024:.1f} KB)")


if __name__ == "__main__":
    main()
