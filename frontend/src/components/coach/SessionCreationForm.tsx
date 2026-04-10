'use client';

import { useState } from 'react';

import type { AttendanceSessionRecord } from '@/types';

type SessionCreationFormProps = {
  onCreate: (session: AttendanceSessionRecord) => void;
};

export function SessionCreationForm({ onCreate }: SessionCreationFormProps) {
  const [title, setTitle] = useState('Noon Performance');
  const [sessionDate, setSessionDate] = useState('2026-04-30');
  const [totalExpected, setTotalExpected] = useState(14);

  return (
    <form
      className="rounded-[2rem] border border-white/10 bg-white/5 p-6"
      onSubmit={(event) => {
        event.preventDefault();
        onCreate({
          id: `session-${Date.now()}`,
          title,
          sessionDate,
          totalExpected,
          checkedInCount: 0,
        });
      }}
    >
      <p className="text-xs uppercase tracking-[0.22em] text-[color:var(--color-secondary-soft)]">
        Crear sesión
      </p>
      <div className="mt-6 grid gap-5 md:grid-cols-3">
        <input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          className="rounded-2xl border border-white/10 bg-[color:var(--color-surface)] px-4 py-3 text-sm text-white outline-none"
        />
        <input
          type="date"
          value={sessionDate}
          onChange={(event) => setSessionDate(event.target.value)}
          className="rounded-2xl border border-white/10 bg-[color:var(--color-surface)] px-4 py-3 text-sm text-white outline-none"
        />
        <input
          type="number"
          value={totalExpected}
          onChange={(event) => setTotalExpected(Number(event.target.value))}
          className="rounded-2xl border border-white/10 bg-[color:var(--color-surface)] px-4 py-3 text-sm text-white outline-none"
        />
      </div>
      <button
        type="submit"
        className="mt-6 rounded-full bg-[color:var(--color-primary)] px-5 py-3 text-xs font-bold uppercase tracking-[0.18em] text-[color:var(--color-ink)]"
      >
        Crear sesión
      </button>
    </form>
  );
}
