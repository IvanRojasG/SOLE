'use client';

import { useState, useTransition } from 'react';

import { createBaselineCatalogItemAction } from '@/services/actions';
import type { BaselineCatalogItem, BaselineEntry } from '@/types';

type BaselineCatalogFormProps = {
  onCreated: (item: BaselineCatalogItem) => void;
  onError?: (message: string) => void;
};

const categoryOptions: Array<{
  value: BaselineEntry['category'];
  label: string;
}> = [
  { value: 'weightlifting', label: 'Halterofilia' },
  { value: 'wod', label: 'WOD' },
  { value: 'gymnastics', label: 'Gymnastics' },
  { value: 'skill', label: 'Skill' },
  { value: 'strength', label: 'Fuerza' },
  { value: 'conditioning', label: 'Conditioning' },
  { value: 'other', label: 'Otro' },
];

const metricOptions: Array<{
  value: BaselineEntry['metricType'];
  label: string;
}> = [
  { value: 'weight', label: 'Peso' },
  { value: 'time', label: 'Tiempo' },
  { value: 'reps', label: 'Repeticiones' },
  { value: 'distance', label: 'Distancia' },
  { value: 'score', label: 'Score' },
  { value: 'status', label: 'Estado tecnico' },
];

const unitOptions: Array<{ value: BaselineEntry['unit']; label: string }> = [
  { value: 'lb', label: 'lb' },
  { value: 'kg', label: 'kg' },
  { value: 'seconds', label: 'segundos' },
  { value: 'reps', label: 'reps' },
  { value: 'meters', label: 'metros' },
  { value: 'points', label: 'puntos' },
  { value: 'status', label: 'estado' },
];

const emptyDraft = {
  name: '',
  category: 'weightlifting' as BaselineEntry['category'],
  metricType: 'weight' as BaselineEntry['metricType'],
  unit: 'lb' as BaselineEntry['unit'],
  description: '',
};

export function BaselineCatalogForm({
  onCreated,
  onError,
}: BaselineCatalogFormProps) {
  const [draft, setDraft] = useState(emptyDraft);
  const [error, setError] = useState('');
  const [isPending, startTransition] = useTransition();

  return (
    <form
      className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-[var(--shadow-soft)] sm:p-7"
      onSubmit={(event) => {
        event.preventDefault();
        setError('');

        startTransition(async () => {
          try {
            const created = await createBaselineCatalogItemAction(draft);
            onCreated(created.item);
            setDraft(emptyDraft);
          } catch (caught) {
            const message =
              caught instanceof Error
                ? caught.message
                : 'No se pudo crear el item.';
            setError(message);
            onError?.(message);
          }
        });
      }}
    >
      <div className="border-b border-white/10 pb-5">
        <p className="text-xs tracking-[0.22em] text-[color:var(--color-secondary-soft)] uppercase">
          Catalogo baseline
        </p>
        <h3 className="mt-3 text-2xl font-semibold text-white">
          Crear medicion
        </h3>
        <p className="mt-3 text-sm leading-7 text-[color:var(--color-text-muted)]">
          Cada item activo aparece para que el atleta registre su marca, tiempo,
          score o estado tecnico.
        </p>
      </div>
      <div className="mt-6 grid gap-5">
        <label className="block">
          <span className="text-xs tracking-[0.18em] text-[color:var(--color-text-muted)] uppercase">
            Nombre
          </span>
          <input
            required
            value={draft.name}
            onChange={(event) =>
              setDraft((current) => ({ ...current, name: event.target.value }))
            }
            placeholder="Ej. Clean and jerk 1RM"
            className="mt-3 w-full rounded-2xl border border-white/10 bg-[color:var(--color-surface)] px-4 py-3 text-sm text-white outline-none"
          />
        </label>
        <label className="block">
          <span className="text-xs tracking-[0.18em] text-[color:var(--color-text-muted)] uppercase">
            Descripcion
          </span>
          <textarea
            rows={4}
            value={draft.description}
            onChange={(event) =>
              setDraft((current) => ({
                ...current,
                description: event.target.value,
              }))
            }
            placeholder="Ej. Carga maxima tecnica para una repeticion."
            className="mt-3 w-full rounded-2xl border border-white/10 bg-[color:var(--color-surface)] px-4 py-3 text-sm text-white outline-none"
          />
        </label>
        <div className="grid gap-4 lg:grid-cols-3">
          <label className="block">
            <span className="text-xs tracking-[0.18em] text-[color:var(--color-text-muted)] uppercase">
              Categoria
            </span>
            <select
              value={draft.category}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  category: event.target.value as BaselineEntry['category'],
                }))
              }
              className="mt-3 w-full rounded-2xl border border-white/10 bg-[color:var(--color-surface)] px-4 py-3 text-sm text-white outline-none"
            >
              {categoryOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="text-xs tracking-[0.18em] text-[color:var(--color-text-muted)] uppercase">
              Tipo
            </span>
            <select
              value={draft.metricType}
              onChange={(event) => {
                const metricType = event.target
                  .value as BaselineEntry['metricType'];
                setDraft((current) => ({
                  ...current,
                  metricType,
                  unit:
                    metricType === 'status'
                      ? 'status'
                      : current.unit === 'status'
                        ? 'points'
                        : current.unit,
                }));
              }}
              className="mt-3 w-full rounded-2xl border border-white/10 bg-[color:var(--color-surface)] px-4 py-3 text-sm text-white outline-none"
            >
              {metricOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="text-xs tracking-[0.18em] text-[color:var(--color-text-muted)] uppercase">
              Unidad
            </span>
            <select
              value={draft.unit}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  unit: event.target.value as BaselineEntry['unit'],
                }))
              }
              className="mt-3 w-full rounded-2xl border border-white/10 bg-[color:var(--color-surface)] px-4 py-3 text-sm text-white outline-none"
            >
              {unitOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>
        {error ? <p className="text-sm text-red-200">{error}</p> : null}
        <button
          type="submit"
          disabled={isPending}
          className="rounded-full bg-[color:var(--color-primary)] px-5 py-3 text-xs font-bold tracking-[0.18em] text-[color:var(--color-ink)] uppercase disabled:opacity-60"
        >
          {isPending ? 'Creando...' : 'Crear medicion'}
        </button>
      </div>
    </form>
  );
}
