# Deployment Runbook

This document covers cutting `wakeleyfoundation.org` over to Vercel with DNS in Cloudflare, with `wakeleyfoundation.com` retained as a fallback domain that redirects to `.org`.

One thing to keep in mind throughout: the apex `.org` domain and both `.com` hosts redirect to `https://www.wakeleyfoundation.org` in app code (`src/hooks.server.ts`), not in DNS or a Cloudflare page rule. DNS must therefore resolve the `.org` apex and `www` to Vercel, and you must not stack a Cloudflare redirect rule on top of it.

The app also sends `Strict-Transport-Security: max-age=31536000`. Once a browser loads the site over HTTPS, it will refuse plain HTTP for a year, so any DNS or proxy mistake that breaks TLS is sticky. Take it in order.

## Step 0 — Add the zone to Cloudflare (if not already done)

Skip if `wakeleyfoundation.org` already shows as Active in your Cloudflare dashboard.

In the Cloudflare onboarding wizard:

- **Import DNS records** — accept. Cloudflare scans the domain's current authoritative nameservers and imports whatever exists (MX, TXT, etc.) so any existing services keep working. Harmless if nothing is found.
- **Proxy imported DNS records** — disable (set everything to **DNS only** / gray cloud). The `@` and `www` records we add in step 2 should stay DNS-only until Vercel verifies the domain and provisions certificates. MX records should stay DNS-only regardless; Cloudflare won't proxy email anyway.

Then update the registrar to use the two Cloudflare nameservers Cloudflare shows you. Wait for the zone status to flip to **Active** before continuing.

## Step 1 — Add the custom domains in Vercel

In the Vercel project dashboard: **Settings -> Domains**. Add both, one at a time:

- `wakeleyfoundation.org`
- `www.wakeleyfoundation.org`
- `wakeleyfoundation.com`
- `www.wakeleyfoundation.com`

Vercel should accept the common records used in this repo:

- **Apex** (`wakeleyfoundation.org`): `A 76.76.21.21`
- **`www`** (`www.wakeleyfoundation.org`): `A 76.76.21.21`
- Keep `.com` assigned to the same Vercel project so it can act as a redirecting fallback.

Vercel verification will fail until step 2 is done, which is expected.

## Step 2 — Add the records in Cloudflare

The intended zone state for `.org` lives in `wakeleyfoundation.org.zone` at the repo root — it's a BIND-format file that can be uploaded via **Cloudflare dashboard -> DNS -> Records -> Import and Export -> Import DNS records**. Edit the file before importing if you also want additional provider-specific verification records.

To add records by hand instead, in **Cloudflare dashboard → zone `wakeleyfoundation.org` → DNS → Records**:

**Apex `@`**:

| Type | Name | Content         | Proxy    | TTL  |
| ---- | ---- | --------------- | -------- | ---- |
| A    | `@`  | `76.76.21.21` | DNS only | Auto |

**`www`**:

| Type  | Name  | Content                            | Proxy    | TTL  |
| ----- | ----- | ---------------------------------- | -------- | ---- |
| A     | `www` | `76.76.21.21`                      | DNS only | Auto |

Mirror any required MX/TXT mail records intentionally. DKIM and verification records are domain-specific and should be reissued for `.org` where needed.

## Step 3 — Wait for verification and certificate issuance

Cloudflare propagates within a minute or two. Back in Vercel's Domains UI, the `.org` entries should turn green ("Valid Configuration") and Vercel will issue certificates automatically.

Keep proxy = DNS only for now until Vercel reports the domains as ready.

## Step 4 — Deploy the `.org`-primary app behavior

Only after the `.org` zone is active in Cloudflare and the `.org` domains validate in Vercel should you deploy the app version that redirects `.com` to `.org`. Deploying that code earlier would send current `.com` traffic to an `.org` hostname that is not yet live.

## Step 5 — (Optional) Enable Cloudflare proxy

After certs are issued, the `@` and `www` records can be flipped to **Proxied** (orange cloud) to add caching and DDoS protection. If you do:

1. **SSL/TLS → Overview**: set mode to **Full (strict)**. Anything less either breaks TLS or causes a redirect loop with HSTS.
2. **SSL/TLS → Edge Certificates**: leave **Always Use HTTPS** on. (HSTS is already enforced by the app at 1y, so this is belt-and-suspenders.)
3. Do **not** add a Cloudflare page rule or redirect rule for `apex -> www`. The 308 is already emitted by `src/hooks.server.ts`; stacking redirects creates a chain.

## Step 6 — Verify

```powershell
nslookup wakeleyfoundation.org
nslookup www.wakeleyfoundation.org
nslookup wakeleyfoundation.com
nslookup www.wakeleyfoundation.com
curl.exe -I https://wakeleyfoundation.org
curl.exe -I https://www.wakeleyfoundation.org
curl.exe -I https://wakeleyfoundation.com
curl.exe -I https://www.wakeleyfoundation.com
```

Expected:

- `.org` apex: `HTTP/2 308` with `location: https://www.wakeleyfoundation.org/`.
- `.org` `www`: `HTTP/2 200`, with the strict CSP and HSTS headers from `hooks.server.ts`.
- both `.com` hosts: `HTTP/2 308` to `https://www.wakeleyfoundation.org/`.

## Environment variables

The contact form needs these set in the Vercel project environment. Without them the form intentionally renders a "not yet configured" state instead of submitting:

- `PUBLIC_TURNSTILE_SITE_KEY`
- `TURNSTILE_SECRET_KEY`
- `RESEND_API_KEY`
- `CONTACT_TO_EMAIL`
- `CONTACT_FROM_EMAIL`

See `.env.example` for the local-development copy.
