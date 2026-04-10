import type { Athlete } from '@/types';

type AthleteCardProps = {
  athlete: Athlete;
};

export function AthleteCard({ athlete }: AthleteCardProps) {
  return (
    <article className="rounded-[1.9rem] border border-white/10 bg-white/5 p-6 shadow-[var(--shadow-soft)] transition hover:-translate-y-1 hover:border-white/20">
      <div className="flex items-start gap-4">
        <div
          className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-sm font-bold uppercase text-[color:var(--color-ink)]"
          style={{ backgroundColor: athlete.avatarColor }}
        >
          {athlete.fullName
            .split(' ')
            .slice(0, 2)
            .map((part) => part[0])
            .join('')}
        </div>
        <div className="min-w-0">
          <h2 className="text-xl font-semibold text-white">{athlete.fullName}</h2>
          <p className="mt-1 text-xs uppercase tracking-[0.18em] text-[color:var(--color-primary-soft)]">
            {athlete.level} • {athlete.city}
          </p>
        </div>
      </div>
      <p className="mt-5 text-sm leading-7 text-[color:var(--color-text-muted)]">{athlete.tagline}</p>
      <div className="mt-6 grid grid-cols-3 gap-3">
        <div className="rounded-2xl border border-white/10 p-3">
          <p className="text-[11px] uppercase tracking-[0.18em] text-[color:var(--color-text-muted)]">Puntos</p>
          <p className="mt-2 text-lg font-semibold text-white">{athlete.points}</p>
        </div>
        <div className="rounded-2xl border border-white/10 p-3">
          <p className="text-[11px] uppercase tracking-[0.18em] text-[color:var(--color-text-muted)]">Asistencia</p>
          <p className="mt-2 text-lg font-semibold text-white">{athlete.attendanceRate}%</p>
        </div>
        <div className="rounded-2xl border border-white/10 p-3">
          <p className="text-[11px] uppercase tracking-[0.18em] text-[color:var(--color-text-muted)]">Racha</p>
          <p className="mt-2 text-lg font-semibold text-white">{athlete.streakDays}d</p>
        </div>
      </div>
      <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4">
        <p className="text-[11px] uppercase tracking-[0.18em] text-[color:var(--color-text-muted)]">
          Foco principal
        </p>
        <p className="text-sm font-semibold text-[color:var(--color-secondary-soft)]">
          {athlete.favoriteFocus}
        </p>
      </div>
    </article>
  );
}
