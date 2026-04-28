'use client';

import Link from 'next/link';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';

import { requestPasswordResetAction } from '@/services/auth/actions';
import { passwordActionInitialState } from '@/services/auth/state';

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-full bg-[color:var(--color-primary)] px-5 py-3 text-xs font-bold uppercase tracking-[0.18em] text-white shadow-[0_14px_34px_rgba(0,92,255,0.22)] disabled:opacity-60"
    >
      {pending ? 'Generando...' : 'Solicitar recuperación'}
    </button>
  );
}

export function ForgotPasswordForm() {
  const [state, formAction] = useActionState(requestPasswordResetAction, passwordActionInitialState);

  return (
    <form action={formAction} className="grid gap-5 rounded-[2rem] border border-slate-200 bg-white/95 p-6 shadow-[0_24px_70px_rgba(15,23,42,0.08)] sm:p-8">
      {state.error ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {state.error}
        </div>
      ) : null}
      {state.message ? (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {state.message}
        </div>
      ) : null}

      <label className="block">
        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
          Correo de tu cuenta
        </span>
        <input
          name="email"
          type="email"
          required
          className="mt-3 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 outline-none focus:border-[color:var(--color-primary)]"
          placeholder="tu@solefitness.com"
        />
      </label>

      {state.resetToken ? (
        <div className="rounded-[1.5rem] border border-amber-200 bg-amber-50 p-4 text-sm leading-7 text-amber-900">
          <p className="font-semibold">Modo local: token generado.</p>
          <p className="break-all">{state.resetToken}</p>
          <Link
            href={`/reset-password?token=${encodeURIComponent(state.resetToken)}`}
            className="mt-3 inline-flex font-semibold text-amber-950 underline"
          >
            Abrir pantalla para crear nueva contraseña
          </Link>
        </div>
      ) : null}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Link href="/login" className="text-sm font-semibold text-slate-600 hover:text-[color:var(--color-primary)]">
          Volver a login
        </Link>
        <SubmitButton />
      </div>
    </form>
  );
}
