'use client';

import type { BaselineEntry } from '@/types';

type BaselineEntryBoardProps = {
  entries: BaselineEntry[];
  locked: boolean;
  onChange: (entries: BaselineEntry[]) => void;
};

const statuses: BaselineEntry['status'][] = ['not_started', 'developing', 'consistent', 'mastered'];

const categoryLabels: Record<BaselineEntry['category'], string> = {
  conditioning: 'Conditioning',
  gymnastics: 'Gymnastics',
  other: 'Otros',
  skill: 'Skills',
  strength: 'Strength',
  weightlifting: 'Halterofilia',
  wod: 'WODs',
};

const unitLabels: Record<BaselineEntry['unit'], string> = {
  kg: 'kg',
  lb: 'lb',
  meters: 'm',
  points: 'pts',
  reps: 'reps',
  seconds: 'seg',
  status: 'estado',
};

function formatMetricHint(entry: BaselineEntry) {
  if (entry.metricType === 'time') {
    return 'Tiempo en segundos';
  }

  if (entry.metricType === 'weight') {
    return `Carga en ${unitLabels[entry.unit]}`;
  }

  if (entry.metricType === 'status') {
    return 'Estado técnico';
  }

  return `Valor en ${unitLabels[entry.unit]}`;
}

function updateEntry(entries: BaselineEntry[], itemId: string, patch: Partial<BaselineEntry>) {
  return entries.map((entry) => (entry.itemId === itemId ? { ...entry, ...patch } : entry));
}

export function BaselineEntryBoard({ entries, locked, onChange }: BaselineEntryBoardProps) {
  const groupedEntries = entries.reduce<Record<string, BaselineEntry[]>>((groups, entry) => {
    const label = categoryLabels[entry.category] ?? categoryLabels.other;
    groups[label] = [...(groups[label] ?? []), entry];
    return groups;
  }, {});

  return (
    <div className="space-y-6">
      {Object.entries(groupedEntries).map(([category, items]) => (
        <article key={category} className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-[color:var(--color-primary-soft)]">
                {category}
              </p>
              <h2 className="mt-3 text-2xl font-semibold text-white">Registro del atleta</h2>
            </div>
            <p className="text-sm text-[color:var(--color-text-muted)]">
              Completa solo los elementos que ya tengas medidos.
            </p>
          </div>

          <div className="mt-6 grid gap-4">
            {items.map((entry) => (
              <div
                key={entry.itemId}
                className="grid gap-4 rounded-[1.5rem] border border-white/10 bg-[color:var(--color-surface)] p-4 lg:grid-cols-[1.1fr_0.9fr]"
              >
                <div>
                  <p className="text-base font-semibold text-white">{entry.name}</p>
                  <p className="mt-2 text-sm leading-6 text-[color:var(--color-text-muted)]">
                    {entry.description || formatMetricHint(entry)}
                  </p>
                  <p className="mt-3 text-[11px] uppercase tracking-[0.18em] text-[color:var(--color-secondary-soft)]">
                    {formatMetricHint(entry)}
                  </p>
                </div>

                {entry.metricType === 'status' ? (
                  <div className="flex flex-wrap gap-2">
                    {statuses.map((status) => (
                      <button
                        key={status}
                        type="button"
                        disabled={locked}
                        onClick={() => onChange(updateEntry(entries, entry.itemId, { status }))}
                        className={`rounded-full px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] ${
                          entry.status === status
                            ? 'bg-[color:var(--color-secondary)] text-[color:var(--color-ink)]'
                            : 'border border-white/10 bg-white/5 text-white'
                        } disabled:opacity-50`}
                      >
                        {status.replace('_', ' ')}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="grid gap-3 sm:grid-cols-[1fr_0.8fr]">
                    <label>
                      <span className="text-[11px] uppercase tracking-[0.18em] text-[color:var(--color-text-muted)]">
                        Valor
                      </span>
                      <input
                        type="number"
                        min="0"
                        step={entry.metricType === 'time' ? 1 : 0.01}
                        value={entry.value ?? ''}
                        disabled={locked}
                        onChange={(event) =>
                          onChange(
                            updateEntry(entries, entry.itemId, {
                              value: event.target.value === '' ? null : Number(event.target.value),
                            }),
                          )
                        }
                        className="mt-2 w-full rounded-xl border border-white/10 bg-black/10 px-3 py-3 text-sm text-white outline-none disabled:opacity-50"
                      />
                    </label>
                    <label>
                      <span className="text-[11px] uppercase tracking-[0.18em] text-[color:var(--color-text-muted)]">
                        Unidad
                      </span>
                      <input
                        value={unitLabels[entry.unit]}
                        readOnly
                        className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-3 text-sm text-[color:var(--color-text-muted)] outline-none"
                      />
                    </label>
                  </div>
                )}

                <label className="lg:col-span-2">
                  <span className="text-[11px] uppercase tracking-[0.18em] text-[color:var(--color-text-muted)]">
                    Notas
                  </span>
                  <input
                    value={entry.notes}
                    disabled={locked}
                    onChange={(event) => onChange(updateEntry(entries, entry.itemId, { notes: event.target.value }))}
                    placeholder="Ej. RX, scaled, con banda, técnica por mejorar"
                    className="mt-2 w-full rounded-xl border border-white/10 bg-black/10 px-3 py-3 text-sm text-white outline-none disabled:opacity-50"
                  />
                </label>
              </div>
            ))}
          </div>
        </article>
      ))}
    </div>
  );
}
