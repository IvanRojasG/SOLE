import type { PendingAchievementReview } from '@/types';

type PendingApprovalsCardProps = {
  items: PendingAchievementReview[];
};

export function PendingApprovalsCard({ items }: PendingApprovalsCardProps) {
  return (
    <article className="rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(0,92,255,0.14),rgba(255,255,255,0.03))] p-6 shadow-[var(--shadow-soft)]">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-[color:var(--color-secondary-soft)]">
            Pendientes
          </p>
          <h2 className="mt-3 text-2xl font-semibold text-white">Aprobaciones rápidas</h2>
        </div>
        <div className="rounded-full bg-[color:var(--color-primary)] px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-[color:var(--color-text)]">
          {items.length}
        </div>
      </div>
      {items.length === 0 ? (
        <div className="mt-6 rounded-[1.5rem] border border-dashed border-white/15 p-5 text-sm text-[color:var(--color-text-muted)]">
          No hay logros pendientes por revisar.
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {items.slice(0, 3).map((item) => (
            <div key={item.id} className="rounded-[1.5rem] border border-white/10 bg-[rgba(6,21,47,0.5)] p-4">
              <p className="text-sm font-semibold text-white">{item.title}</p>
              <p className="mt-1 text-xs uppercase tracking-[0.18em] text-[color:var(--color-text-muted)]">
                {item.athleteName} • {item.achievementDate}
              </p>
            </div>
          ))}
        </div>
      )}
    </article>
  );
}
