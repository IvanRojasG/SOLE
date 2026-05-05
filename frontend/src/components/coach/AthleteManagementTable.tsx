'use client';

import type { Athlete } from '@/types';

type AthleteManagementTableProps = {
  athletes: Athlete[];
};

export function AthleteManagementTable({
  athletes,
}: AthleteManagementTableProps) {
  if (athletes.length === 0) {
    return (
      <div className="rounded-[2rem] border border-dashed border-white/15 bg-white/5 p-6 text-sm text-[color:var(--color-text-muted)]">
        No hay atletas para gestionar.
      </div>
    );
  }

  return (
    <>
      <div className="hidden overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_24px_70px_rgba(15,23,42,0.08)] lg:block">
        <table className="min-w-full">
          <thead className="bg-slate-950">
            <tr className="text-left text-xs tracking-[0.18em] text-white/70 uppercase">
              <th className="px-5 py-4">Atleta</th>
              <th className="px-5 py-4">Nivel</th>
              <th className="px-5 py-4">Puntos</th>
              <th className="px-5 py-4">Logros</th>
              <th className="px-5 py-4">Baseline</th>
              <th className="px-5 py-4">Enfoque</th>
            </tr>
          </thead>
          <tbody>
            {athletes.map((athlete) => (
              <tr
                key={athlete.id}
                className="border-t border-slate-200 text-sm text-slate-800"
              >
                <td className="px-5 py-4">
                  <p className="font-semibold text-slate-950">{athlete.fullName}</p>
                </td>
                <td className="px-5 py-4">
                  <span className="rounded-full bg-cyan-100 px-3 py-1 text-xs font-bold tracking-[0.14em] text-cyan-800 uppercase">
                    {athlete.level}
                  </span>
                </td>
                <td className="px-5 py-4 font-semibold text-slate-950">
                  {athlete.points}
                </td>
                <td className="px-5 py-4">
                  <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">
                    {athlete.achievementsApproved}
                  </span>
                </td>
                <td className="px-5 py-4 text-slate-600">
                  {athlete.tagline}
                </td>
                <td className="px-5 py-4">
                  <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-900">
                    {athlete.favoriteFocus}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="grid gap-4 lg:hidden">
        {athletes.map((athlete) => (
          <article
            key={athlete.id}
            className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-[0_20px_52px_rgba(15,23,42,0.1)]"
          >
            <p className="text-lg font-semibold text-slate-950">
              {athlete.fullName}
            </p>
            <p className="mt-1 text-xs tracking-[0.18em] text-cyan-700 uppercase">
              {athlete.level}
            </p>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-blue-100 bg-blue-50 p-3 text-sm font-semibold text-blue-900">
                {athlete.points} puntos
              </div>
              <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-3 text-sm font-semibold text-emerald-900">
                {athlete.achievementsApproved} logros
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
                {athlete.tagline}
              </div>
              <div className="rounded-2xl border border-amber-100 bg-amber-50 p-3 text-sm font-semibold text-amber-900">
                {athlete.favoriteFocus}
              </div>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
