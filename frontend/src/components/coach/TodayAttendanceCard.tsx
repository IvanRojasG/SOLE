import type { AttendanceSessionRecord } from '@/types';

type TodayAttendanceCardProps = {
  sessions: AttendanceSessionRecord[];
};

export function TodayAttendanceCard({ sessions }: TodayAttendanceCardProps) {
  return (
    <article className="rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(250,250,250,0.06),rgba(255,255,255,0.02))] p-6 shadow-[var(--shadow-soft)]">
      <p className="text-xs uppercase tracking-[0.22em] text-[color:var(--color-secondary-soft)]">
        Attendance de hoy
      </p>
      <h2 className="mt-3 text-2xl font-semibold text-white">Capacidad operativa</h2>
      {sessions.length === 0 ? (
        <div className="mt-6 rounded-[1.5rem] border border-dashed border-white/15 p-5 text-sm text-[color:var(--color-text-muted)]">
          No hay sesiones para hoy.
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {sessions.map((session) => (
            <div key={session.id} className="rounded-[1.5rem] border border-white/10 bg-[rgba(250,250,250,0.04)] p-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-white">{session.title}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.18em] text-[color:var(--color-text-muted)]">
                    {session.sessionDate}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-white">
                    {session.checkedInCount}/{session.totalExpected}
                  </p>
                  <p className="mt-1 text-[11px] uppercase tracking-[0.18em] text-[color:var(--color-secondary-soft)]">
                    check-ins
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </article>
  );
}
