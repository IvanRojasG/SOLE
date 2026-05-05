'use client';

import { useDeferredValue, useMemo, useState } from 'react';

import { AthleteManagementTable } from '@/components/coach/AthleteManagementTable';
import type { Athlete } from '@/types';

type CoachAthletesViewProps = {
  athletes: Athlete[];
};

export function CoachAthletesView({ athletes }: CoachAthletesViewProps) {
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);

  const filteredAthletes = useMemo(() => {
    const normalizedQuery = deferredQuery.trim().toLowerCase();
    if (!normalizedQuery) {
      return athletes;
    }

    return athletes.filter((athlete) =>
      [athlete.fullName, athlete.level, athlete.favoriteFocus, athlete.tagline]
        .join(' ')
        .toLowerCase()
        .includes(normalizedQuery),
    );
  }, [athletes, deferredQuery]);

  return (
    <div className="space-y-6">
      <div className="rounded-[2rem] border border-white/10 bg-white/5 p-5">
        <div className="mb-4 flex flex-col gap-2 text-sm text-[color:var(--color-text-muted)] sm:flex-row sm:items-center sm:justify-between">
          <span>{athletes.length} atletas cargados</span>
          {query ? (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="w-fit rounded-full border border-white/15 px-3 py-2 text-xs font-semibold tracking-[0.16em] text-white uppercase"
            >
              Limpiar búsqueda
            </button>
          ) : null}
        </div>
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Buscar atleta por nombre, ciudad o nivel"
          className="w-full rounded-2xl border border-white/10 bg-[color:var(--color-surface)] px-4 py-3 text-sm text-white outline-none"
        />
      </div>
      {athletes.length > 0 && filteredAthletes.length === 0 ? (
        <div className="rounded-[2rem] border border-dashed border-white/15 bg-white/5 p-6 text-sm text-[color:var(--color-text-muted)]">
          No hay atletas que coincidan con la búsqueda actual.
        </div>
      ) : (
        <AthleteManagementTable athletes={filteredAthletes} />
      )}
    </div>
  );
}
