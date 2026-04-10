import type { Attendance } from '@/types';

type AttendanceHistoryListProps = {
  attendance: Attendance[];
};

export function AttendanceHistoryList({ attendance }: AttendanceHistoryListProps) {
  if (attendance.length === 0) {
    return (
      <div className="rounded-[2rem] border border-dashed border-white/15 bg-white/5 p-6 text-sm text-[color:var(--color-text-muted)]">
        No hay registros de asistencia todavía.
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {attendance.map((entry) => (
        <article key={entry.id} className="rounded-[1.75rem] border border-white/10 bg-white/5 p-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-lg font-semibold text-white">{entry.sessionDate}</p>
              <p className="mt-1 text-xs uppercase tracking-[0.18em] text-[color:var(--color-text-muted)]">
                Historial de asistencia
              </p>
            </div>
            <span className="rounded-full bg-[color:var(--color-success)]/15 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[color:var(--color-success)]">
              {entry.checkedIn ? 'Checked-in' : 'Ausente'}
            </span>
          </div>
        </article>
      ))}
    </div>
  );
}
