import type { ChallengeManagementItem } from '@/types';

type ChallengeManagementGridProps = {
  items: ChallengeManagementItem[];
  onEdit: (item: ChallengeManagementItem) => void;
  onCreate: () => void;
};

export function ChallengeManagementGrid({ items, onEdit, onCreate }: ChallengeManagementGridProps) {
  if (items.length === 0) {
    return (
      <div className="rounded-[2rem] border border-dashed border-white/15 bg-white/5 p-6 text-sm text-[color:var(--color-text-muted)]">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p>No hay retos configurados.</p>
          <button
            type="button"
            onClick={onCreate}
            className="rounded-full bg-[color:var(--color-primary)] px-5 py-3 text-xs font-bold uppercase tracking-[0.18em] text-[color:var(--color-ink)]"
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
          <p className="text-xs uppercase tracking-[0.2em] text-[color:var(--color-text-muted)]">
            Biblioteca de retos
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-white">Gestiona y crea nuevos challenges</h2>
          <p className="mt-2 max-w-2xl text-sm leading-7 text-[color:var(--color-text-muted)]">
            Los cards ahora priorizan lectura y selección. La creación persiste `title` y `points`;
            el resto del contenido sigue siendo visual mientras el backend se expande.
          </p>
        </div>
        <button
          type="button"
          onClick={onCreate}
          className="rounded-full bg-[color:var(--color-primary)] px-5 py-3 text-xs font-bold uppercase tracking-[0.18em] text-[color:var(--color-ink)]"
        >
          Nuevo reto
        </button>
      </div>

      <div className="grid gap-5 lg:grid-cols-2 lg:gap-6">
        {items.map((item) => (
          <article
            key={item.id}
            className="flex min-h-[19rem] flex-col rounded-[1.9rem] border border-white/10 bg-white/5 p-6 shadow-[var(--shadow-soft)]"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="text-xs uppercase tracking-[0.18em] text-[color:var(--color-primary-soft)]">
                  {item.category}
                </p>
                <h3 className="mt-3 text-xl font-semibold text-white">{item.title}</h3>
              </div>
              <span
                className={`shrink-0 rounded-full px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] ${
                  item.isActive
                    ? 'bg-[color:var(--color-success)]/15 text-[color:var(--color-success)]'
                    : 'bg-white/10 text-[color:var(--color-text-muted)]'
                }`}
              >
                {item.isActive ? 'Activo' : 'Inactivo'}
              </span>
            </div>
            <p className="mt-4 flex-1 text-sm leading-7 text-[color:var(--color-text-muted)]">
              {item.summary}
            </p>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-white/10 p-3">
                <p className="text-[11px] uppercase tracking-[0.18em] text-[color:var(--color-text-muted)]">
                  Puntos
                </p>
                <p className="mt-2 text-lg font-semibold text-white">{item.points}</p>
              </div>
              <div className="rounded-2xl border border-white/10 p-3">
                <p className="text-[11px] uppercase tracking-[0.18em] text-[color:var(--color-text-muted)]">
                  Ventana
                </p>
                <p className="mt-2 text-sm font-semibold text-white">{item.windowLabel}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => onEdit(item)}
              className="mt-6 rounded-full bg-[color:var(--color-primary)] px-4 py-3 text-xs font-bold uppercase tracking-[0.18em] text-[color:var(--color-ink)]"
            >
              Editar
            </button>
          </article>
        ))}
      </div>
    </div>
  );
}
