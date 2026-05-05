import type { RankingEntry } from '@/types';

type LeaderboardMobileCardsProps = {
  entries: RankingEntry[];
};

export function LeaderboardMobileCards({
  entries,
}: LeaderboardMobileCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {entries.map((entry, index) => {
        const accents = [
          'border-amber-200 bg-[linear-gradient(135deg,#fff7ed,#fef3c7_48%,#ffffff)]',
          'border-cyan-200 bg-[linear-gradient(135deg,#ecfeff,#dbeafe_52%,#ffffff)]',
          'border-lime-200 bg-[linear-gradient(135deg,#f7fee7,#ccfbf1_52%,#ffffff)]',
          'border-rose-200 bg-[linear-gradient(135deg,#fff1f2,#ffe4e6_45%,#ffffff)]',
          'border-indigo-200 bg-[linear-gradient(135deg,#eef2ff,#e0e7ff_45%,#ffffff)]',
        ];
        const accent = accents[index % accents.length];

        return (
          <article
            key={`${entry.athleteId}-${entry.resultFormat}`}
            className={`rounded-[1.75rem] border p-5 shadow-[0_20px_52px_rgba(15,23,42,0.1)] ${accent}`}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="font-display text-4xl tracking-[0.08em] text-slate-950 uppercase">
                  {entry.rank}
                </p>
                <h3 className="mt-3 text-lg font-semibold text-slate-950">
                  {entry.athleteName}
                </h3>
                <p className="mt-1 text-xs font-semibold tracking-[0.18em] text-slate-600 uppercase">
                  {entry.level} · {entry.resultFormat}
                </p>
              </div>
              <div className="rounded-full bg-slate-950 px-3 py-2 text-xs font-bold tracking-[0.18em] text-white uppercase">
                {entry.points} puntos
              </div>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-white/70 bg-white/70 p-3">
                <p className="text-xs tracking-[0.18em] text-slate-500 uppercase">
                  Logros
                </p>
                <p className="mt-2 text-lg font-semibold text-slate-950">
                  {entry.approvedAchievements}
                </p>
              </div>
              <div className="rounded-2xl border border-white/70 bg-white/70 p-3">
                <p className="text-xs tracking-[0.18em] text-slate-500 uppercase">
                  Delta
                </p>
                <p
                  className={`mt-2 text-lg font-semibold ${entry.delta >= 0 ? 'text-[color:var(--color-success)]' : 'text-[color:var(--color-danger)]'}`}
                >
                  {entry.delta >= 0 ? `+${entry.delta}` : entry.delta}
                </p>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
