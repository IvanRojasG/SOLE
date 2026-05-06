'use client';

import type { AthleteLevel, ResultFormat } from '@/types';

type LeaderboardFiltersProps = {
  levels: AthleteLevel[];
  selectedLevel: AthleteLevel | 'all';
  onLevelChange: (value: AthleteLevel | 'all') => void;
  selectedFormat: ResultFormat | 'all';
  onFormatChange: (value: ResultFormat | 'all') => void;
  query: string;
  onQueryChange: (value: string) => void;
  showFormatFilter?: boolean;
};

export function LeaderboardFilters({
  levels,
  selectedLevel,
  onLevelChange,
  selectedFormat,
  onFormatChange,
  query,
  onQueryChange,
  showFormatFilter = true,
}: LeaderboardFiltersProps) {
  return (
    <div className="grid gap-5 rounded-[1.9rem] border border-slate-200/90 bg-white/90 p-5 shadow-[0_22px_62px_rgba(15,23,42,0.08)] lg:grid-cols-[1fr_auto] lg:items-end">
      <div className="space-y-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--color-primary)]">
              Filtros
            </p>
            <h2 className="text-xl font-semibold text-slate-950">Explora el ranking por nivel</h2>
          </div>
          <p className="text-sm text-slate-600">
            Busca atletas por nombre y reduce el tablero según categoría competitiva.
          </p>
        </div>
        <label className="block">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            Buscar atleta
          </span>
          <input
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Ej. Valeria, Diego, Camila"
            className="mt-3 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-[color:var(--color-primary)]"
          />
        </label>
      </div>
      <div className="grid gap-3 lg:max-w-sm">
        <div className="flex flex-wrap gap-2 lg:justify-end">
        <button
          type="button"
          onClick={() => onLevelChange('all')}
          className={`rounded-full px-4 py-3 text-xs font-semibold uppercase tracking-[0.18em] transition ${
            selectedLevel === 'all'
              ? 'bg-[color:var(--color-primary)] text-white shadow-[0_14px_32px_rgba(0,92,255,0.22)]'
              : 'border border-slate-200 bg-white text-slate-700 hover:border-[color:var(--color-primary)] hover:text-[color:var(--color-primary)]'
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
                ? 'bg-slate-950 text-white shadow-[0_14px_32px_rgba(15,23,42,0.18)]'
                : 'border border-slate-200 bg-white text-slate-700 hover:border-[color:var(--color-primary)] hover:text-[color:var(--color-primary)]'
            }`}
          >
            {level}
          </button>
        ))}
        </div>
        {showFormatFilter ? (
          <div className="flex flex-wrap gap-2 lg:justify-end">
            {(['all', 'rx', 'scaled'] as Array<ResultFormat | 'all'>).map((format) => (
              <button
                key={format}
                type="button"
                onClick={() => onFormatChange(format)}
                className={`rounded-full px-4 py-3 text-xs font-semibold uppercase tracking-[0.18em] transition ${
                  selectedFormat === format
                    ? 'bg-[color:var(--color-secondary)] text-white shadow-[0_14px_32px_rgba(31,182,170,0.18)]'
                    : 'border border-slate-200 bg-white text-slate-700 hover:border-[color:var(--color-secondary)] hover:text-[color:var(--color-secondary)]'
                }`}
              >
                {format === 'all' ? 'Todos' : format}
              </button>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
