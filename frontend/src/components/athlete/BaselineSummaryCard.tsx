import type { AthleteBaseline } from '@/types';

type BaselineSummaryCardProps = {
  baseline: AthleteBaseline;
};

export function BaselineSummaryCard({ baseline }: BaselineSummaryCardProps) {
  const entriesWithValue = baseline.entries.filter(
    (item) => item.value !== null || item.status !== 'not_started',
  ).length;
  const masteredCount = baseline.entries.filter((item) => item.status === 'mastered').length;
  const totalPRValue = baseline.entries
    .filter((item) => item.metricType === 'weight' && item.value !== null)
    .reduce((sum, item) => sum + (item.value ?? 0), 0);

  return (
    <article className="rounded-[2rem] border border-white/10 bg-[color:var(--color-surface)] p-6">
      <p className="text-xs uppercase tracking-[0.22em] text-[color:var(--color-primary-soft)]">
        Resumen baseline
      </p>
      <div className="mt-6 grid gap-3">
        <div className="rounded-[1.5rem] border border-white/10 p-4">
          <p className="text-[11px] uppercase tracking-[0.18em] text-[color:var(--color-text-muted)]">Estado</p>
          <p className="mt-2 text-lg font-semibold text-white">
            {baseline.locked ? 'Bloqueado' : 'Editable'}
          </p>
        </div>
        <div className="rounded-[1.5rem] border border-white/10 p-4">
          <p className="text-[11px] uppercase tracking-[0.18em] text-[color:var(--color-text-muted)]">Entradas registradas</p>
          <p className="mt-2 text-lg font-semibold text-white">
            {entriesWithValue}/{baseline.entries.length}
          </p>
        </div>
        <div className="rounded-[1.5rem] border border-white/10 p-4">
          <p className="text-[11px] uppercase tracking-[0.18em] text-[color:var(--color-text-muted)]">Carga total RM</p>
          <p className="mt-2 text-lg font-semibold text-white">{totalPRValue}</p>
        </div>
        <div className="rounded-[1.5rem] border border-white/10 p-4">
          <p className="text-[11px] uppercase tracking-[0.18em] text-[color:var(--color-text-muted)]">Skills dominadas</p>
          <p className="mt-2 text-lg font-semibold text-white">{masteredCount}</p>
        </div>
      </div>
    </article>
  );
}
