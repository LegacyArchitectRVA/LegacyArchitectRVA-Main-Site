# Security baseline — Legacy Architect RVA main site

## What this site is

Public marketing site. No client credentials. No full financial account numbers. Readiness Check captures name/email and gap answers only.

## Headers

`_headers` ships with Cloudflare Pages deploys from this folder.

Includes:
- HSTS (preload)
- CSP (allowlisted analytics, Cal.com, Stripe, Make, HubSpot, Convex, Elara worker)
- X-Frame-Options DENY + frame-ancestors 'none'
- nosniff, Referrer-Policy, Permissions-Policy, COOP, CORP

## Data rules

- Do not add forms that collect passwords or full account numbers
- Readiness results: email + scores only
- Client documents stay in client-controlled Secure Drive (Proton), not this site

## Cloudflare (dashboard)

1. SSL/TLS: Full (strict)
2. Always Use HTTPS: On
3. Min TLS: 1.2
4. Bot Fight Mode: On
5. WAF managed rules: On
6. Rate limits: see CLOUDFLARE_RATE_LIMITS.md

## After HTML edits with inline script/style

Optional stricter CSP:
```bash
python3 gen_csp.py
```
Only if you will run it after every future inline edit.
