import type { ChallengeManagementItem } from '@/types';

type ChallengeManagementGridProps = {
  items: ChallengeManagementItem[];
  onEdit: (item: ChallengeManagementItem) => void;
  onFinalize: (item: ChallengeManagementItem) => void;
  onCreate: () => void;
};

function getTodayValue() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function ChallengeManagementGrid({
  items,
  onEdit,
  onFinalize,
  onCreate,
}: ChallengeManagementGridProps) {
  const today = getTodayValue();

  if (items.length === 0) {
    return (
      <div className="rounded-[2rem] border border-dashed border-white/15 bg-white/5 p-6 text-sm text-[color:var(--color-text-muted)]">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p>No hay retos configurados.</p>
          <button
            type="button"
            onClick={onCreate}
            className="rounded-full bg-[color:var(--color-primary)] px-5 py-3 text-xs font-bold tracking-[0.18em] text-white uppercase"
          >
            Crear reto
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 rounded-[1.9rem] border border-white/10 bg-white/5 p-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs tracking-[0.2em] text-[color:var(--color-text-muted)] uppercase">
            Biblioteca de retos
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-white">
            Gestiona y crea WODs
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-7 text-[color:var(--color-text-muted)]">
            Cada WOD tiene categoría, ventana real de registro y video
            explicativo.
          </p>
        </div>
        <button
          type="button"
          onClick={onCreate}
          className="rounded-full bg-[color:var(--color-primary)] px-5 py-3 text-xs font-bold tracking-[0.18em] text-white uppercase"
        >
          Nuevo reto
        </button>
      </div>

      <div className="grid gap-5 lg:grid-cols-2 lg:gap-6">
        {items.map((item) => {
          const isClosed = today > item.endDate;

          return (
            <article
              key={item.id}
              className="flex min-h-[19rem] flex-col rounded-[1.9rem] border border-white/10 bg-white/5 p-6 shadow-[var(--shadow-soft)]"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-xs tracking-[0.18em] text-[color:var(--color-primary-soft)] uppercase">
                    {item.category}
                  </p>
                  <h3 className="mt-3 text-xl font-semibold text-white">
                    {item.title}
                  </h3>
                </div>
                <span
                  className={`shrink-0 rounded-full px-3 py-2 text-[11px] font-semibold tracking-[0.18em] uppercase ${
                    item.isActive
                      ? 'bg-[color:var(--color-success)]/15 text-[color:var(--color-success)]'
                      : 'bg-white/10 text-[color:var(--color-text-muted)]'
                  }`}
                >
                  {item.isActive ? 'Activo' : 'Inactivo'}
                </span>
              </div>
              <p className="mt-4 flex-1 text-sm leading-7 whitespace-pre-line text-[color:var(--color-text-muted)]">
                {item.summary}
              </p>
              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-white/10 p-3">
                  <p className="text-[11px] tracking-[0.18em] text-[color:var(--color-text-muted)] uppercase">
                    Categoría
                  </p>
                  <p className="mt-2 text-sm font-semibold text-white">
                    {item.category === 'power_lifting'
                      ? 'Power Lifting'
                      : 'Custom Metcon (Reps)'}
                  </p>
                </div>
                <div className="rounded-2xl border border-white/10 p-3">
                  <p className="text-[11px] tracking-[0.18em] text-[color:var(--color-text-muted)] uppercase">
                    Ventana
                  </p>
                  <p className="mt-2 text-sm font-semibold text-white">
                    {item.startDate} · {item.endDate}
                  </p>
                </div>
              </div>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => onEdit(item)}
                  className="rounded-full bg-[color:var(--color-primary)] px-4 py-3 text-xs font-bold tracking-[0.18em] text-white uppercase"
                >
                  Editar
                </button>
                <button
                  type="button"
                  onClick={() => onFinalize(item)}
                  disabled={!isClosed}
                  className={`rounded-full border px-4 py-3 text-xs font-bold tracking-[0.18em] uppercase transition ${
                    isClosed
                      ? 'border-slate-950 bg-slate-950 text-white shadow-[0_14px_32px_rgba(15,23,42,0.18)] hover:border-[color:var(--color-primary)] hover:bg-[color:var(--color-primary)]'
                      : 'cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400'
                  }`}
                >
                  Recalcular ranking
                </button>
              </div>
              {!isClosed ? (
                <p className="mt-3 text-xs text-[color:var(--color-text-muted)]">
                  Solo disponible después de la fecha de cierre.
                </p>
              ) : null}
            </article>
          );
        })}
      </div>
    </div>
  );
}
