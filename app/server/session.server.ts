import bcryptjs from 'bcryptjs';

import { db } from './db.server';
import { createCookieSessionStorage, redirect } from '@remix-run/node';

const DEFAULT_REDIRECT_URL = '/app/recipes';

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
    secure: true,
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
  if (!user) throw { password: 'Incorrect username/email or password' };

  // Then, query the auth table with the username to get the hashed password
  const auth = await db.auth.findUnique({
    where: { username: user.username },
  });
  if (!auth) throw { password: 'Authentication failed' };

  // Finally, compare the password
  const passwordMatch = await bcryptjs.compare(password, auth.passwordHash);
  if (!passwordMatch)
    throw { password: 'Incorrect username/email or password' };

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
  const usernameTaken =
    (await db.user.findFirst({ where: { username } })) !== null;
  if (usernameTaken) throw { username: `The username ${username} is taken.` };

  const emailTaken = (await db.user.findFirst({ where: { email } })) !== null;
  if (emailTaken) throw { email: `Email ${email} is already in use.` };

  // Hash the password and create auth data
  const passwordHash = await bcryptjs.hash(password, 10);
  await db.auth.create({
    data: { username, passwordHash },
  });

  // Then create the actual user
  const user = await db.user.create({
    data: { username, displayName, email },
  });
  if (!user) throw { username: 'Something went wrong creating the user.' };

  return createUserSession(user.id, redirectUrl);
};

/**
 * Log out the user. Redirects to login route.
 * @param request Request object
 * @returns redirect to login page with Set-Cookie header to destroy session
 */
export const logout = async (request: Request) => {
  const session = await getUserSession(request);

  return redirect('/login', {
    headers: {
      'Set-Cookie': await storage.destroySession(session),
    },
  });
};
