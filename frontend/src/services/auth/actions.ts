'use server';

import { redirect, unstable_rethrow } from 'next/navigation';

import {
  changePasswordWithBackend,
  loginWithCredentials,
  registerAthleteWithBackend,
  requestPasswordResetWithBackend,
  resetPasswordWithBackend,
} from '@/services/api/backend';
import { clearSession, persistSession } from '@/services/auth/session';
import type { AuthActionState, PasswordActionState } from '@/services/auth/state';

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
    unstable_rethrow(error);
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
    unstable_rethrow(error);
    return { error: getErrorMessage(error), redirectTo: null };
  }

  return { error: null, redirectTo: '/athlete/profile' };
}

export async function logoutAction() {
  await clearSession();
  redirect('/');
}

export async function changePasswordAction(
  _previousState: PasswordActionState,
  formData: FormData,
): Promise<PasswordActionState> {
  const currentPassword = getField(formData, 'currentPassword');
  const newPassword = getField(formData, 'newPassword');
  const confirmPassword = getField(formData, 'confirmPassword');

  if (!currentPassword || !newPassword || !confirmPassword) {
    return { error: 'Completa todos los campos.', message: null };
  }

  if (newPassword !== confirmPassword) {
    return { error: 'Las contraseñas nuevas no coinciden.', message: null };
  }

  try {
    await changePasswordWithBackend(
      {
        current_password: currentPassword,
        new_password: newPassword,
      },
      '/account/password',
    );
  } catch (error) {
    unstable_rethrow(error);
    return { error: getErrorMessage(error), message: null };
  }

  return { error: null, message: 'Contraseña actualizada correctamente.' };
}

export async function requestPasswordResetAction(
  _previousState: PasswordActionState,
  formData: FormData,
): Promise<PasswordActionState> {
  const email = getField(formData, 'email');

  if (!email) {
    return { error: 'Ingresa tu correo.', message: null };
  }

  try {
    const response = await requestPasswordResetWithBackend({ email });
    return {
      error: null,
      message: 'Si el correo existe, se generó una solicitud de recuperación.',
      resetToken: response.reset_token,
    };
  } catch (error) {
    unstable_rethrow(error);
    return { error: getErrorMessage(error), message: null };
  }
}

export async function resetPasswordAction(
  _previousState: PasswordActionState,
  formData: FormData,
): Promise<PasswordActionState> {
  const token = getField(formData, 'token');
  const newPassword = getField(formData, 'newPassword');
  const confirmPassword = getField(formData, 'confirmPassword');

  if (!token || !newPassword || !confirmPassword) {
    return { error: 'Completa todos los campos.', message: null };
  }

  if (newPassword !== confirmPassword) {
    return { error: 'Las contraseñas no coinciden.', message: null };
  }

  try {
    await resetPasswordWithBackend({
      token,
      new_password: newPassword,
    });
  } catch (error) {
    unstable_rethrow(error);
    return { error: getErrorMessage(error), message: null };
  }

  return { error: null, message: 'Contraseña actualizada. Ya puedes iniciar sesión.' };
}
