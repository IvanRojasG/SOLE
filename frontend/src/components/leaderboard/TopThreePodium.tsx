import type { RankingEntry } from '@/types';
import { getScoreLabel, getStatusLabel } from '@/components/leaderboard/scoreFormat';

type TopThreePodiumProps = {
  entries: RankingEntry[];
};

export function TopThreePodium({ entries }: TopThreePodiumProps) {
  if (entries.length === 0) {
    return (
      <div className="rounded-[2rem] border border-dashed border-slate-300 bg-white/80 p-6 text-sm text-slate-600">
        No hay atletas para mostrar en el podio con los filtros actuales.
      </div>
    );
  }

  const ordered = [
    { entry: entries[1], slot: 0 },
    { entry: entries[0], slot: 1 },
    { entry: entries[2], slot: 2 },
  ].filter(
    (item): item is { entry: RankingEntry; slot: number } =>
      item.entry !== undefined,
  );
  const cardStyles = [
    'border-teal-200 bg-[linear-gradient(135deg,#f0fdfa_0%,#dbeafe_55%,#ffffff_100%)] shadow-[0_24px_70px_rgba(8,145,178,0.18)]',
    'border-amber-200 bg-[linear-gradient(135deg,#fff7ed_0%,#fde68a_52%,#ffffff_100%)] shadow-[0_28px_82px_rgba(245,158,11,0.22)]',
    'border-lime-200 bg-[linear-gradient(135deg,#f7fee7_0%,#ccfbf1_55%,#ffffff_100%)] shadow-[0_24px_70px_rgba(20,184,166,0.16)]',
  ];
  const badgeStyles = [
    'bg-teal-600 text-white',
    'bg-amber-500 text-slate-950',
    'bg-lime-500 text-slate-950',
  ];

  return (
    <div className="grid gap-4 lg:grid-cols-3 lg:gap-6">
      {ordered.map(({ entry, slot }) => {
        const isCenter = slot === 1;

        return (
          <article
            key={`${entry.athleteId}-${entry.resultFormat}`}
            className={`sole-card-lift rounded-[1.5rem] border p-6 lg:p-7 ${cardStyles[slot]} ${isCenter ? 'lg:col-start-2 lg:-mt-4 lg:pb-10' : ''}`}
          >
            <div
              className={`inline-flex rounded-full px-4 py-2 text-xs font-bold tracking-[0.2em] uppercase ${badgeStyles[slot]}`}
            >
              Puesto {entry.rank}
            </div>
            <h2 className="mt-5 text-2xl font-semibold text-slate-950">
              {entry.athleteName}
            </h2>
            <p className="mt-2 text-xs font-semibold tracking-[0.2em] text-slate-600 uppercase">
              {entry.level} · {entry.resultFormat}
            </p>
            <p className="font-display mt-6 text-6xl tracking-[0.08em] text-slate-950 uppercase">
              {getScoreLabel(entry)}
            </p>
            <p className="text-xs font-semibold tracking-[0.2em] text-slate-500 uppercase">
              {getStatusLabel(entry)} · {entry.isFinalized ? `${entry.points} puntos` : '0 puntos'}
            </p>
          </article>
        );
      })}
    </div>
  );
}
