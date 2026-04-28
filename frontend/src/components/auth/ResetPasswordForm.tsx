'use client';

import Link from 'next/link';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';

import { resetPasswordAction } from '@/services/auth/actions';
import { passwordActionInitialState } from '@/services/auth/state';

type ResetPasswordFormProps = {
  token: string;
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-full bg-[color:var(--color-primary)] px-5 py-3 text-xs font-bold uppercase tracking-[0.18em] text-white shadow-[0_14px_34px_rgba(0,92,255,0.22)] disabled:opacity-60"
    >
      {pending ? 'Guardando...' : 'Guardar nueva contraseña'}
    </button>
  );
}

export function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const [state, formAction] = useActionState(resetPasswordAction, passwordActionInitialState);

  return (
    <form action={formAction} className="grid gap-5 rounded-[2rem] border border-slate-200 bg-white/95 p-6 shadow-[0_24px_70px_rgba(15,23,42,0.08)] sm:p-8">
      <input type="hidden" name="token" value={token} />

      {state.error ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {state.error}
        </div>
      ) : null}
      {state.message ? (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {state.message}{' '}
          <Link href="/login" className="font-semibold underline">
            Ir a login
          </Link>
        </div>
      ) : null}

      <label className="block">
        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
          Nueva contraseña
        </span>
        <input
          name="newPassword"
          type="password"
          required
          minLength={8}
          className="mt-3 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 outline-none focus:border-[color:var(--color-primary)]"
        />
      </label>
      <label className="block">
        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
          Confirmar contraseña
        </span>
        <input
          name="confirmPassword"
          type="password"
          required
          minLength={8}
          className="mt-3 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 outline-none focus:border-[color:var(--color-primary)]"
        />
      </label>

      <div className="flex justify-end">
        <SubmitButton />
      </div>
    </form>
  );
}
