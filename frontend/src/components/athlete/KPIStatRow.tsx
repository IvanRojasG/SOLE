import type { DashboardKPI } from '@/types';

type KPIStatRowProps = {
  items: DashboardKPI[];
};

export function KPIStatRow({ items }: KPIStatRowProps) {
  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => (
        <article
          key={item.id}
          className={`rounded-[1.7rem] border border-white/10 p-5 ${
            item.tone === 'primary'
              ? 'bg-[color:var(--color-primary)]/12'
              : item.tone === 'secondary'
                ? 'bg-[color:var(--color-secondary)]/12'
                : 'bg-white/5'
          }`}
        >
          <p className="text-xs uppercase tracking-[0.2em] text-[color:var(--color-text-muted)]">
            {item.label}
          </p>
          <p className="mt-4 font-display text-5xl uppercase tracking-[0.08em] text-white">
            {item.value}
          </p>
        </article>
      ))}
    </section>
  );
}
