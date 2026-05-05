import type { RankingEntry } from '@/types';

type RankHighlightCardProps = {
  rank: RankingEntry;
};

export function RankHighlightCard({ rank }: RankHighlightCardProps) {
  return (
    <article className="rounded-[2rem] border border-white/10 bg-[color:var(--color-surface)] p-6">
      <p className="text-xs tracking-[0.22em] text-[color:var(--color-primary-soft)] uppercase">
        Posición actual
      </p>
      <div className="mt-5 flex items-end justify-between">
        <div>
          <p className="font-display text-7xl tracking-[0.08em] text-white uppercase">
            {rank.rank}
          </p>
          <p className="text-sm tracking-[0.18em] text-[color:var(--color-text-muted)] uppercase">
            lugar general
          </p>
        </div>
        <div className="rounded-full bg-[color:var(--color-secondary)] px-4 py-2 text-xs font-bold tracking-[0.18em] text-[color:var(--color-ink)] uppercase">
          {rank.delta >= 0 ? `+${rank.delta}` : rank.delta}
        </div>
      </div>
      <div className="mt-8 grid grid-cols-2 gap-3">
        <div className="rounded-2xl border border-white/10 p-4">
          <p className="text-[11px] tracking-[0.18em] text-[color:var(--color-text-muted)] uppercase">
            Puntos Open
          </p>
          <p className="mt-2 text-lg font-semibold text-white">{rank.points}</p>
        </div>
        <div className="rounded-2xl border border-white/10 p-4">
          <p className="text-[11px] tracking-[0.18em] text-[color:var(--color-text-muted)] uppercase">
            Logros
          </p>
          <p className="mt-2 text-lg font-semibold text-white">
            {rank.approvedAchievements}
          </p>
        </div>
      </div>
    </article>
  );
}
