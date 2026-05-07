import 'server-only';

import { redirect } from 'next/navigation';

import type { AuthSession } from '@/services/auth/session';
import {
  clearSession,
  expiredSessionPath,
  getSession,
  safeNextTarget,
} from '@/services/auth/session';

type ApiRole = AuthSession['user']['role'];

type RequestOptions = {
  method?: 'GET' | 'POST' | 'PUT';
  body?: unknown;
  role?: ApiRole;
  session?: AuthSession;
  nextTarget?: string;
};

function getBackendUrl() {
  const url = process.env.BACKEND_API_URL ?? 'http://localhost:8000';
  return url.replace(/\/$/, '');
}

type UserIdentity = {
  id: string;
  email: string;
  role: ApiRole;
};

async function parseJsonResponse<T>(response: Response, path: string): Promise<T> {
  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Backend request failed for ${path}: ${detail}`);
  }

  return response.json() as Promise<T>;
}

function loginPath(nextTarget?: string) {
  const nextParam = safeNextTarget(nextTarget);
  return nextParam ? `/login?next=${encodeURIComponent(nextParam)}` : '/login';
}

async function redirectToExpiredSession(nextTarget?: string): Promise<never> {
  await clearSession();
  redirect(expiredSessionPath(nextTarget));
}

export async function backendRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (options.role) {
    const session = options.session ?? (await getSession());

    if (!session) {
      redirect(loginPath(options.nextTarget));
    }

    if (session.user.role !== options.role) {
      throw new Error(`Forbidden session role for ${path}`);
    }

    headers.Authorization = `Bearer ${session.accessToken}`;
  }

  const response = await fetch(`${getBackendUrl()}${path}`, {
    method: options.method ?? 'GET',
    headers,
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
    cache: 'no-store',
  });

  if (options.role && response.status === 401) {
    await redirectToExpiredSession(options.nextTarget);
  }

  return parseJsonResponse<T>(response, path);
}

export async function loginWithCredentials(credentials: {
  email: string;
  password: string;
}): Promise<AuthSession> {
  const loginResponse = await fetch(`${getBackendUrl()}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
    cache: 'no-store',
  });

  const tokenPayload = await parseJsonResponse<{ access_token: string }>(loginResponse, '/auth/login');
  const userResponse = await fetch(`${getBackendUrl()}/auth/me`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${tokenPayload.access_token}`,
    },
    cache: 'no-store',
  });

  const user = await parseJsonResponse<UserIdentity>(userResponse, '/auth/me');

  return {
    accessToken: tokenPayload.access_token,
    user,
  };
}

export async function registerAthleteWithBackend(payload: {
  full_name: string;
  email: string;
  password: string;
  level: string;
}) {
  const response = await fetch(`${getBackendUrl()}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
    cache: 'no-store',
  });

  return parseJsonResponse<UserIdentity>(response, '/auth/register');
}

export async function changePasswordWithBackend(payload: {
  current_password: string;
  new_password: string;
}, nextTarget?: string) {
  const session = await getSession();

  if (!session) {
    redirect(loginPath(nextTarget));
  }

  const response = await fetch(`${getBackendUrl()}/auth/change-password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session.accessToken}`,
    },
    body: JSON.stringify(payload),
    cache: 'no-store',
  });

  if (response.status === 401) {
    await redirectToExpiredSession(nextTarget);
  }

  return parseJsonResponse<{ message: string }>(response, '/auth/change-password');
}

export async function requestPasswordResetWithBackend(payload: { email: string }) {
  const response = await fetch(`${getBackendUrl()}/auth/forgot-password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
    cache: 'no-store',
  });

  return parseJsonResponse<{ message: string; reset_token: string | null }>(response, '/auth/forgot-password');
}

export async function resetPasswordWithBackend(payload: {
  token: string;
  new_password: string;
}) {
  const response = await fetch(`${getBackendUrl()}/auth/reset-password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
    cache: 'no-store',
  });

  return parseJsonResponse<{ message: string }>(response, '/auth/reset-password');
}
