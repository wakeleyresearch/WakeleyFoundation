# Wakeley Foundation

Public website for Wakeley Foundation, built with SvelteKit and prepared for Render hosting at `wakeleyfoundation.com`.

## Stack

- SvelteKit, TypeScript, Tailwind CSS
- Render Web Service and `@sveltejs/adapter-node`
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

Create these in the Render environment group `fdnvars`, which is linked from `render.yaml`. For local development, copy `.env.example` to `.env` and fill values there.

```text
PUBLIC_TURNSTILE_SITE_KEY=
TURNSTILE_SECRET_KEY=
RESEND_API_KEY=
CONTACT_TO_EMAIL=
CONTACT_FROM_EMAIL=
```

The site does not use accounts, sessions, or a database. Contact submissions are validated server-side and sent by email only.

## Render

- Service type: Web Service
- Runtime: Node
- Build command: `npm ci && npm run build`
- Start command: `npm start`
- Node.js: `22`
- Blueprint: `render.yaml`
- Custom domain: `wakeleyfoundation.com`

Keep DNS for `wakeleyfoundation.com` in Cloudflare and point it to the Render custom-domain target Render provides. The Blueprint links the `fdnvars` environment group, so keep Turnstile, Resend, and contact email values there instead of committing them.

## Third-Party Notices

See `THIRD_PARTY_NOTICES.md` for the Svelte Bits and React Bits license notes.
