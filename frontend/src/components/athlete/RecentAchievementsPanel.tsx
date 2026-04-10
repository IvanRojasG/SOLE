import type { Achievement } from '@/types';

import { StatusBadge } from './StatusBadge';

type RecentAchievementsPanelProps = {
  achievements: Achievement[];
};

export function RecentAchievementsPanel({ achievements }: RecentAchievementsPanelProps) {
  return (
    <article className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
      <p className="text-xs uppercase tracking-[0.22em] text-[color:var(--color-primary-soft)]">
        Logros recientes
      </p>
      <h3 className="mt-3 text-2xl font-semibold text-white">Actividad validada</h3>
      {achievements.length === 0 ? (
        <div className="mt-6 rounded-[1.5rem] border border-dashed border-white/15 p-5 text-sm text-[color:var(--color-text-muted)]">
          No hay logros recientes para mostrar.
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {achievements.map((achievement) => (
            <div key={achievement.id} className="rounded-[1.5rem] border border-white/10 bg-[color:var(--color-surface)] p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h4 className="text-base font-semibold text-white">{achievement.title}</h4>
                  <p className="mt-2 text-xs uppercase tracking-[0.18em] text-[color:var(--color-text-muted)]">
                    {achievement.achievementDate}
                  </p>
                </div>
                <StatusBadge status={achievement.status} />
              </div>
            </div>
          ))}
        </div>
      )}
    </article>
  );
}
