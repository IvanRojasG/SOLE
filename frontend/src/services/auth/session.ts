import 'server-only';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export type AuthRole = 'athlete' | 'coach';

export type AuthSession = {
  accessToken: string;
  user: {
    id: string;
    email: string;
    role: AuthRole;
  };
};

const ACCESS_TOKEN_COOKIE = 'sole_access_token';
const USER_ID_COOKIE = 'sole_user_id';
const USER_EMAIL_COOKIE = 'sole_user_email';
const USER_ROLE_COOKIE = 'sole_user_role';

function cookieConfig() {
  return {
    httpOnly: true,
    sameSite: 'lax' as const,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 8,
  };
}

export async function getSession(): Promise<AuthSession | null> {
  const store = await cookies();
  const accessToken = store.get(ACCESS_TOKEN_COOKIE)?.value;
  const userId = store.get(USER_ID_COOKIE)?.value;
  const email = store.get(USER_EMAIL_COOKIE)?.value;
  const role = store.get(USER_ROLE_COOKIE)?.value;

  if (!accessToken || !userId || !email || (role !== 'athlete' && role !== 'coach')) {
    return null;
  }

  return {
    accessToken,
    user: {
      id: userId,
      email,
      role,
    },
  };
}

export async function persistSession(session: AuthSession) {
  const store = await cookies();
  const options = cookieConfig();

  store.set(ACCESS_TOKEN_COOKIE, session.accessToken, options);
  store.set(USER_ID_COOKIE, session.user.id, options);
  store.set(USER_EMAIL_COOKIE, session.user.email, options);
  store.set(USER_ROLE_COOKIE, session.user.role, options);
}

export async function clearSession() {
  const store = await cookies();
  store.delete(ACCESS_TOKEN_COOKIE);
  store.delete(USER_ID_COOKIE);
  store.delete(USER_EMAIL_COOKIE);
  store.delete(USER_ROLE_COOKIE);
}

function safeNextTarget(nextTarget?: string) {
  if (!nextTarget || !nextTarget.startsWith('/')) {
    return undefined;
  }

  return nextTarget;
}

export async function requireSession(role?: AuthRole, nextTarget?: string) {
  const session = await getSession();

  if (!session) {
    const nextParam = safeNextTarget(nextTarget);
    redirect(nextParam ? `/login?next=${encodeURIComponent(nextParam)}` : '/login');
  }

  if (role && session.user.role !== role) {
    redirect(session.user.role === 'coach' ? '/coach' : '/athlete/profile');
  }

  return session;
}
