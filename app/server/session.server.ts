import bcryptjs from 'bcryptjs';

import { db } from './db.server';
import { createCookieSessionStorage, redirect } from '@remix-run/node';
import { DEFAULT_REDIRECT_URL, RESET_CODE_TTL } from '~/utils/constants';

interface SessionData {
  userId: string;
}

interface SessionFlashData {
  error: string;
}

const sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret) throw new Error('SESSION_SECRET envvar missing');

const storage = createCookieSessionStorage<SessionData, SessionFlashData>({
  cookie: {
    name: 'AppSession',
    httpOnly: true,
    // Safari doesn't like secure cookies on localhost...
    secure: process.env.NODE_ENV === 'production',
    secrets: [sessionSecret],
    path: '/',
    sameSite: 'lax',
    maxAge: 3600 * 24 * 30,
  },
});

const createUserSession = async (userId: string, redirectUrl: string) => {
  const session = await storage.getSession();
  session.set('userId', userId);

  return redirect(redirectUrl, {
    headers: {
      'Set-Cookie': await storage.commitSession(session),
    },
  });
};

const getUserSession = (request: Request) => {
  return storage.getSession(request.headers.get('Cookie'));
};

const getUserId = async (request: Request) => {
  const session = await getUserSession(request);
  const userId = session.get('userId');

  if (!userId || typeof userId !== 'string') return null;
  return userId;
};

/**
 * Require the user to be logged in. Redirects to login route if no session is
 * found.
 * @param request Request object
 * @param redirectUrl URL to redirect to after login, defaults to request URL
 * @returns `id` of the logged in user
 */
export const requireLogin = async (
  request: Request,
  redirectUrl = new URL(request.url).pathname,
) => {
  const userId = await getUserId(request);
  if (!userId) throw redirect(`/login?redirectUrl=${redirectUrl}`);

  return userId;
};

/**
 * Get the logged user information.
 * @param request Request object
 * @param require Require login. If no session is active, the function redirects
 * to login route if this parameter is `true`, otherwise it simply returns `null`.
 * @param redirectUrl URL to redirect to after login, defaults to request URL
 * @returns
 */
export const getUser = async (request: Request) => {
  const userId = await getUserId(request);
  if (!userId) return null;

  const user = await db.user.findUnique({ where: { id: userId } });
  if (!user) throw logout(request);

  return user;
};

/**
 * Get the logged user information.
 * @param request Request object
 * @param require Require login. If no session is active, the function redirects
 * to login route if this parameter is `true`, otherwise it simply returns `null`.
 * @param redirectUrl URL to redirect to after login, defaults to request URL
 * @returns
 */
export const requireUser = async (
  request: Request,
  redirectUrl = new URL(request.url).pathname,
) => {
  const userId = await getUserId(request);
  if (!userId) throw redirect(`/login?redirectUrl=${redirectUrl}`);

  const user = await db.user.findUnique({ where: { id: userId } });
  if (!user) throw logout(request);

  return user;
};

/**
 * Log in a user. Redirects afterwards, throws if login fails.
 * @param usernameOrEmail Username or Email
 * @param password Password
 * @param redirectUrl URL to redirect to after login, defaults to app home
 * @returns a redirect with Set-Cookie header for the user session
 */
export const login = async (
  usernameOrEmail: string,
  password: string,
  redirectUrl = DEFAULT_REDIRECT_URL,
) => {
  // First, find the user by email or username
  const user = await db.user.findFirst({
    select: { id: true, username: true },
    where: { OR: [{ username: usernameOrEmail }, { email: usernameOrEmail }] },
  });
  if (!user) throw { password: 'login:errors.bad-login' };

  // Then, query the auth table with the username to get the hashed password
  const auth = await db.auth.findUnique({
    where: { username: user.username },
  });
  if (!auth) throw { password: 'login:errors.auth-failed' };

  // Finally, compare the password
  const passwordMatch = await bcryptjs.compare(password, auth.passwordHash);
  if (!passwordMatch)
    throw { password: 'login:errors.bad-login' };

  return createUserSession(user.id, redirectUrl);
};

/**
 * Register a new user. Redirects with user logged in, throws if registration
 * fails. Fails if username or email already exist.
 * @param username Unique username
 * @param displayName Display name, not unique
 * @param email Email
 * @param password Password
 * @param redirectUrl URL to redirect to after register, defaults to app home
 * @returns a redirect with Set-Cookie header for the user session
 */
export const register = async (
  username: string,
  displayName: string,
  email: string,
  password: string,
  redirectUrl = DEFAULT_REDIRECT_URL,
) => {
  try {
    const usernameTaken =
      (await db.user.findFirst({ where: { username } })) !== null;
    if (usernameTaken) throw { username: 'register:errors.username-taken' };

    const emailTaken = (await db.user.findFirst({ where: { email } })) !== null;
    if (emailTaken) throw { email: 'register:errors.email-taken' };

    // Hash the password and create auth data
    const passwordHash = await bcryptjs.hash(password, 10);
    await db.auth.create({
      data: { username, passwordHash },
    });

    // Then create the actual user
    const user = await db.user.create({
      data: { username, displayName, email },
    });
    if (!user) throw { username: 'register:errors.register-failed' };

    return createUserSession(user.id, redirectUrl);
  } catch (err: unknown) {
    console.error(err);
    throw err;
  }
};

export const resetPassword = async (
  username: string,
  resetCode: string,
  newPassword: string,
  redirectUrl = DEFAULT_REDIRECT_URL,
) => {
  const user = await db.user.findUnique({
    select: { id: true },
    where: { username },
  });
  if (!user) throw new Error('User does not exist');

  // First, find the recovery code hash by username
  const recovery = await db.recovery.findUnique({ where: { username } });
  if (!recovery) throw { resetCode: 'forgot:reset.errors.not-found' };

  // If we found one, make sure it's not expired
  const age = Date.now() - recovery.updatedAt.valueOf();
  if (age > RESET_CODE_TTL) {
    // Delete it from the database, we don't need to keep expired codes around
    await db.recovery.delete({ where: { username } });
    throw { resetCode: 'forgot:reset.errors.expired' };
  }

  // Check if it's a match
  const codeMatch = await bcryptjs.compare(resetCode, recovery.oneTimeCodeHash);
  if (!codeMatch) throw { resetCode: 'forgot:reset.errors.no-match' };

  // The code matches: delete used code from db, reset password and login user
  await db.recovery.delete({ where: { username } });

  const passwordHash = await bcryptjs.hash(newPassword, 10);
  await db.auth.update({ where: { username }, data: { passwordHash } });

  return createUserSession(user.id, redirectUrl);
};

/**
 * Log out the user. Redirects to login route.
 * @param request Request object
 * @returns redirect to login page with Set-Cookie header to destroy session
 */
export const logout = async (request: Request, redirectUrl?: string) => {
  const session = await getUserSession(request);

  return redirect(redirectUrl ?? '/login', {
    headers: {
      'Set-Cookie': await storage.destroySession(session),
    },
  });
};
