import type { Achievement } from '@/types';

import { StatusBadge } from './StatusBadge';

type AchievementListProps = {
  achievements: Achievement[];
};

export function AchievementList({ achievements }: AchievementListProps) {
  if (achievements.length === 0) {
    return (
      <div className="rounded-[2rem] border border-dashed border-white/15 bg-white/5 p-6 text-sm text-[color:var(--color-text-muted)]">
        Todavía no hay logros registrados para este atleta.
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {achievements.map((achievement) => (
        <article key={achievement.id} className="rounded-[1.75rem] border border-white/10 bg-white/5 p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-white">{achievement.title}</h3>
              <p className="mt-2 text-xs uppercase tracking-[0.18em] text-[color:var(--color-text-muted)]">
                {achievement.achievementDate}
              </p>
            </div>
            <StatusBadge status={achievement.status} />
          </div>
          <p className="mt-4 text-sm text-[color:var(--color-text-muted)]">
            {achievement.pointsAwarded > 0
              ? `${achievement.pointsAwarded} puntos acreditados.`
              : 'Pendiente de validación o sin puntos acreditados.'}
          </p>
        </article>
      ))}
    </div>
  );
}
