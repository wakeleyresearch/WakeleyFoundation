# Wakeley Foundation

Public website for Wakeley Foundation, built with SvelteKit and prepared for Vercel hosting with `www.wakeleyfoundation.org` as the intended primary domain.

## Stack

- SvelteKit, TypeScript, Tailwind CSS
- Vercel and `@sveltejs/adapter-vercel`
- Svelte Bits-inspired `Grainient` WebGL landing background
- Contact form protected with Cloudflare Turnstile and delivered through Resend

## Local Development

```powershell
npm install
npm run dev
```

Useful checks:

```powershell
npm run check
npm run lint
npm run build
```

## Content Editing

Most editable landing-page text lives in `src/lib/content/site.ts`. Update the mission, focus-area, impact, and footer copy there as foundation content evolves.

## Environment Variables

Create these in the Vercel project environment. For local development, copy `.env.example` to `.env` and fill values there.

```text
PUBLIC_TURNSTILE_SITE_KEY=
TURNSTILE_SECRET_KEY=
RESEND_API_KEY=
CONTACT_TO_EMAIL=
CONTACT_FROM_EMAIL=
```

The site does not use accounts, sessions, or a database. Contact submissions are validated server-side and sent by email only.

## Vercel

- Framework: SvelteKit
- Runtime: Node.js `22`
- Build command: `npm run build`
- Target primary domain: `www.wakeleyfoundation.org`
- Fallback domain: `wakeleyfoundation.com` -> `https://www.wakeleyfoundation.org`

See `DEPLOY.md` for the Cloudflare DNS + Vercel custom-domain runbook. Keep Turnstile, Resend, and contact email values in Vercel environment variables instead of committing them.

## Third-Party Notices

See `THIRD_PARTY_NOTICES.md` for the Svelte Bits and React Bits license notes.
