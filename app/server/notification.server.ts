import bcryptjs from 'bcryptjs';
import { redirect } from '@remix-run/node';
import { Resend } from 'resend';

import { db } from './db.server';
import { serverError } from './request.server';
import { DEFAULT_REDIRECT_URL } from '~/utils/constants';
import { ResetPasswordEmailTemplate } from '~/components/email/ResetPassword';

const resend = new Resend(process.env.RESEND_API_KEY);

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
  try {
    await resend.emails.send({
      from: 'Teo Fumagalli<noreply@recipes.fumagalli.ar>',
      to: user.email,
      subject: 'Your one-time reset code',
      html: `<div>${oneTimeCode}</div>`,
      react:
        ResetPasswordEmailTemplate({ resetCode: oneTimeCode }) ?? undefined,
    });

    const obfuscatedEmail = user.email.replace(
      /^(.{2})(.+)@/,
      (match, p1: string, p2: string) => `${p1}${p2.replace(/./g, '*')}@`,
    );

    return redirect(
      `/resetPassword?username=${user.username}&redirectUrl=${redirectUrl}&email=${obfuscatedEmail}`,
    );
  } catch (error) {
    throw serverError({
      message: 'Failed to send email: API error',
      details: error,
    });
  }
};
