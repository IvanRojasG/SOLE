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

type SessionState =
  | { status: 'active'; session: AuthSession }
  | { status: 'expired' }
  | { status: 'missing' };

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

function isTokenExpired(token: string) {
  const [, payload] = token.split('.');

  if (!payload) {
    return true;
  }

  try {
    const normalizedPayload = payload.replace(/-/g, '+').replace(/_/g, '/');
    const decodedPayload = JSON.parse(
      Buffer.from(normalizedPayload, 'base64').toString('utf-8'),
    ) as { exp?: unknown };

    if (typeof decodedPayload.exp !== 'number') {
      return true;
    }

    return decodedPayload.exp * 1000 <= Date.now();
  } catch {
    return true;
  }
}

async function getSessionState(): Promise<SessionState> {
  const store = await cookies();
  const accessToken = store.get(ACCESS_TOKEN_COOKIE)?.value;
  const userId = store.get(USER_ID_COOKIE)?.value;
  const email = store.get(USER_EMAIL_COOKIE)?.value;
  const role = store.get(USER_ROLE_COOKIE)?.value;

  if (!accessToken || !userId || !email || (role !== 'athlete' && role !== 'coach')) {
    return { status: 'missing' };
  }

  if (isTokenExpired(accessToken)) {
    return { status: 'expired' };
  }

  return {
    status: 'active',
    session: {
      accessToken,
      user: {
        id: userId,
        email,
        role,
      },
    },
  };
}

export async function getSession(): Promise<AuthSession | null> {
  const state = await getSessionState();
  return state.status === 'active' ? state.session : null;
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

export function safeNextTarget(nextTarget?: string) {
  if (!nextTarget || !nextTarget.startsWith('/')) {
    return undefined;
  }

  if (nextTarget.startsWith('//')) {
    return undefined;
  }

  return nextTarget;
}

export function expiredSessionPath(nextTarget?: string) {
  const nextParam = safeNextTarget(nextTarget);
  return nextParam
    ? `/session-expired?next=${encodeURIComponent(nextParam)}`
    : '/session-expired';
}

export async function requireSession(role?: AuthRole, nextTarget?: string) {
  const state = await getSessionState();

  if (state.status === 'expired') {
    redirect(expiredSessionPath(nextTarget));
  }

  if (state.status === 'missing') {
    const nextParam = safeNextTarget(nextTarget);
    redirect(nextParam ? `/login?next=${encodeURIComponent(nextParam)}` : '/login');
  }

  const { session } = state;

  if (role && session.user.role !== role) {
    redirect(session.user.role === 'coach' ? '/coach' : '/athlete/profile');
  }

  return session;
}
