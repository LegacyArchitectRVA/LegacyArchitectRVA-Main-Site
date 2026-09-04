#!/usr/bin/env python3
"""Generate the Cloudflare Pages security headers for the main site.

The generator deliberately locks inline JavaScript with SHA-256 hashes while
allowing only audited external script/connect/frame/font origins. Inline event
handlers are also hash-locked instead of enabling script-src-attr unsafe-inline.
Run it from legacy-site-REPO-READY after changing inline scripts or handlers.
"""
from __future__ import annotations

import base64
import hashlib
import html
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent
PAGES = sorted(ROOT.glob("*.html"))


def csp_hash(source: str) -> str:
    digest = hashlib.sha256(source.encode("utf-8")).digest()
    return "'sha256-" + base64.b64encode(digest).decode("ascii") + "'"


def attr(tag: str, name: str) -> str | None:
    match = re.search(rf"\b{name}\s*=\s*([\"'])(.*?)\1", tag, re.I | re.S)
    return html.unescape(match.group(2)) if match else None


# Audited first-party and third-party origins used by the current HTML.
SCRIPT_SRC = [
    "'self'",
    "https://www.googletagmanager.com",
    "https://static.cloudflareinsights.com",
]
STYLE_SRC = ["'self'", "https://fonts.googleapis.com", "'unsafe-inline'"]
FONT_SRC = ["'self'", "https://fonts.gstatic.com"]
IMG_SRC = [
    "'self'",
    "data:",
    "https://downloads.legacyarchitectrva.com",
    "https://www.google-analytics.com",
]
CONNECT_SRC = [
    "'self'",
    "https://elara-ai.craig-a51.workers.dev",
    "https://usable-hornet-255.convex.cloud",
    "wss://usable-hornet-255.convex.cloud",
    "https://www.googletagmanager.com",
    "https://www.google-analytics.com",
    "https://region1.google-analytics.com",
    "https://analytics.google.com",
    "https://api.hsforms.com",
    "https://cloudflareinsights.com",
    "https://hook.us2.make.com",
]
FRAME_SRC = [
    "https://cal.com",
    "https://app.cal.com",
    "https://js.stripe.com",
    "https://buy.stripe.com",
]
FORM_ACTION = ["'self'", "https://buy.stripe.com"]


def page_csp(page: Path) -> tuple[str, int, int]:
    source = page.read_text(encoding="utf-8")
    script_hashes: list[str] = []
    event_hashes: list[str] = []

    # Hash every inline classic/module script, regardless of other attributes.
    for match in re.finditer(r"<script\b([^>]*)>(.*?)</script\s*>", source, re.I | re.S):
        tag_attrs, body = match.groups()
        src = attr("<script " + tag_attrs + ">", "src")
        if src is None and body.strip():
            script_hashes.append(csp_hash(body))

    # Hash inline event-handler attributes so script-src-attr does not need
    # the much broader unsafe-inline permission.
    for match in re.finditer(r"<[^>]+>", source, re.I | re.S):
        tag = match.group(0)
        for event in re.finditer(r"\bon[a-z]+\s*=\s*([\"'])(.*?)\1", tag, re.I | re.S):
            event_hashes.append(csp_hash(html.unescape(event.group(2))))

    script_src = SCRIPT_SRC + script_hashes
    if event_hashes:
        script_attr = "'unsafe-hashes' " + " ".join(dict.fromkeys(event_hashes))
    else:
        script_attr = "'none'"

    csp = (
        "default-src 'self'; "
        f"script-src {' '.join(script_src)}; "
        f"script-src-attr {script_attr}; "
        f"style-src {' '.join(STYLE_SRC)}; "
        f"img-src {' '.join(IMG_SRC)}; "
        f"font-src {' '.join(FONT_SRC)}; "
        f"connect-src {' '.join(CONNECT_SRC)}; "
        f"frame-src {' '.join(FRAME_SRC)}; "
        "frame-ancestors 'none'; base-uri 'self'; "
        f"form-action {' '.join(FORM_ACTION)}; "
        "object-src 'none'; upgrade-insecure-requests"
    )
    return csp, len(script_hashes), len(set(event_hashes))


lines = [
    "# Security headers for Legacy Architect RVA main site (Cloudflare Pages).",
    "# CSP locks inline JavaScript and event handlers with SHA-256 hashes and permits only audited origins.",
    "# Regenerate after changing inline JavaScript/handlers: python3 gen_csp.py",
    "",
    "/*",
    "  X-Content-Type-Options: nosniff",
    "  Referrer-Policy: strict-origin-when-cross-origin",
    "  Permissions-Policy: geolocation=(), microphone=(), camera=(), payment=(), usb=(), interest-cohort=()",
    "  Strict-Transport-Security: max-age=63072000; includeSubDomains; preload",
    "  X-Frame-Options: DENY",
    "  Cross-Origin-Opener-Policy: same-origin",
    "  Cross-Origin-Resource-Policy: same-origin",
    "",
]

for page in PAGES:
    csp, _, _ = page_csp(page)
    lines.extend([
        f"/{page.name}",
        f"  Content-Security-Policy: {csp}",
        "  Cache-Control: public, max-age=0, must-revalidate",
        "",
    ])
    if page.name == "index.html":
        lines.extend([
            "/",
            f"  Content-Security-Policy: {csp}",
            "  Cache-Control: public, max-age=0, must-revalidate",
            "",
        ])

lines.extend([
    "/assets/*",
    "  Cache-Control: public, max-age=31536000, immutable",
    "",
])
(ROOT / "_headers").write_text("\n".join(lines), encoding="utf-8", newline="")

print(f"_headers generated for {len(PAGES)} HTML pages")
for page in PAGES:
    _, inline_scripts, event_handlers = page_csp(page)
    print(f"  {page.name}: {inline_scripts} inline script hashes, {event_handlers} event-handler hashes")
