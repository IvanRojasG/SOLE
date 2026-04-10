'use client';

import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';

import { saveAthleteProfileAction } from '@/services/actions';
import type { AthleteProfile } from '@/types';

type AthleteProfileFormProps = {
  profile: AthleteProfile;
};

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
          Ajusta los datos visibles del atleta. El nombre y nivel sí se sincronizan con el backend.
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        {[
          ['fullName', 'Nombre completo', formState.fullName],
          ['email', 'Email', formState.email],
          ['city', 'Ciudad', formState.city],
          ['boxName', 'Box', formState.boxName],
          ['favoriteFocus', 'Enfoque favorito', formState.favoriteFocus],
          ['goals', 'Objetivo actual', formState.goals],
        ].map(([key, label, value]) => (
          <label key={String(key)} className="block">
            <span className="text-xs uppercase tracking-[0.18em] text-[color:var(--color-text-muted)]">
              {label}
            </span>
            <input
              value={String(value)}
              onChange={(event) =>
                setFormState((current) => ({
                  ...current,
                  [key]: event.target.value,
                }))
              }
              className="mt-3 w-full rounded-2xl border border-white/10 bg-[color:var(--color-surface)] px-4 py-3 text-sm text-white outline-none focus:border-[color:var(--color-primary)]"
            />
          </label>
        ))}
      </div>
      <label className="block">
        <span className="text-xs uppercase tracking-[0.18em] text-[color:var(--color-text-muted)]">
          Bio
        </span>
        <textarea
          rows={5}
          value={formState.bio}
          onChange={(event) =>
            setFormState((current) => ({
              ...current,
              bio: event.target.value,
            }))
          }
          className="mt-3 w-full rounded-2xl border border-white/10 bg-[color:var(--color-surface)] px-4 py-3 text-sm text-white outline-none focus:border-[color:var(--color-primary)]"
        />
      </label>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-[color:var(--color-text-muted)]">
          Estado visual. No persiste todavía en backend.
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
