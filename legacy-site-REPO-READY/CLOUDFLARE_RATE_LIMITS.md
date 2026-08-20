# Cloudflare rate limits — main site

Dashboard → Security → WAF / Rate limiting rules

## Rule 1 — Readiness Check

- Name: Readiness throttle
- Match: URI Path contains `/readiness` OR filename `readiness`
- Characteristics: IP
- Rate: 30 requests / 1 minute
- Action: Managed Challenge (or Block 5 minutes)

## Rule 2 — Make / form webhooks (if path known)

- Name: Webhook and form throttle
- Match: URI Path contains `hook` OR your Make/HubSpot callback path on this host
- Characteristics: IP
- Rate: 20 requests / 1 minute
- Action: Block 10 minutes

## Rule 3 — General burst

- Name: Site burst limit
- Match: All traffic on legacyarchitectrva.com
- Characteristics: IP
- Rate: 120 requests / 1 minute (tune to real traffic)
- Action: Managed Challenge

Confirm exact readiness submit URL in Network tab before finalizing Rule 1 paths.
