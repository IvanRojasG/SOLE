import type { RankingEntry } from '@/types';

type TopThreePodiumProps = {
  entries: RankingEntry[];
};

export function TopThreePodium({ entries }: TopThreePodiumProps) {
  const ordered = [entries[1], entries[0], entries[2]].filter(Boolean);

  return (
    <div className="grid gap-4 lg:grid-cols-3 lg:gap-6">
      {ordered.map((entry, index) => {
        const isCenter = index === 1;

        return (
          <article
            key={entry.athleteId}
            className={`rounded-[2rem] border border-white/10 p-6 lg:p-7 ${
              isCenter
                ? 'bg-[linear-gradient(180deg,rgba(247,92,3,0.22),rgba(255,255,255,0.03))] shadow-[var(--shadow-glow)]'
                : 'bg-white/5'
            }`}
          >
            <p className="text-xs uppercase tracking-[0.24em] text-[color:var(--color-text-muted)]">
              Puesto {entry.rank}
            </p>
            <h2 className="mt-5 text-2xl font-semibold text-white">{entry.athleteName}</h2>
            <p className="mt-2 text-xs uppercase tracking-[0.2em] text-[color:var(--color-primary-soft)]">
              {entry.level}
            </p>
            <p className="mt-6 font-display text-6xl uppercase tracking-[0.08em] text-white">
              {entry.points}
            </p>
            <p className="text-xs uppercase tracking-[0.2em] text-[color:var(--color-text-muted)]">
              puntos
            </p>
          </article>
        );
      })}
    </div>
  );
}
