<script lang="ts">
  import { enhance } from '$app/forms';
  import { resolve } from '$app/paths';
  import Grainient from '$lib/components/Grainient.svelte';
  import { palette, site } from '$lib/content/site';
  import type { ActionData, PageData } from './$types';

  let { data, form }: { data: PageData; form: ActionData } = $props();

  const currentYear = new Date().getFullYear();
  const errors = $derived((form?.errors ?? {}) as Record<string, string | undefined>);
  const values = $derived((form?.values ?? {}) as Record<string, string | undefined>);
</script>

<svelte:head>
  <title>{data.meta.title}</title>
  <meta name="description" content={data.meta.description} />
  <meta property="og:title" content={data.meta.title} />
  <meta property="og:description" content={data.meta.description} />
  <meta property="og:url" content={data.meta.url} />
  <meta property="og:type" content="website" />
  <meta property="og:image" content="/wakeley-logo.webp" />
  <link rel="canonical" href={data.meta.url} />
  {#if data.turnstileSiteKey}
    <script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script>
  {/if}
</svelte:head>

<main class="min-h-screen bg-[#FAFAFA] text-[#1E1E1E]">
  <section class="grainient-fallback relative min-h-[86svh] overflow-hidden text-[#FAFAFA]">
    <div class="absolute inset-0 opacity-95">
      <Grainient
        color1={palette.slateBlueGrey}
        color2={palette.warmSand}
        color3={palette.mutedTerracotta}
        grainAmount={0.09}
        saturation={0.86}
        timeSpeed={0.42}
        warpSpeed={1.65}
        warpStrength={1}
      />
    </div>
    <div class="absolute inset-0 bg-[linear-gradient(90deg,rgba(30,30,30,0.78),rgba(30,30,30,0.42)_48%,rgba(61,69,77,0.18))]"></div>

    <header class="relative z-10 mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-5 sm:px-8 lg:px-10">
      <a class="flex items-center gap-3" href={resolve('/')} aria-label="Wakeley Foundation home">
        <img
          class="h-12 w-auto opacity-95 drop-shadow-[0_8px_18px_rgba(30,30,30,0.22)] sm:h-14"
          src="/wakeley-logo.webp"
          alt=""
          width="94"
          height="96"
        />
        <span class="brand-wordmark text-white/90">Wakeley Foundation</span>
      </a>
      <nav class="hidden items-center gap-6 text-sm font-medium text-white/82 sm:flex" aria-label="Primary navigation">
        {#each site.nav as item (item.href)}
          <a class="transition hover:text-white" href={resolve(`/${item.href}`)}>{item.label}</a>
        {/each}
      </nav>
    </header>

    <div class="relative z-10 mx-auto grid min-h-[calc(86svh-88px)] w-full max-w-7xl items-center gap-10 px-5 pb-14 pt-10 sm:px-8 lg:grid-cols-[1fr_360px] lg:px-10">
      <div class="max-w-3xl">
        <p class="mb-5 text-sm font-semibold uppercase tracking-[0.18em] text-[#D9CDB8]">{site.hero.eyebrow}</p>
        <h1 class="hero-title max-w-4xl text-6xl leading-[0.95] text-white [text-shadow:0_4px_22px_rgba(30,30,30,0.18)] sm:text-8xl lg:text-[7.5rem]">
          {site.hero.title}
        </h1>
        <p class="mt-7 max-w-2xl text-lg leading-8 text-white/84 sm:text-xl">
          {site.hero.deck}
        </p>
        <div class="mt-9 flex flex-col gap-3 sm:flex-row">
          <a
            class="inline-flex min-h-12 items-center justify-center border border-[#FAFAFA] bg-[#FAFAFA] px-6 text-sm font-semibold text-[#1E1E1E] transition hover:bg-[#EDEEF0] focus:outline-none focus:ring-2 focus:ring-[#FAFAFA] focus:ring-offset-2 focus:ring-offset-[#3D454D]"
            href={resolve(`/${site.hero.primaryCta.href}`)}
            style="color: #1E1E1E;"
          >
            {site.hero.primaryCta.label}
          </a>
          <a
            class="inline-flex min-h-12 items-center justify-center border border-white/35 px-6 text-sm font-semibold text-white transition hover:border-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-[#FAFAFA] focus:ring-offset-2 focus:ring-offset-[#3D454D]"
            href={resolve(`/${site.hero.secondaryCta.href}`)}
          >
            {site.hero.secondaryCta.label}
          </a>
        </div>
      </div>

      <div class="hidden justify-self-end lg:block">
        <img
          class="w-72 opacity-95 drop-shadow-[0_20px_58px_rgba(30,30,30,0.28)]"
          src="/wakeley-logo.webp"
          alt="Wakeley Foundation W logo"
          width="942"
          height="960"
        />
      </div>
    </div>
  </section>

  <section id="mission" class="border-b border-[#D9CDB8]/70 bg-[#FAFAFA] px-5 py-20 sm:px-8 lg:px-10">
    <div class="mx-auto max-w-7xl">
      <div class="max-w-4xl">
        <p class="section-eyebrow text-[#B87E68]">{site.mission.eyebrow}</p>
        <h2 class="mt-4 max-w-4xl font-[var(--font-display)] text-4xl font-semibold leading-tight text-[#1E1E1E] sm:text-5xl">
          {site.mission.title}
        </h2>
        <p class="mt-6 max-w-3xl text-lg leading-8 text-[#3D454D]">{site.mission.body}</p>
      </div>
    </div>
  </section>

  <section id="focus" class="bg-[#EDEEF0] px-5 py-20 sm:px-8 lg:px-10">
    <div class="mx-auto max-w-7xl">
      <div class="mb-10">
        <div>
          <p class="section-eyebrow text-[#6E7882]">{site.focus.eyebrow}</p>
          <h2 class="mt-3 max-w-2xl font-[var(--font-display)] text-4xl font-semibold leading-tight text-[#1E1E1E]">
            {site.focus.title}
          </h2>
        </div>
      </div>

      <div class="grid gap-4 md:grid-cols-3">
        {#each site.focusAreas as area (area.title)}
          <article class="min-h-[13rem] border border-[#D9CDB8] bg-[#FAFAFA] p-6">
            <h3 class="font-[var(--font-display)] text-2xl font-semibold text-[#1E1E1E]">{area.title}</h3>
            <p class="mt-4 leading-7 text-[#3D454D]">{area.body}</p>
          </article>
        {/each}
      </div>
    </div>
  </section>

  <section class="bg-[#3D454D] px-5 py-20 text-[#FAFAFA] sm:px-8 lg:px-10">
    <div class="mx-auto max-w-7xl">
      <div class="max-w-4xl">
        <p class="section-eyebrow text-[#D9CDB8]">{site.model.eyebrow}</p>
        <h2 class="mt-4 max-w-4xl font-[var(--font-display)] text-4xl font-semibold leading-tight sm:text-5xl">
          {site.model.title}
        </h2>
        <p class="mt-6 max-w-3xl text-lg leading-8 text-white/78">{site.model.body}</p>
      </div>

      <div class="mt-12 grid gap-4 md:grid-cols-3">
        {#each site.model.principles as principle (principle.title)}
          <article class="min-h-[13rem] border border-white/16 bg-white/[0.04] p-6">
            <h3 class="font-[var(--font-display)] text-2xl font-semibold text-white">{principle.title}</h3>
            <p class="mt-4 leading-7 text-white/72">{principle.body}</p>
          </article>
        {/each}
      </div>
    </div>
  </section>

  <section class="bg-[#D9CDB8] px-5 py-20 text-[#1E1E1E] sm:px-8 lg:px-10">
    <div class="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
      <div>
        <p class="text-sm font-semibold uppercase tracking-[0.18em] text-[#6E7882]">{site.impact.eyebrow}</p>
        <p class="mt-4 font-[var(--font-display)] text-7xl font-semibold leading-none text-[#3D454D] sm:text-8xl">
          {site.impact.metric}
        </p>
      </div>
      <div>
        <h2 class="max-w-3xl font-[var(--font-display)] text-4xl font-semibold leading-tight sm:text-5xl">
          {site.impact.title}
        </h2>
        <p class="mt-6 max-w-3xl text-lg leading-8 text-[#3D454D]">{site.impact.body}</p>
      </div>
    </div>
  </section>

  <section id="contact" class="bg-[#FAFAFA] px-5 py-20 sm:px-8 lg:px-10">
    <div class="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.8fr_1.2fr]">
      <div>
        <p class="section-eyebrow text-[#B87E68]">{site.contact.eyebrow}</p>
        <h2 class="mt-4 max-w-md font-[var(--font-display)] text-4xl font-semibold leading-tight text-[#1E1E1E]">
          {site.contact.title}
        </h2>
        <p class="mt-5 max-w-md text-lg leading-8 text-[#3D454D]">{site.contact.body}</p>
      </div>

      <form
        class="grid gap-5 border border-[#D9CDB8] bg-[#EDEEF0] p-5 sm:p-7"
        method="POST"
        action="?/contact"
        use:enhance
      >
        {#if form?.success}
          <div class="border border-[#6E7882]/25 bg-[#FAFAFA] px-4 py-3 text-sm font-medium text-[#3D454D]">
            {form.message}
          </div>
        {/if}
        {#if errors.form}
          <div class="border border-[#B87E68]/45 bg-[#FAFAFA] px-4 py-3 text-sm font-medium text-[#1E1E1E]">
            {errors.form}
          </div>
        {/if}

        <div class="grid gap-5 md:grid-cols-2">
          <label class="grid gap-2 text-sm font-semibold text-[#1E1E1E]">
            Name
            <input
              class="min-h-12 border border-[#6E7882]/35 bg-[#FAFAFA] px-4 text-base outline-none transition focus:border-[#B87E68] focus:ring-2 focus:ring-[#B87E68]/25"
              name="name"
              autocomplete="name"
              value={values.name ?? ''}
              required
            />
            {#if errors.name}<span class="text-sm font-medium text-[#8F4F3E]">{errors.name}</span>{/if}
          </label>

          <label class="grid gap-2 text-sm font-semibold text-[#1E1E1E]">
            Email
            <input
              class="min-h-12 border border-[#6E7882]/35 bg-[#FAFAFA] px-4 text-base outline-none transition focus:border-[#B87E68] focus:ring-2 focus:ring-[#B87E68]/25"
              name="email"
              type="email"
              autocomplete="email"
              value={values.email ?? ''}
              required
            />
            {#if errors.email}<span class="text-sm font-medium text-[#8F4F3E]">{errors.email}</span>{/if}
          </label>
        </div>

        <label class="grid gap-2 text-sm font-semibold text-[#1E1E1E]">
          Organization
          <input
            class="min-h-12 border border-[#6E7882]/35 bg-[#FAFAFA] px-4 text-base outline-none transition focus:border-[#B87E68] focus:ring-2 focus:ring-[#B87E68]/25"
            name="organization"
            autocomplete="organization"
            value={values.organization ?? ''}
          />
          {#if errors.organization}
            <span class="text-sm font-medium text-[#8F4F3E]">{errors.organization}</span>
          {/if}
        </label>

        <label class="grid gap-2 text-sm font-semibold text-[#1E1E1E]">
          Message
          <textarea
            class="min-h-44 resize-y border border-[#6E7882]/35 bg-[#FAFAFA] px-4 py-3 text-base outline-none transition focus:border-[#B87E68] focus:ring-2 focus:ring-[#B87E68]/25"
            name="message"
            required
          >{values.message ?? ''}</textarea>
          {#if errors.message}<span class="text-sm font-medium text-[#8F4F3E]">{errors.message}</span>{/if}
        </label>

        <label class="screen-reader-only">
          Website
          <input name="website" tabindex="-1" autocomplete="off" />
        </label>

        {#if data.turnstileSiteKey}
          <div class="cf-turnstile" data-sitekey={data.turnstileSiteKey} data-theme="light"></div>
        {:else}
          <p class="text-sm font-medium text-[#3D454D]">
            Contact verification is not configured in this environment.
          </p>
        {/if}
        {#if errors.turnstile}
          <span class="text-sm font-medium text-[#8F4F3E]">{errors.turnstile}</span>
        {/if}

        <button
          class="min-h-12 bg-[#1E1E1E] px-6 text-sm font-semibold text-[#FAFAFA] transition hover:bg-[#3D454D] focus:outline-none focus:ring-2 focus:ring-[#B87E68] focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-[#6E7882]"
          type="submit"
          disabled={!data.contactConfigured}
        >
          {site.contact.submitLabel}
        </button>
      </form>
    </div>
  </section>
</main>

<footer class="border-t border-[#D9CDB8] bg-[#1E1E1E] px-5 py-8 text-[#FAFAFA] sm:px-8 lg:px-10">
  <div class="mx-auto flex max-w-7xl flex-col gap-5 text-sm text-white/72 md:flex-row md:items-center md:justify-between">
    <p>&copy; {currentYear} Wakeley Foundation. {site.footer.note}</p>
    <div class="flex items-center gap-4">
      <a
        class="inline-flex h-5 w-5 items-center justify-center opacity-85 transition hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-[#D9CDB8] focus:ring-offset-2 focus:ring-offset-[#1E1E1E]"
        href="https://www.linkedin.com/showcase/wakeleyfdn/"
        target="_blank"
        rel="noopener noreferrer"
        referrerpolicy="no-referrer"
        aria-label="Wakeley Foundation on LinkedIn"
      >
        <img class="h-5 w-5" src="/linkedin.svg" alt="" width="20" height="20" />
      </a>
      <a class="font-semibold text-white transition hover:text-[#D9CDB8]" href={resolve('/privacy')}>Privacy</a>
    </div>
  </div>
</footer>
