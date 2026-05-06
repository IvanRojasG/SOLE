'use client';

import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';

import { saveAthleteProfileAction } from '@/services/actions';
import type { AthleteLevel, AthleteProfile } from '@/types';

type AthleteProfileFormProps = {
  profile: AthleteProfile;
};

const levelOptions: Array<{ value: AthleteLevel; label: string }> = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'scaled', label: 'Scaled' },
  { value: 'rx', label: 'RX' },
];

export function AthleteProfileForm({ profile }: AthleteProfileFormProps) {
  const [formState, setFormState] = useState(profile);
  const [saved, setSaved] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  return (
    <form
      className="grid gap-6 rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-[var(--shadow-soft)] sm:p-7"
      onSubmit={(event) => {
        event.preventDefault();
        startTransition(async () => {
          await saveAthleteProfileAction({
            fullName: formState.fullName,
            level: formState.level,
          });
          setSaved(true);
          router.refresh();
        });
      }}
    >
      <div className="flex flex-col gap-3 border-b border-white/10 pb-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-[color:var(--color-primary-soft)]">
            Edición
          </p>
          <h3 className="mt-3 text-2xl font-semibold text-white">Información personal y deportiva</h3>
        </div>
        <p className="max-w-md text-sm leading-7 text-[color:var(--color-text-muted)]">
          Ajusta el nombre visible y el nivel competitivo. El correo se muestra como referencia de acceso.
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <label className="block">
          <span className="text-xs uppercase tracking-[0.18em] text-[color:var(--color-text-muted)]">
            Nombre completo
          </span>
          <input
            value={formState.fullName}
            onChange={(event) =>
              setFormState((current) => ({
                ...current,
                fullName: event.target.value,
              }))
            }
            className="mt-3 w-full rounded-2xl border border-white/10 bg-[color:var(--color-surface)] px-4 py-3 text-sm text-white outline-none focus:border-[color:var(--color-primary)]"
          />
        </label>
        <label className="block">
          <span className="text-xs uppercase tracking-[0.18em] text-[color:var(--color-text-muted)]">
            Correo
          </span>
          <input
            value={formState.email}
            disabled
            className="mt-3 w-full cursor-not-allowed rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-[color:var(--color-text-muted)] outline-none"
          />
        </label>
        <label className="block">
          <span className="text-xs uppercase tracking-[0.18em] text-[color:var(--color-text-muted)]">
            Nivel
          </span>
          <select
            value={formState.level}
            onChange={(event) =>
              setFormState((current) => ({
                ...current,
                level: event.target.value as AthleteLevel,
              }))
            }
            className="mt-3 w-full rounded-2xl border border-white/10 bg-[color:var(--color-surface)] px-4 py-3 text-sm text-white outline-none focus:border-[color:var(--color-primary)]"
          >
            {levelOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-[color:var(--color-text-muted)]">
          Estos cambios se sincronizan con tu perfil del reto.
        </p>
        <div className="flex items-center gap-3">
          {saved && (
            <span className="text-xs uppercase tracking-[0.18em] text-[color:var(--color-success)]">
              Cambios guardados
            </span>
          )}
          <button
            type="submit"
            disabled={isPending}
            className="rounded-full bg-[color:var(--color-primary)] px-5 py-3 text-xs font-bold uppercase tracking-[0.18em] text-[color:var(--color-ink)]"
          >
            {isPending ? 'Guardando...' : 'Guardar perfil'}
          </button>
        </div>
      </div>
    </form>
  );
}
