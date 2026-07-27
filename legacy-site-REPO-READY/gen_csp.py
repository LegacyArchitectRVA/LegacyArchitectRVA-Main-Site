#!/usr/bin/env python3
"""Regenerate an immaculate, per-page CSP into _headers.
Run this after ANY edit to inline <script> or <style> blocks."""
import re, hashlib, base64, glob, sys

def sha(x): return "'sha256-"+base64.b64encode(hashlib.sha256(x.encode()).digest()).decode()+"'"

# origins the site genuinely uses (audited from the HTML)
STYLE_SRC   = ["'self'", "https://fonts.googleapis.com"]
FONT_SRC    = ["'self'", "https://fonts.gstatic.com"]
IMG_SRC     = ["'self'", "data:"]
CONNECT_SRC = ["'self'", "https://legacy-assistant.craig-a51.workers.dev"]
FRAME_SRC   = ["https://cal.com", "https://app.cal.com", "https://js.stripe.com", "https://buy.stripe.com"]
SCRIPT_EXTRA= []  # external script origins, if any (none inline-loaded today)

pages=sorted(glob.glob('*.html'))
lines=[]
lines.append("# Security headers. CSP is per-page with hashed inline blocks.")
lines.append("# Regenerate with: python3 gen_csp.py   (after editing any inline script/style)")
lines.append("")

# global headers block first (applies to everything)
lines.append("/*")
lines.append("  X-Content-Type-Options: nosniff")
lines.append("  Referrer-Policy: strict-origin-when-cross-origin")
lines.append("  Permissions-Policy: geolocation=(), microphone=(), camera=(), payment=(), usb=(), interest-cohort=()")
lines.append("  Strict-Transport-Security: max-age=63072000; includeSubDomains; preload")
lines.append("  X-Frame-Options: DENY")
lines.append("  Cross-Origin-Opener-Policy: same-origin")
lines.append("  Cross-Origin-Resource-Policy: same-origin")
lines.append("")
lines.append("/assets/*")
lines.append("  Cache-Control: public, max-age=604800, immutable")
lines.append("")

for f in pages:
    s=open(f).read()
    scripts=re.findall(r'<script>(.*?)</script>', s, re.S)
    styles=re.findall(r'<style>(.*?)</style>', s, re.S)
    shashes=[sha(x) for x in scripts]
    thashes=[sha(x) for x in styles]
    script_src=" ".join(["'self'"]+SCRIPT_EXTRA+shashes) if shashes else "'self'"
    style_src=" ".join(STYLE_SRC+["'unsafe-inline'"]+thashes)
    csp=("default-src 'self'; "
         f"script-src {script_src}; "
         f"style-src {style_src}; "
         f"img-src {' '.join(IMG_SRC)}; "
         f"font-src {' '.join(FONT_SRC)}; "
         f"connect-src {' '.join(CONNECT_SRC)}; "
         f"frame-src {' '.join(FRAME_SRC)}; "
         "frame-ancestors 'none'; base-uri 'self'; form-action 'self' https://buy.stripe.com; "
         "object-src 'none'; upgrade-insecure-requests")
    route="/"+ (f if f!="index.html" else "")
    # Cloudflare _headers matches paths; map index.html to / and also its .html
    lines.append(f"/{f}")
    lines.append(f"  Content-Security-Policy: {csp}")
    lines.append("  Cache-Control: public, max-age=0, must-revalidate")
    lines.append("")
    if f=="index.html":
        lines.append("/")
        lines.append(f"  Content-Security-Policy: {csp}")
        lines.append("  Cache-Control: public, max-age=0, must-revalidate")
        lines.append("")

open('_headers','w').write("\n".join(lines))
print(f"_headers regenerated: {len(pages)} pages, per-page hashed CSP")
# report hash counts
for f in pages:
    s=open(f).read()
    ns=len(re.findall(r'<script>(.*?)</script>', s, re.S))
    nt=len(re.findall(r'<style>(.*?)</style>', s, re.S))
    print(f"  {f}: {ns} script + {nt} style hashes")
