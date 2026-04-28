'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useActionState, useEffect } from 'react';
import { useFormStatus } from 'react-dom';

import {
  loginAction,
  registerAction,
} from '@/services/auth/actions';
import { authActionInitialState, type AuthActionState } from '@/services/auth/state';

type AuthFormProps = {
  mode: 'login' | 'register';
  initialRedirectTo?: string;
  nextTarget?: string;
};

function SubmitButton({ children }: { children: React.ReactNode }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      className="rounded-full bg-[color:var(--color-primary)] px-5 py-3 text-sm font-bold uppercase tracking-[0.18em] text-[color:var(--color-ink)] transition hover:bg-[color:var(--color-primary-soft)] disabled:cursor-not-allowed disabled:opacity-70"
      disabled={pending}
    >
      {pending ? 'Procesando...' : children}
    </button>
  );
}

function ErrorMessage({ state }: { state: AuthActionState }) {
  if (!state.error) {
    return null;
  }

  return (
    <div
      role="alert"
      className="rounded-2xl border border-[color:var(--color-danger)]/40 bg-[color:var(--color-danger)]/10 px-4 py-3 text-sm text-white"
    >
      {state.error}
    </div>
  );
}

export function AuthForm({ mode, initialRedirectTo, nextTarget }: AuthFormProps) {
  const router = useRouter();
  const action = mode === 'login' ? loginAction : registerAction;
  const [state, formAction] = useActionState(action, authActionInitialState);
  const redirectTo = state.redirectTo ?? initialRedirectTo;

  useEffect(() => {
    if (!redirectTo) {
      return;
    }

    router.replace(redirectTo);
  }, [redirectTo, router]);

  return (
    <form action={formAction} className="space-y-5">
      {nextTarget ? <input type="hidden" name="next" value={nextTarget} /> : null}
      <ErrorMessage state={state} />

      {mode === 'register' ? (
        <label className="block space-y-2">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--color-text-muted)]">
            Nombre completo
          </span>
          <input
            name="fullName"
            type="text"
            required
            minLength={3}
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-[color:var(--color-text-muted)]"
            placeholder="Camila Rios"
          />
        </label>
      ) : null}

      <label className="block space-y-2">
        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--color-text-muted)]">
          Correo
        </span>
        <input
          name="email"
          type="email"
          required
          className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-[color:var(--color-text-muted)]"
          placeholder="tu@solefitness.com"
        />
      </label>

      {mode === 'register' ? (
        <label className="block space-y-2">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--color-text-muted)]">
            Nivel
          </span>
          <select
            name="level"
            required
            defaultValue="scaled"
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white"
          >
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="scaled">Scaled</option>
            <option value="rx">RX</option>
          </select>
        </label>
      ) : null}

      <label className="block space-y-2">
        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--color-text-muted)]">
          Contraseña
        </span>
        <input
          name="password"
          type="password"
          required
          minLength={8}
          className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-[color:var(--color-text-muted)]"
          placeholder="Minimo 8 caracteres"
        />
      </label>

      {mode === 'login' ? (
        <div className="-mt-2 flex justify-end">
          <Link href="/forgot-password" className="text-sm font-semibold text-[color:var(--color-secondary-soft)]">
            ¿Olvidaste tu contraseña?
          </Link>
        </div>
      ) : null}

      {mode === 'register' ? (
        <label className="block space-y-2">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--color-text-muted)]">
            Confirmar contraseña
          </span>
          <input
            name="confirmPassword"
            type="password"
            required
            minLength={8}
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-[color:var(--color-text-muted)]"
            placeholder="Repite tu contraseña"
          />
        </label>
      ) : null}

      <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
        <SubmitButton>{mode === 'login' ? 'Entrar' : 'Crear cuenta'}</SubmitButton>
        <p className="text-sm text-[color:var(--color-text-muted)]">
          {mode === 'login' ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}{' '}
          <Link
            href={mode === 'login' ? '/register' : '/login'}
            className="font-semibold text-[color:var(--color-secondary-soft)]"
          >
            {mode === 'login' ? 'Registrarme' : 'Iniciar sesión'}
          </Link>
        </p>
      </div>
    </form>
  );
}
