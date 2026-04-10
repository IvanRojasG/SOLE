'use client';

import type { PendingAchievementReview } from '@/types';

type PendingAchievementsTableProps = {
  items: PendingAchievementReview[];
  onSelect: (item: PendingAchievementReview) => void;
};

export function PendingAchievementsTable({ items, onSelect }: PendingAchievementsTableProps) {
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
        <article key={item.id} className="rounded-[1.75rem] border border-white/10 bg-white/5 p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-white">{item.title}</h3>
              <p className="mt-2 text-xs uppercase tracking-[0.18em] text-[color:var(--color-text-muted)]">
                {item.athleteName} • {item.achievementDate}
              </p>
            </div>
            <button
              type="button"
              onClick={() => onSelect(item)}
              className="rounded-full bg-[color:var(--color-primary)] px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-[color:var(--color-ink)]"
            >
              Revisar
            </button>
          </div>
        </article>
      ))}
    </div>
  );
}
