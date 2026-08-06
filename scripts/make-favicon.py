#!/usr/bin/env python3
# Builds frontend/public/favicon.ico from a source PNG/SVG-rendered-to-PNG,
# embedding the standard set of sizes browsers pick from (16-256px).
#
# Usage:
#   python3 scripts/make-favicon.py <source.png> [output.ico]
#   (or `make favicon SRC=frontend/public/icons/sew_square_icon.png`)
import sys
from pathlib import Path

from PIL import Image

SIZES = [16, 32, 48, 64, 128, 256]


def main() -> None:
    if len(sys.argv) < 2:
        print(f"Usage: {sys.argv[0]} <source.png> [output.ico]", file=sys.stderr)
        sys.exit(1)

    src = Path(sys.argv[1])
    dst = Path(sys.argv[2]) if len(sys.argv) > 2 else Path("frontend/public/favicon.ico")

    im = Image.open(src).convert("RGBA")
    dst.parent.mkdir(parents=True, exist_ok=True)
    im.save(dst, sizes=[(s, s) for s in SIZES])
    print(f"Wrote {dst} ({', '.join(f'{s}x{s}' for s in SIZES)})")


if __name__ == "__main__":
    main()
