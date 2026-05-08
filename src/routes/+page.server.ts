import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad, RequestEvent } from './$types';
import { getRuntimeEnv } from '$lib/server/env';
import { site } from '$lib/content/site';

type ContactValues = {
  name: string;
  email: string;
  organization: string;
  message: string;
};

type ContactErrors = Partial<Record<keyof ContactValues | 'turnstile' | 'form', string>>;

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function valueOf(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === 'string' ? value.trim() : '';
}

function validate(values: ContactValues) {
  const errors: ContactErrors = {};

  if (values.name.length < 2) errors.name = 'Please enter your name.';
  if (!emailPattern.test(values.email)) errors.email = 'Please enter a valid email address.';
  if (values.organization.length > 120) errors.organization = 'Organization must be 120 characters or fewer.';
  if (values.message.length < 20) errors.message = 'Please include at least 20 characters.';
  if (values.message.length > 2500) errors.message = 'Message must be 2,500 characters or fewer.';

  return errors;
}

function getEnv(event: RequestEvent, name: string) {
  return getRuntimeEnv(event.platform, name);
}

async function verifyTurnstile(event: RequestEvent, token: string) {
  const secret = getEnv(event, 'TURNSTILE_SECRET_KEY');
  if (!secret || !token) return false;

  const formData = new FormData();
  formData.append('secret', secret);
  formData.append('response', token);

  const remoteIp = event.request.headers.get('CF-Connecting-IP');
  if (remoteIp) formData.append('remoteip', remoteIp);

  const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    body: formData
  });

  if (!response.ok) return false;

  const result = (await response.json()) as { success?: boolean };
  return result.success === true;
}

async function sendContactEmail(event: RequestEvent, values: ContactValues) {
  const apiKey = getEnv(event, 'RESEND_API_KEY');
  const to = getEnv(event, 'CONTACT_TO_EMAIL');
  const from = getEnv(event, 'CONTACT_FROM_EMAIL');

  if (!apiKey || !to || !from) {
    return { ok: false, status: 503 };
  }

  const lines = [
    `Name: ${values.name}`,
    `Email: ${values.email}`,
    `Organization: ${values.organization || 'Not provided'}`,
    '',
    values.message
  ];

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: values.email,
      subject: `Wakeley Foundation contact from ${values.name}`,
      text: lines.join('\n')
    })
  });

  return { ok: response.ok, status: response.status };
}

export const load: PageServerLoad = async (event) => {
  const turnstileSiteKey = getEnv(event, 'PUBLIC_TURNSTILE_SITE_KEY') ?? '';

  return {
    turnstileSiteKey,
    contactConfigured: turnstileSiteKey.length > 0,
    meta: {
      title: site.name,
      description: site.description,
      url: site.url
    }
  };
};

export const actions: Actions = {
  contact: async (event) => {
    const formData = await event.request.formData();
    const values: ContactValues = {
      name: valueOf(formData, 'name'),
      email: valueOf(formData, 'email'),
      organization: valueOf(formData, 'organization'),
      message: valueOf(formData, 'message')
    };
    const honeypot = valueOf(formData, 'website');
    const turnstileToken = valueOf(formData, 'cf-turnstile-response');

    if (honeypot) {
      return {
        success: true,
        message: 'Thanks. Your message has been received.'
      };
    }

    const errors = validate(values);
    if (Object.keys(errors).length > 0) {
      return fail(400, { values, errors });
    }

    const turnstileOk = await verifyTurnstile(event, turnstileToken);
    if (!turnstileOk) {
      return fail(400, {
        values,
        errors: {
          turnstile: 'Please complete the verification challenge.'
        } satisfies ContactErrors
      });
    }

    const emailResult = await sendContactEmail(event, values);
    if (!emailResult.ok) {
      return fail(emailResult.status === 503 ? 503 : 502, {
        values,
        errors: {
          form:
            emailResult.status === 503
              ? 'The contact form is not fully configured yet.'
              : 'The message could not be sent right now. Please try again later.'
        } satisfies ContactErrors
      });
    }

    return {
      success: true,
      message: 'Thanks. Your message has been sent.'
    };
  }
};
