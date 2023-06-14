import bcryptjs from 'bcryptjs';

import { fetch, redirect } from '@remix-run/node';
import { db } from './db.server';
import { serverError } from './request.server';
import { DEFAULT_REDIRECT_URL } from '~/utils/constants';

function pickRandom<T>(arr: T[]) {
  const randomIndex = Math.floor(Math.random() * arr.length);
  return arr[randomIndex];
}

const lettersAndNumbers = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'.split('');

function generateOneTimeCode() {
  return Array.from(Array(6), () => pickRandom(lettersAndNumbers)).join('');
}

export const sendRecoveryEmail = async (
  usernameOrEmail: string,
  redirectUrl = DEFAULT_REDIRECT_URL,
) => {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) throw new Error('Missing envvar BREVO_API_KEY');

  // First, find the user by email or username
  const user = await db.user.findFirst({
    where: { OR: [{ username: usernameOrEmail }, { email: usernameOrEmail }] },
  });
  if (!user) throw { usernameOrEmail: 'forgot:forgot.errors.user-not-found' };

  // Next, generate a one-time code, hash and store it in the database
  const oneTimeCode = generateOneTimeCode();
  const codeHash = await bcryptjs.hash(oneTimeCode, 10);

  // If a code for this username already exists, overwrite it
  await db.recovery.upsert({
    create: {
      username: user.username,
      oneTimeCodeHash: codeHash,
    },
    update: {
      oneTimeCodeHash: codeHash,
    },
    where: { username: user.username },
  });

  // Finally, send the email
  const headers = new Headers();
  headers.append('accept', 'application/json');
  headers.append('api-key', apiKey);
  headers.append('content-type', 'application/json');

  const res = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers,
    body: JSON.stringify({
      sender: {
        name: 'Test email',
        email: 'no-reply@fumagalli.ar',
      },
      to: [
        {
          name: user.displayName,
          email: user.email,
        },
      ],
      templateId: 1,
      params: { CODE: oneTimeCode },
    }),
  });

  if (!res.ok) {
    throw serverError({
      message: 'Failed to send email: API error',
      details: await res.json(),
    });
  }

  const obfuscatedEmail = user.email.replace(
    /^(.{2})(.+)@/,
    (match, p1: string, p2: string) => `${p1}${p2.replace(/./g, '*')}@`,
  );

  return redirect(
    `/resetPassword?username=${user.username}&redirectUrl=${redirectUrl}&email=${obfuscatedEmail}`,
  );
};
