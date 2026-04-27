'use server';

import { redirect } from 'next/navigation';

import { loginWithCredentials, registerAthleteWithBackend } from '@/services/api/backend';
import { clearSession, persistSession } from '@/services/auth/session';
import type { AuthActionState } from '@/services/auth/state';

function getField(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === 'string' ? value.trim() : '';
}

function resolveNextTarget(role: 'athlete' | 'coach', nextTarget: string) {
  if (role === 'coach' && nextTarget.startsWith('/coach')) {
    return nextTarget;
  }

  if (role === 'athlete' && nextTarget.startsWith('/athlete')) {
    return nextTarget;
  }

  return role === 'coach' ? '/coach' : '/athlete/profile';
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    const detail = error.message.split(': ').at(-1);
    return detail ?? error.message;
  }

  return 'No fue posible completar la autenticación.';
}

export async function loginAction(
  _previousState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const email = getField(formData, 'email');
  const password = getField(formData, 'password');
  const nextTarget = getField(formData, 'next');

  if (!email || !password) {
    return { error: 'Correo y contraseña son obligatorios.', redirectTo: null };
  }

  let session: Awaited<ReturnType<typeof loginWithCredentials>>;

  try {
    session = await loginWithCredentials({ email, password });
    await persistSession(session);
  } catch (error) {
    return { error: getErrorMessage(error), redirectTo: null };
  }

  return { error: null, redirectTo: resolveNextTarget(session.user.role, nextTarget) };
}

export async function registerAction(
  _previousState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const fullName = getField(formData, 'fullName');
  const email = getField(formData, 'email');
  const password = getField(formData, 'password');
  const confirmPassword = getField(formData, 'confirmPassword');
  const level = getField(formData, 'level');

  if (!fullName || !email || !password || !confirmPassword || !level) {
    return { error: 'Completa todos los campos para crear tu cuenta.', redirectTo: null };
  }

  if (password !== confirmPassword) {
    return { error: 'Las contraseñas no coinciden.', redirectTo: null };
  }

  let session: Awaited<ReturnType<typeof loginWithCredentials>>;

  try {
    await registerAthleteWithBackend({
      full_name: fullName,
      email,
      password,
      level,
    });

    session = await loginWithCredentials({ email, password });
    await persistSession(session);
  } catch (error) {
    return { error: getErrorMessage(error), redirectTo: null };
  }

  return { error: null, redirectTo: '/athlete/profile' };
}

export async function logoutAction() {
  await clearSession();
  redirect('/');
}
