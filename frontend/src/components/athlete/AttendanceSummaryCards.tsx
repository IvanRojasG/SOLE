import type { Attendance } from '@/types';

type AttendanceSummaryCardsProps = {
  attendance: Attendance[];
};

export function AttendanceSummaryCards({ attendance }: AttendanceSummaryCardsProps) {
  const totalSessions = attendance.length;
  const checkedIn = attendance.filter((item) => item.checkedIn).length;
  const thisWeek = attendance.filter((item) => item.sessionDate >= '2026-04-07').length;

  return (
    <section className="grid gap-4 md:grid-cols-3">
      {[
        ['Sesiones registradas', `${totalSessions}`],
        ['Check-ins válidos', `${checkedIn}`],
        ['Última semana', `${thisWeek}`],
      ].map(([label, value]) => (
        <article key={label} className="rounded-[1.75rem] border border-white/10 bg-white/5 p-5">
          <p className="text-xs uppercase tracking-[0.18em] text-[color:var(--color-text-muted)]">{label}</p>
          <p className="mt-4 font-display text-5xl uppercase tracking-[0.08em] text-white">{value}</p>
        </article>
      ))}
    </section>
  );
}
