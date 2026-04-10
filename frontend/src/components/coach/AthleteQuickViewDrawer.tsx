'use client';

import type { Athlete } from '@/types';

type AthleteQuickViewDrawerProps = {
  athlete: Athlete | null;
  open: boolean;
  onClose: () => void;
};

export function AthleteQuickViewDrawer({ athlete, open, onClose }: AthleteQuickViewDrawerProps) {
  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-black/60 transition-opacity ${open ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
        onClick={onClose}
      />
      <aside
        className={`fixed right-0 top-0 z-50 h-full w-[92vw] max-w-md border-l border-white/10 bg-[color:var(--color-surface)] p-6 shadow-[var(--shadow-lift)] transition-transform ${open ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {athlete ? (
          <>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-[color:var(--color-primary-soft)]">
                  Quick view
                </p>
                <h2 className="mt-3 text-2xl font-semibold text-white">{athlete.fullName}</h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-full border border-white/10 px-3 py-2 text-xs uppercase tracking-[0.18em] text-white"
              >
                Cerrar
              </button>
            </div>
            <div className="mt-8 space-y-4">
              {[
                ['Nivel', athlete.level],
                ['Ciudad', athlete.city],
                ['Puntos', String(athlete.points)],
                ['Asistencia', `${athlete.attendanceRate}%`],
                ['Logros aprobados', String(athlete.achievementsApproved)],
                ['Enfoque', athlete.favoriteFocus],
              ].map(([label, value]) => (
                <div key={label} className="rounded-[1.5rem] border border-white/10 p-4">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-[color:var(--color-text-muted)]">
                    {label}
                  </p>
                  <p className="mt-2 text-base font-semibold text-white">{value}</p>
                </div>
              ))}
            </div>
          </>
        ) : null}
      </aside>
    </>
  );
}
