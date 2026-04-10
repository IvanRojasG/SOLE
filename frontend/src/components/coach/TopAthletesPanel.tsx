import type { RankingEntry } from '@/types';

type TopAthletesPanelProps = {
  athletes: RankingEntry[];
};

export function TopAthletesPanel({ athletes }: TopAthletesPanelProps) {
  return (
    <article className="rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(0,92,255,0.08))] p-6 shadow-[var(--shadow-soft)]">
      <p className="text-xs uppercase tracking-[0.22em] text-[color:var(--color-secondary-soft)]">
        Top atletas
      </p>
      <h2 className="mt-3 text-2xl font-semibold text-white">Líderes del tablero</h2>
      {athletes.length === 0 ? (
        <div className="mt-6 rounded-[1.5rem] border border-dashed border-white/15 p-5 text-sm text-[color:var(--color-text-muted)]">
          Sin ranking para mostrar.
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {athletes.map((athlete) => (
            <div key={athlete.athleteId} className="flex items-center justify-between rounded-[1.5rem] border border-white/10 bg-[rgba(6,21,47,0.42)] p-4">
              <div>
                <p className="text-sm font-semibold text-white">{athlete.athleteName}</p>
                <p className="mt-1 text-xs uppercase tracking-[0.18em] text-[color:var(--color-text-muted)]">
                  {athlete.level}
                </p>
              </div>
              <div className="text-right">
                <p className="font-display text-4xl uppercase tracking-[0.08em] text-white">
                  {athlete.rank}
                </p>
                <p className="text-xs uppercase tracking-[0.18em] text-[color:var(--color-secondary-soft)]">
                  {athlete.points} pts
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </article>
  );
}
