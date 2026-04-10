'use client';

import type { AthleteLevel } from '@/types';

type LeaderboardFiltersProps = {
  levels: AthleteLevel[];
  selectedLevel: AthleteLevel | 'all';
  onLevelChange: (value: AthleteLevel | 'all') => void;
  query: string;
  onQueryChange: (value: string) => void;
};

export function LeaderboardFilters({
  levels,
  selectedLevel,
  onLevelChange,
  query,
  onQueryChange,
}: LeaderboardFiltersProps) {
  return (
    <div className="grid gap-5 rounded-[1.9rem] border border-white/10 bg-white/5 p-5 lg:grid-cols-[1fr_auto] lg:items-end">
      <div className="space-y-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--color-text-muted)]">
              Filtros
            </p>
            <h2 className="text-xl font-semibold text-white">Explora el ranking por nivel</h2>
          </div>
          <p className="text-sm text-[color:var(--color-text-muted)]">
            Busca atletas por nombre y reduce el tablero según categoría competitiva.
          </p>
        </div>
        <label className="block">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--color-text-muted)]">
            Buscar atleta
          </span>
          <input
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Ej. Valeria, Diego, Camila"
            className="mt-3 w-full rounded-2xl border border-white/10 bg-[color:var(--color-surface)] px-4 py-3 text-sm text-white outline-none transition placeholder:text-[color:var(--color-text-muted)] focus:border-[color:var(--color-primary)]"
          />
        </label>
      </div>
      <div className="flex flex-wrap gap-2 lg:max-w-sm lg:justify-end">
        <button
          type="button"
          onClick={() => onLevelChange('all')}
          className={`rounded-full px-4 py-3 text-xs font-semibold uppercase tracking-[0.18em] transition ${
            selectedLevel === 'all'
              ? 'bg-[color:var(--color-primary)] text-[color:var(--color-ink)]'
              : 'border border-white/10 bg-white/5 text-white'
          }`}
        >
          Todos
        </button>
        {levels.map((level) => (
          <button
            key={level}
            type="button"
            onClick={() => onLevelChange(level)}
            className={`rounded-full px-4 py-3 text-xs font-semibold uppercase tracking-[0.18em] transition ${
              selectedLevel === level
                ? 'bg-[color:var(--color-secondary)] text-[color:var(--color-ink)]'
                : 'border border-white/10 bg-white/5 text-white'
            }`}
          >
            {level}
          </button>
        ))}
      </div>
    </div>
  );
}
