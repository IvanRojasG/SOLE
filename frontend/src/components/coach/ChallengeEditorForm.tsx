'use client';

import { useEffect, useState } from 'react';

import type { ChallengeManagementItem } from '@/types';

type ChallengeEditorFormProps = {
  item: ChallengeManagementItem | null;
  onSave: (item: ChallengeManagementItem) => Promise<void>;
};

export function ChallengeEditorForm({ item, onSave }: ChallengeEditorFormProps) {
  const [state, setState] = useState<ChallengeManagementItem | null>(item);
  const isNew = state?.id.startsWith('draft-') ?? false;

  useEffect(() => {
    setState(item);
  }, [item]);

  if (!state) {
    return (
      <div className="rounded-[2rem] border border-dashed border-white/15 bg-white/5 p-6 text-sm text-[color:var(--color-text-muted)]">
        Selecciona un reto para editar su configuración visual.
      </div>
    );
  }

  return (
    <form
      className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-[var(--shadow-soft)] sm:p-7"
      onSubmit={async (event) => {
        event.preventDefault();
        if (!state) {
          return;
        }

        await onSave(state);
      }}
    >
      <div className="flex flex-col gap-3 border-b border-white/10 pb-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-[color:var(--color-secondary-soft)]">
            {isNew ? 'Nuevo challenge' : 'Editor visual'}
          </p>
          <h3 className="mt-3 text-2xl font-semibold text-white">
            {isNew ? 'Crear reto' : 'Editar reto existente'}
          </h3>
        </div>
        <p className="max-w-md text-sm leading-7 text-[color:var(--color-text-muted)]">
          {isNew
            ? 'La creación persiste título y puntos. Categoría, ventana y resumen se conservan como apoyo visual.'
            : 'La edición persistente actual cubre título y puntos; los demás campos siguen siendo de presentación.'}
        </p>
      </div>
      <div className="mt-6 grid gap-5">
        <label className="block">
          <span className="text-xs uppercase tracking-[0.18em] text-[color:var(--color-text-muted)]">
            Título
          </span>
          <input
            value={state.title}
            onChange={(event) => setState((current) => (current ? { ...current, title: event.target.value } : current))}
            className="mt-3 w-full rounded-2xl border border-white/10 bg-[color:var(--color-surface)] px-4 py-3 text-sm text-white outline-none"
          />
        </label>
        <label className="block">
          <span className="text-xs uppercase tracking-[0.18em] text-[color:var(--color-text-muted)]">
            Resumen visual
          </span>
          <textarea
            rows={5}
            value={state.summary}
            onChange={(event) => setState((current) => (current ? { ...current, summary: event.target.value } : current))}
            className="mt-3 w-full rounded-2xl border border-white/10 bg-[color:var(--color-surface)] px-4 py-3 text-sm text-white outline-none"
          />
        </label>
        <div className="grid gap-4 lg:grid-cols-2">
          <label className="block">
            <span className="text-xs uppercase tracking-[0.18em] text-[color:var(--color-text-muted)]">
              Puntos
            </span>
            <input
              type="number"
              min={1}
              value={state.points}
              onChange={(event) => setState((current) => (current ? { ...current, points: Number(event.target.value) } : current))}
              className="mt-3 w-full rounded-2xl border border-white/10 bg-[color:var(--color-surface)] px-4 py-3 text-sm text-white outline-none"
            />
          </label>
          <label className="block">
            <span className="text-xs uppercase tracking-[0.18em] text-[color:var(--color-text-muted)]">
              Categoría visual
            </span>
            <select
              value={state.category}
              onChange={(event) =>
                setState((current) =>
                  current ? { ...current, category: event.target.value as ChallengeManagementItem['category'] } : current,
                )
              }
              className="mt-3 w-full rounded-2xl border border-white/10 bg-[color:var(--color-surface)] px-4 py-3 text-sm text-white outline-none"
            >
              <option value="strength">Strength</option>
              <option value="gymnastics">Gymnastics</option>
              <option value="conditioning">Conditioning</option>
              <option value="consistency">Consistency</option>
            </select>
          </label>
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          <label className="block">
            <span className="text-xs uppercase tracking-[0.18em] text-[color:var(--color-text-muted)]">
              Dificultad visual
            </span>
            <select
              value={state.difficulty}
              onChange={(event) =>
                setState((current) =>
                  current ? { ...current, difficulty: event.target.value as ChallengeManagementItem['difficulty'] } : current,
                )
              }
              className="mt-3 w-full rounded-2xl border border-white/10 bg-[color:var(--color-surface)] px-4 py-3 text-sm text-white outline-none"
            >
              <option value="starter">Starter</option>
              <option value="builder">Builder</option>
              <option value="beast">Beast</option>
            </select>
          </label>
          <label className="block">
            <span className="text-xs uppercase tracking-[0.18em] text-[color:var(--color-text-muted)]">
              Ventana visual
            </span>
            <input
              value={state.windowLabel}
              onChange={(event) => setState((current) => (current ? { ...current, windowLabel: event.target.value } : current))}
              className="mt-3 w-full rounded-2xl border border-white/10 bg-[color:var(--color-surface)] px-4 py-3 text-sm text-white outline-none"
            />
          </label>
        </div>
        <button
          type="button"
          onClick={() => setState((current) => (current ? { ...current, isActive: !current.isActive } : current))}
          className="rounded-full border border-white/10 bg-[color:var(--color-surface)] px-4 py-3 text-xs font-bold uppercase tracking-[0.18em] text-white"
        >
          {state.isActive ? 'Marcar inactivo' : 'Marcar activo'}
        </button>
        <button
          type="submit"
          className="rounded-full bg-[color:var(--color-primary)] px-5 py-3 text-xs font-bold uppercase tracking-[0.18em] text-[color:var(--color-ink)]"
        >
          {isNew ? 'Crear reto' : 'Guardar cambios'}
        </button>
      </div>
    </form>
  );
}
