<script lang="ts">
  import { resolve } from '$app/paths';
  import { site } from '$lib/content/site';
</script>

<svelte:head>
  <title>Privacy | {site.name}</title>
  <meta
    name="description"
    content="Privacy information for Wakeley Foundation's public website and contact form."
  />
  <link rel="canonical" href={`${site.url}/privacy`} />
</svelte:head>

<main class="min-h-screen bg-[#FAFAFA] px-5 py-8 text-[#1E1E1E] sm:px-8 lg:px-10">
  <div class="mx-auto max-w-3xl">
    <a class="text-sm font-semibold text-[#6E7882] transition hover:text-[#1E1E1E]" href={resolve('/')}>Wakeley Foundation</a>
    <h1 class="mt-10 font-[var(--font-display)] text-5xl font-semibold leading-tight">Privacy</h1>

    <div class="mt-8 space-y-7 text-lg leading-8 text-[#3D454D]">
      <p>
        Wakeley Foundation's website is a public informational site. It does not provide user accounts,
        logins, or store visitor profiles.
      </p>
      <p>
        Wakeley Foundation does not use cookies, analytics pixels, advertising trackers, telemetry tools,
        or behavioral analytics to monitor visitors on this site.
      </p>
      <p>
        If you use the contact form, the information you submit is validated server-side and sent by email
        to Wakeley Foundation. The site does not write contact submissions to a database.
      </p>
      <p>
        The contact form uses Cloudflare Turnstile to reduce automated abuse and Resend to deliver email.
        Cloudflare may process verification signals, and Resend processes the message content needed to
        deliver your email.
      </p>
      <p>
        Standard hosting and security logs may be processed by Cloudflare to operate, secure, and debug the
        site.
      </p>
    </div>
  </div>
</main>
