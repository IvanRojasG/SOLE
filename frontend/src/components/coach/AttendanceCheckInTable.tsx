'use client';

import { useState } from 'react';

import type { Athlete, AttendanceSessionRecord } from '@/types';

type AttendanceCheckInTableProps = {
  athletes: Athlete[];
  sessions: AttendanceSessionRecord[];
  onCheckIn: (payload: { sessionId: string; athleteId: string }) => Promise<void>;
};

export function AttendanceCheckInTable({
  athletes,
  sessions,
  onCheckIn,
}: AttendanceCheckInTableProps) {
  const [checkedInIds, setCheckedInIds] = useState<string[]>([]);

  if (athletes.length === 0) {
    return (
      <div className="rounded-[2rem] border border-dashed border-white/15 bg-white/5 p-6 text-sm text-[color:var(--color-text-muted)]">
        Sin atletas disponibles para check-in.
      </div>
    );
  }

  const activeSession = sessions[0];

  return (
    <div className="space-y-6">
      {sessions.length > 0 ? (
        <div className="grid gap-3 md:grid-cols-2">
          {sessions.map((session) => (
            <div key={session.id} className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
              <p className="text-sm font-semibold text-white">{session.title}</p>
              <p className="mt-1 text-xs uppercase tracking-[0.18em] text-[color:var(--color-text-muted)]">
                {session.sessionDate}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-[2rem] border border-dashed border-white/15 bg-white/5 p-6 text-sm text-[color:var(--color-text-muted)]">
          No hay sesiones creadas todavía.
        </div>
      )}
      <div className="grid gap-4">
        {athletes.map((athlete) => {
          const checked = checkedInIds.includes(athlete.id);

          return (
            <div key={athlete.id} className="flex items-center justify-between rounded-[1.5rem] border border-white/10 bg-[color:var(--color-surface)] p-4">
              <div>
                <p className="text-sm font-semibold text-white">{athlete.fullName}</p>
                <p className="mt-1 text-xs uppercase tracking-[0.18em] text-[color:var(--color-text-muted)]">
                  {athlete.level} • {athlete.city}
                </p>
              </div>
              <button
                type="button"
                disabled={!activeSession}
                onClick={async () => {
                  if (!activeSession) {
                    return;
                  }

                  if (!checked) {
                    await onCheckIn({ sessionId: activeSession.id, athleteId: athlete.id });
                  }

                  setCheckedInIds((current) =>
                    checked ? current.filter((id) => id !== athlete.id) : [...current, athlete.id],
                  );
                }}
                className={`rounded-full px-4 py-3 text-xs font-bold uppercase tracking-[0.18em] ${
                  checked
                    ? 'bg-[color:var(--color-success)] text-[color:var(--color-ink)]'
                    : 'border border-white/10 bg-white/5 text-white'
                } disabled:opacity-50`}
              >
                {checked ? 'Registrado' : 'Check-in'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
