# Deployment Runbook

This document covers cutting `wakeleyfoundation.com` over to Render with DNS in Cloudflare.

One thing to keep in mind throughout: the `www` → apex redirect is implemented in app code (`src/hooks.server.ts`), not in DNS or a Cloudflare page rule. DNS must therefore resolve **both** the apex and `www` to Render — otherwise the redirect can't fire — and you must not stack a Cloudflare redirect rule on top of it.

The app also sends `Strict-Transport-Security: max-age=31536000`. Once a browser loads the site over HTTPS, it will refuse plain HTTP for a year, so any DNS or proxy mistake that breaks TLS is sticky. Take it in order.

## Step 0 — Add the zone to Cloudflare (if not already done)

Skip if `wakeleyfoundation.com` already shows as Active in your Cloudflare dashboard.

In the Cloudflare onboarding wizard:

- **Import DNS records** — accept. Cloudflare scans the domain's current authoritative nameservers and imports whatever exists (MX, TXT, etc.) so any existing services keep working. Harmless if nothing is found.
- **Proxy imported DNS records** — disable (set everything to **DNS only** / gray cloud). The `@` and `www` records we add in step 2 must be DNS-only so Render's Let's Encrypt HTTP-01 challenge can succeed. Per-record proxy state can be flipped later. MX records should stay DNS-only regardless; Cloudflare won't proxy email anyway.

Then update the registrar to use the two Cloudflare nameservers Cloudflare shows you. Wait for the zone status to flip to **Active** before continuing.

## Step 1 — Add the custom domain in Render

In the Render dashboard for the `wakeley-foundation` service: **Settings → Custom Domains → Add Custom Domain**. Add both, one at a time:

- `wakeleyfoundation.com`
- `www.wakeleyfoundation.com`

For each, Render shows the DNS target you need to point at it. The shape depends on the record type:

- **Apex** (`wakeleyfoundation.com`): Render gives either a small set of A-record IPs *or* a single CNAME-flattening hostname (e.g. `<service>.onrender.com`).
- **`www`**: always a CNAME target (e.g. `<service>.onrender.com`).

Copy these values. Render's verification will fail until step 2 is done, which is expected.

## Step 2 — Add the records in Cloudflare

The intended zone state lives in `wakeleyfoundation.com.zone` at the repo root — it's a BIND-format file that can be uploaded via **Cloudflare dashboard → DNS → Records → Import and Export → Import DNS records**. The Render apex and `www` CNAMEs are tagged `cf_tags=cf-proxied:false` so they import as DNS-only. Edit the file before importing if you also want the suggested SPF / DMARC / Resend records at the bottom of the file.

To add records by hand instead, in **Cloudflare dashboard → zone `wakeleyfoundation.com` → DNS → Records**:

**Apex `@`** — use whichever shape Render gave you:

A records (one row per IP Render listed):

| Type | Name | Content         | Proxy    | TTL  |
| ---- | ---- | --------------- | -------- | ---- |
| A    | `@`  | `<Render IP 1>` | DNS only | Auto |
| A    | `@`  | `<Render IP 2>` | DNS only | Auto |

…or a single CNAME (Cloudflare flattens apex CNAMEs automatically):

| Type  | Name | Content                            | Proxy    | TTL  |
| ----- | ---- | ---------------------------------- | -------- | ---- |
| CNAME | `@`  | `<hostname Render gave>`           | DNS only | Auto |

**`www`**:

| Type  | Name  | Content                            | Proxy    | TTL  |
| ----- | ----- | ---------------------------------- | -------- | ---- |
| CNAME | `www` | `<hostname Render gave>`           | DNS only | Auto |

Leave any imported MX/TXT/email records alone — they're unrelated.

## Step 3 — Wait for verification and certificate issuance

Cloudflare propagates within a minute or two. Back in Render's Custom Domains UI, both entries should turn green ("Verified") and Render will issue Let's Encrypt certificates automatically.

Keep proxy = DNS only for now. Cloudflare's proxy intercepts Let's Encrypt's HTTP-01 challenge and cert issuance will fail otherwise.

## Step 4 — (Optional) Enable Cloudflare proxy

After certs are issued, the `@` and `www` records can be flipped to **Proxied** (orange cloud) to add caching and DDoS protection. If you do:

1. **SSL/TLS → Overview**: set mode to **Full (strict)**. Anything less either breaks TLS or causes a redirect loop with HSTS.
2. **SSL/TLS → Edge Certificates**: leave **Always Use HTTPS** on. (HSTS is already enforced by the app at 1y, so this is belt-and-suspenders.)
3. Do **not** add a Cloudflare page rule or redirect rule for `www → apex`. The 308 is already emitted by `src/hooks.server.ts`; stacking redirects creates a chain.

## Step 5 — Verify

```powershell
nslookup wakeleyfoundation.com
nslookup www.wakeleyfoundation.com
curl.exe -I https://wakeleyfoundation.com
curl.exe -I https://www.wakeleyfoundation.com
```

Expected:

- Apex: `HTTP/2 200`, with the strict CSP and HSTS headers from `hooks.server.ts`.
- `www`: `HTTP/2 308` with `location: https://wakeleyfoundation.com/`.

## Environment variables

The contact form needs these set in the Render environment group `fdnvars` (linked from `render.yaml`). Without them the form intentionally renders a "not yet configured" state instead of submitting:

- `PUBLIC_TURNSTILE_SITE_KEY`
- `TURNSTILE_SECRET_KEY`
- `RESEND_API_KEY`
- `CONTACT_TO_EMAIL`
- `CONTACT_FROM_EMAIL`

See `.env.example` for the local-development copy.
