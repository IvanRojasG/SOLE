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
  sessionExpired?: boolean;
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

function FieldIcon({ name }: { name: 'mail' | 'lock' | 'user' }) {
  if (name === 'mail') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5" fill="none">
        <path
          d="m4.5 7.5 7.5 5 7.5-5"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.8"
        />
        <path
          d="M5.5 6h13A2.5 2.5 0 0 1 21 8.5v7a2.5 2.5 0 0 1-2.5 2.5h-13A2.5 2.5 0 0 1 3 15.5v-7A2.5 2.5 0 0 1 5.5 6Z"
          stroke="currentColor"
          strokeWidth="1.8"
        />
      </svg>
    );
  }

  if (name === 'user') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5" fill="none">
        <path
          d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"
          stroke="currentColor"
          strokeWidth="1.8"
        />
        <path
          d="M4.5 20a7.5 7.5 0 0 1 15 0"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="1.8"
        />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5" fill="none">
      <path
        d="M7 10V8a5 5 0 0 1 10 0v2"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.8"
      />
      <path
        d="M6.5 10h11A1.5 1.5 0 0 1 19 11.5v6A2.5 2.5 0 0 1 16.5 20h-9A2.5 2.5 0 0 1 5 17.5v-6A1.5 1.5 0 0 1 6.5 10Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function InputIcon({ name }: { name: 'mail' | 'lock' | 'user' }) {
  return (
    <span className="pointer-events-none absolute left-4 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-xl bg-blue-50 text-[color:var(--color-primary)]">
      <FieldIcon name={name} />
    </span>
  );
}

export function AuthForm({ mode, initialRedirectTo, nextTarget, sessionExpired }: AuthFormProps) {
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
      {mode === 'login' && sessionExpired ? (
        <div
          role="status"
          className="rounded-2xl border border-amber-300/50 bg-amber-300/10 px-4 py-3 text-sm leading-6 text-amber-100"
        >
          Tu sesión caducó. Inicia sesión nuevamente para continuar.
        </div>
      ) : null}
      <ErrorMessage state={state} />

      {mode === 'register' ? (
        <label className="block space-y-2">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--color-text-muted)]">
            Nombre completo
          </span>
          <span className="relative block">
            <InputIcon name="user" />
            <input
              name="fullName"
              type="text"
              required
              minLength={3}
              className="w-full rounded-2xl border border-white/10 bg-white/5 py-3 pl-16 pr-4 text-white placeholder:text-[color:var(--color-text-muted)]"
              placeholder="Camila Rios"
            />
          </span>
        </label>
      ) : null}

      <label className="block space-y-2">
        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--color-text-muted)]">
          Correo
        </span>
        <span className="relative block">
          <InputIcon name="mail" />
          <input
            name="email"
            type="email"
            required
            className="w-full rounded-2xl border border-white/10 bg-white/5 py-3 pl-16 pr-4 text-white placeholder:text-[color:var(--color-text-muted)]"
            placeholder="tu@solefitness.com"
          />
        </span>
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
        <span className="relative block">
          <InputIcon name="lock" />
          <input
            name="password"
            type="password"
            required
            minLength={8}
            className="w-full rounded-2xl border border-white/10 bg-white/5 py-3 pl-16 pr-4 text-white placeholder:text-[color:var(--color-text-muted)]"
            placeholder="Minimo 8 caracteres"
          />
        </span>
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
          <span className="relative block">
            <InputIcon name="lock" />
            <input
              name="confirmPassword"
              type="password"
              required
              minLength={8}
              className="w-full rounded-2xl border border-white/10 bg-white/5 py-3 pl-16 pr-4 text-white placeholder:text-[color:var(--color-text-muted)]"
              placeholder="Repite tu contraseña"
            />
          </span>
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
