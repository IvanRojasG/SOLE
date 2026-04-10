import type { AthleteDashboard } from '@/types';

type AthleteProgressCardProps = {
  dashboard: AthleteDashboard;
};

export function AthleteProgressCard({ dashboard }: AthleteProgressCardProps) {
  return (
    <article className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
      <p className="text-xs uppercase tracking-[0.22em] text-[color:var(--color-secondary-soft)]">
        Progreso del atleta
      </p>
      <h3 className="mt-4 text-2xl font-semibold text-white">Momentum del mes</h3>
      <p className="mt-3 text-sm leading-7 text-[color:var(--color-text-muted)]">
        Tu asistencia se mantiene sólida y el volumen de logros aprobados respalda una subida
        consistente en la tabla general.
      </p>
      <div className="mt-6 space-y-4">
        {[
          ['Asistencia', `${dashboard.athlete.attendanceRate}%`, dashboard.athlete.attendanceRate],
          ['Logros aprobados', `${dashboard.athlete.achievementsApproved}`, 78],
          ['Racha del mes', `${dashboard.athlete.streakDays} días`, 68],
        ].map(([label, value, progress]) => (
          <div key={label}>
            <div className="flex items-center justify-between text-sm">
              <span className="text-[color:var(--color-text-muted)]">{label}</span>
              <span className="font-semibold text-white">{value}</span>
            </div>
            <div className="mt-2 h-3 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-[linear-gradient(90deg,var(--color-secondary),var(--color-primary))]"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </article>
  );
}
