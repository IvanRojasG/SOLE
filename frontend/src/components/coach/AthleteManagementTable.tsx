'use client';

import type { Athlete } from '@/types';

type AthleteManagementTableProps = {
  athletes: Athlete[];
  onSelect: (athlete: Athlete) => void;
};

export function AthleteManagementTable({ athletes, onSelect }: AthleteManagementTableProps) {
  if (athletes.length === 0) {
    return (
      <div className="rounded-[2rem] border border-dashed border-white/15 bg-white/5 p-6 text-sm text-[color:var(--color-text-muted)]">
        No hay atletas para gestionar.
      </div>
    );
  }

  return (
    <>
      <div className="hidden overflow-hidden rounded-[2rem] border border-white/10 lg:block">
        <table className="min-w-full bg-[color:var(--color-surface)]">
          <thead className="bg-white/5">
            <tr className="text-left text-xs uppercase tracking-[0.18em] text-[color:var(--color-text-muted)]">
              <th className="px-5 py-4">Atleta</th>
              <th className="px-5 py-4">Nivel</th>
              <th className="px-5 py-4">Puntos</th>
              <th className="px-5 py-4">Asistencia</th>
              <th className="px-5 py-4">Acción</th>
            </tr>
          </thead>
          <tbody>
            {athletes.map((athlete) => (
              <tr key={athlete.id} className="border-t border-white/6 text-sm text-white">
                <td className="px-5 py-4">
                  <p className="font-semibold">{athlete.fullName}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.18em] text-[color:var(--color-text-muted)]">
                    {athlete.city}
                  </p>
                </td>
                <td className="px-5 py-4 uppercase">{athlete.level}</td>
                <td className="px-5 py-4">{athlete.points}</td>
                <td className="px-5 py-4">{athlete.attendanceRate}%</td>
                <td className="px-5 py-4">
                  <button
                    type="button"
                    onClick={() => onSelect(athlete)}
                    className="rounded-full bg-[color:var(--color-primary)] px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-[color:var(--color-ink)]"
                  >
                    Ver detalle
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="grid gap-4 lg:hidden">
        {athletes.map((athlete) => (
          <article key={athlete.id} className="rounded-[1.75rem] border border-white/10 bg-white/5 p-5">
            <p className="text-lg font-semibold text-white">{athlete.fullName}</p>
            <p className="mt-1 text-xs uppercase tracking-[0.18em] text-[color:var(--color-text-muted)]">
              {athlete.level} • {athlete.city}
            </p>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-white/10 p-3 text-sm text-white">{athlete.points} pts</div>
              <div className="rounded-2xl border border-white/10 p-3 text-sm text-white">
                {athlete.attendanceRate}% asistencia
              </div>
            </div>
            <button
              type="button"
              onClick={() => onSelect(athlete)}
              className="mt-4 rounded-full bg-[color:var(--color-primary)] px-4 py-3 text-xs font-bold uppercase tracking-[0.18em] text-[color:var(--color-ink)]"
            >
              Ver detalle
            </button>
          </article>
        ))}
      </div>
    </>
  );
}
