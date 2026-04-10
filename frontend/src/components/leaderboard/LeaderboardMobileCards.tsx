import type { RankingEntry } from '@/types';

type LeaderboardMobileCardsProps = {
  entries: RankingEntry[];
};

export function LeaderboardMobileCards({ entries }: LeaderboardMobileCardsProps) {
  return (
    <div className="grid gap-4 lg:hidden">
      {entries.map((entry) => (
        <article key={entry.athleteId} className="rounded-[1.75rem] border border-white/10 bg-white/5 p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="font-display text-4xl uppercase tracking-[0.08em] text-white">
                {entry.rank}
              </p>
              <h3 className="mt-3 text-lg font-semibold text-white">{entry.athleteName}</h3>
              <p className="mt-1 text-xs uppercase tracking-[0.18em] text-[color:var(--color-text-muted)]">
                {entry.level}
              </p>
            </div>
            <div className="rounded-full bg-[color:var(--color-primary)] px-3 py-2 text-xs font-bold uppercase tracking-[0.18em] text-[color:var(--color-ink)]">
              {entry.points} pts
            </div>
          </div>
          <div className="mt-5 grid grid-cols-3 gap-3">
            <div className="rounded-2xl border border-white/10 p-3">
              <p className="text-xs uppercase tracking-[0.18em] text-[color:var(--color-text-muted)]">Asistencia</p>
              <p className="mt-2 text-lg font-semibold text-white">{entry.attendanceRate}%</p>
            </div>
            <div className="rounded-2xl border border-white/10 p-3">
              <p className="text-xs uppercase tracking-[0.18em] text-[color:var(--color-text-muted)]">Logros</p>
              <p className="mt-2 text-lg font-semibold text-white">{entry.approvedAchievements}</p>
            </div>
            <div className="rounded-2xl border border-white/10 p-3">
              <p className="text-xs uppercase tracking-[0.18em] text-[color:var(--color-text-muted)]">Delta</p>
              <p className={`mt-2 text-lg font-semibold ${entry.delta >= 0 ? 'text-[color:var(--color-success)]' : 'text-[color:var(--color-danger)]'}`}>
                {entry.delta >= 0 ? `+${entry.delta}` : entry.delta}
              </p>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
