'use client';

import { useDeferredValue, useMemo, useState } from 'react';

import { AthleteManagementTable } from '@/components/coach/AthleteManagementTable';
import { AthleteScoresDrawer } from '@/components/coach/AthleteScoresDrawer';
import { CoachWodRegistrationDrawer } from '@/components/coach/CoachWodRegistrationDrawer';
import { ActionToast } from '@/components/shared/ActionToast';
import { getAthleteScoresAction, submitCoachAchievementAction } from '@/services/actions';
import type { Athlete, AthleteScoresDetail, Challenge } from '@/types';

type CoachAthletesViewProps = {
  athletes: Athlete[];
  challenges: Challenge[];
};

export function CoachAthletesView({ athletes, challenges }: CoachAthletesViewProps) {
  const [query, setQuery] = useState('');
  const [selectedAthlete, setSelectedAthlete] = useState<Athlete | null>(null);
  const [scoresAthlete, setScoresAthlete] = useState<Athlete | null>(null);
  const [scoresDetail, setScoresDetail] = useState<AthleteScoresDetail | null>(
    null,
  );
  const [scoresLoading, setScoresLoading] = useState(false);
  const [scoresError, setScoresError] = useState<string | null>(null);
  const [toast, setToast] = useState<{
    message: string;
    tone: 'success' | 'error';
  } | null>(null);
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

  async function loadAthleteScores(athlete: Athlete) {
    setScoresAthlete(athlete);
    setScoresDetail(null);
    setScoresError(null);
    setScoresLoading(true);

    const result = await getAthleteScoresAction(athlete.id, {
      athleteName: athlete.fullName,
      level: athlete.level,
    });
    if (result.ok) {
      setScoresDetail(result.scores);
    } else {
      setScoresError(result.error);
    }
    setScoresLoading(false);
  }

  return (
    <div className="space-y-6">
      {toast ? (
        <ActionToast
          message={toast.message}
          tone={toast.tone}
          onDismiss={() => setToast(null)}
        />
      ) : null}
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
        <AthleteManagementTable
          athletes={filteredAthletes}
          onRegisterWod={setSelectedAthlete}
          onViewScores={loadAthleteScores}
        />
      )}
      <AthleteScoresDrawer
        athlete={scoresAthlete}
        scores={scoresDetail}
        loading={scoresLoading}
        error={scoresError}
        open={scoresAthlete !== null}
        onClose={() => {
          setScoresAthlete(null);
          setScoresDetail(null);
          setScoresError(null);
        }}
      />
      <CoachWodRegistrationDrawer
        athlete={selectedAthlete}
        challenges={challenges}
        open={selectedAthlete !== null}
        onClose={() => setSelectedAthlete(null)}
        onSubmit={async (payload) => {
          const result = await submitCoachAchievementAction(payload);
          if (result.ok) {
            setToast({
              message: 'WOD registrado y aprobado correctamente.',
              tone: 'success',
            });
            if (scoresAthlete?.id === payload.athleteId) {
              await loadAthleteScores(scoresAthlete);
            }
            return result;
          }
          setToast({
            message: result.error,
            tone: 'error',
          });
          return result;
        }}
      />
    </div>
  );
}
