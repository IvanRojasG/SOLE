'use client';

import type { PendingAchievementReview } from '@/types';

type PendingAchievementsTableProps = {
  items: PendingAchievementReview[];
  onSelect: (item: PendingAchievementReview) => void;
};

export function PendingAchievementsTable({
  items,
  onSelect,
}: PendingAchievementsTableProps) {
  if (items.length === 0) {
    return (
      <div className="rounded-[2rem] border border-dashed border-white/15 bg-white/5 p-6 text-sm text-[color:var(--color-text-muted)]">
        No hay logros pendientes.
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {items.map((item) => (
        <article
          key={item.id}
          className="rounded-[1.75rem] border border-white/10 bg-white/5 p-5"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-white">{item.title}</h3>
              <p className="mt-2 text-xs tracking-[0.18em] text-[color:var(--color-text-muted)] uppercase">
                {item.athleteName} • {item.achievementDate}
              </p>
              <p className="mt-3 text-sm text-[color:var(--color-text-muted)]">
                {item.resultFormat.toUpperCase()} ·{' '}
                {item.completed
                  ? `Completado en ${item.timeSeconds ?? 0}s · ${item.repsCompleted ?? 0} reps`
                  : `${item.repsCompleted ?? 0} reps`}
                {item.weightLbs ? ` · ${item.weightLbs} lb` : ''}
                {item.rankPoints ? ` · ${item.rankPoints} puntos ranking` : ''}
              </p>
            </div>
            <div className="flex flex-col items-end gap-3">
              <span className="rounded-full border border-white/10 px-3 py-2 text-xs font-semibold tracking-[0.16em] text-white uppercase">
                {item.status === 'approved' ? 'Aprobado' : 'Pendiente'}
              </span>
              <button
                type="button"
                onClick={() => onSelect(item)}
                className="rounded-full bg-[color:var(--color-primary)] px-4 py-2 text-xs font-bold tracking-[0.18em] text-[color:var(--color-ink)] uppercase"
              >
                {item.status === 'approved' ? 'Corregir' : 'Revisar'}
              </button>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
