import type { RankingEntry } from '@/types';

type TopThreePodiumProps = {
  entries: RankingEntry[];
};

export function TopThreePodium({ entries }: TopThreePodiumProps) {
  const ordered = [entries[1], entries[0], entries[2]].filter(Boolean);
  const cardStyles = [
    'border-cyan-200 bg-[linear-gradient(135deg,#ecfeff_0%,#dbeafe_55%,#ffffff_100%)] shadow-[0_24px_70px_rgba(8,145,178,0.18)]',
    'border-amber-200 bg-[linear-gradient(135deg,#fff7ed_0%,#fde68a_52%,#ffffff_100%)] shadow-[0_28px_82px_rgba(245,158,11,0.22)]',
    'border-lime-200 bg-[linear-gradient(135deg,#f7fee7_0%,#ccfbf1_55%,#ffffff_100%)] shadow-[0_24px_70px_rgba(20,184,166,0.16)]',
  ];
  const badgeStyles = [
    'bg-cyan-600 text-white',
    'bg-amber-500 text-slate-950',
    'bg-lime-500 text-slate-950',
  ];

  return (
    <div className="grid gap-4 lg:grid-cols-3 lg:gap-6">
      {ordered.map((entry, index) => {
        const isCenter = index === 1;

        return (
          <article
            key={entry.athleteId}
            className={`rounded-[2rem] border p-6 lg:p-7 ${cardStyles[index]} ${isCenter ? 'lg:-mt-4 lg:pb-10' : ''}`}
          >
            <div className={`inline-flex rounded-full px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] ${badgeStyles[index]}`}>
              Puesto {entry.rank}
            </div>
            <h2 className="mt-5 text-2xl font-semibold text-slate-950">{entry.athleteName}</h2>
            <p className="mt-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">
              {entry.level}
            </p>
            <p className="mt-6 font-display text-6xl uppercase tracking-[0.08em] text-slate-950">
              {entry.points}
            </p>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              puntos
            </p>
          </article>
        );
      })}
    </div>
  );
}
