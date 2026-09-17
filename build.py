#!/usr/bin/env python3
"""
Bundle sould-clone/src/* into ONE self-contained index.html.

Every image and the web font are inlined as data URIs, so the output file works
offline, inside sandboxed iframes, or on any static host.

Usage:  python3 build.py
"""
import base64
import mimetypes
import pathlib
import re

ROOT = pathlib.Path(__file__).parent
SRC = ROOT / "src"
OUT = ROOT / "index.html"

MIME = {
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".woff2": "font/woff2",
    ".svg": "image/svg+xml",
}


def data_uri(path: pathlib.Path) -> str:
    mime = MIME.get(path.suffix.lower()) or mimetypes.guess_type(path.name)[0]
    return f"data:{mime};base64," + base64.b64encode(path.read_bytes()).decode("ascii")


def inline_css(css: str) -> str:
    # url('assets/x.png') -> data URI
    def repl(m):
        raw = m.group(1).strip("'\"")
        p = (SRC / raw).resolve()
        return f"url('{data_uri(p)}')" if p.exists() else m.group(0)

    return re.sub(r"url\(([^)]+)\)", repl, css)


def inline_assets_in_js(js: str) -> str:
    # 'assets/foo.jpg' inside string literals -> data URI
    def repl(m):
        quote, raw = m.group(1), m.group(2)
        p = (SRC / raw).resolve()
        return f"{quote}{data_uri(p)}{quote}" if p.exists() else m.group(0)

    return re.sub(r"(['\"])(assets/[\w.\-]+)\1", repl, js)


def main() -> None:
    html = (SRC / "index.html").read_text(encoding="utf-8")
    css = inline_css((SRC / "styles.css").read_text(encoding="utf-8"))
    data = inline_assets_in_js((SRC / "data.js").read_text(encoding="utf-8"))
    app = inline_assets_in_js((SRC / "app.js").read_text(encoding="utf-8"))

    # strip external refs from the shell, then inject everything inline
    html = re.sub(r'\n\s*<link rel="stylesheet"[^>]*>', "", html)
    html = re.sub(r'\n\s*<link rel="icon"[^>]*>', "", html)
    html = re.sub(r'\n\s*<script src="[^"]+"></script>', "", html)
    html = html.replace("</head>", f"  <style>\n{css}\n  </style>\n  </head>")
    html = html.replace(
        "</body>",
        f"  <script>\n{data}\n  </script>\n  <script>\n{app}\n  </script>\n  </body>",
    )

    OUT.write_text(html, encoding="utf-8")
    print(f"built {OUT}  ({OUT.stat().st_size / 1024 / 1024:.2f} MB)")


if __name__ == "__main__":
    main()
