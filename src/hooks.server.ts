import type { Handle } from '@sveltejs/kit';

const productionHost = 'wakeleyfoundation.com';

function buildCsp(isDev: boolean) {
  const scriptSrc = ["'self'", "'unsafe-inline'", 'https://challenges.cloudflare.com'];
  const connectSrc = ["'self'", 'https://challenges.cloudflare.com'];

  if (isDev) {
    scriptSrc.push("'unsafe-eval'");
    connectSrc.push('ws://localhost:*', 'ws://127.0.0.1:*', 'http://localhost:*', 'http://127.0.0.1:*');
  }

  return [
    "default-src 'self'",
    "base-uri 'self'",
    "object-src 'none'",
    "frame-ancestors 'none'",
    "form-action 'self'",
    "img-src 'self' data: blob:",
    "font-src 'self' data:",
    "style-src 'self' 'unsafe-inline'",
    `script-src ${scriptSrc.join(' ')}`,
    'frame-src https://challenges.cloudflare.com',
    `connect-src ${connectSrc.join(' ')}`,
    "worker-src 'self' blob:",
    'upgrade-insecure-requests'
  ].join('; ');
}

export const handle: Handle = async ({ event, resolve }) => {
  if (event.url.hostname === `www.${productionHost}`) {
    const canonicalUrl = new URL(event.url);
    canonicalUrl.hostname = productionHost;

    return new Response(null, {
      status: 308,
      headers: {
        location: canonicalUrl.toString()
      }
    });
  }

  const response = await resolve(event);
  const isDev = event.url.hostname === 'localhost' || event.url.hostname === '127.0.0.1';

  response.headers.set('Content-Security-Policy', buildCsp(isDev));
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()'
  );
  response.headers.set('Cross-Origin-Opener-Policy', 'same-origin');

  if (event.url.protocol === 'https:') {
    response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  }

  return response;
};
