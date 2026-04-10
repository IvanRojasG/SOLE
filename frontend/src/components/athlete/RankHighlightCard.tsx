import type { RankingEntry } from '@/types';

type RankHighlightCardProps = {
  rank: RankingEntry;
};

export function RankHighlightCard({ rank }: RankHighlightCardProps) {
  return (
    <article className="rounded-[2rem] border border-white/10 bg-[color:var(--color-surface)] p-6">
      <p className="text-xs uppercase tracking-[0.22em] text-[color:var(--color-primary-soft)]">
        Posición actual
      </p>
      <div className="mt-5 flex items-end justify-between">
        <div>
          <p className="font-display text-7xl uppercase tracking-[0.08em] text-white">{rank.rank}</p>
          <p className="text-sm uppercase tracking-[0.18em] text-[color:var(--color-text-muted)]">
            lugar general
          </p>
        </div>
        <div className="rounded-full bg-[color:var(--color-secondary)] px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-[color:var(--color-ink)]">
          {rank.delta >= 0 ? `+${rank.delta}` : rank.delta}
        </div>
      </div>
      <div className="mt-8 grid grid-cols-2 gap-3">
        <div className="rounded-2xl border border-white/10 p-4">
          <p className="text-[11px] uppercase tracking-[0.18em] text-[color:var(--color-text-muted)]">Puntos</p>
          <p className="mt-2 text-lg font-semibold text-white">{rank.points}</p>
        </div>
        <div className="rounded-2xl border border-white/10 p-4">
          <p className="text-[11px] uppercase tracking-[0.18em] text-[color:var(--color-text-muted)]">Logros</p>
          <p className="mt-2 text-lg font-semibold text-white">{rank.approvedAchievements}</p>
        </div>
      </div>
    </article>
  );
}
