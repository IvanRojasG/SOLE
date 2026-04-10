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
          className="rounded-[1.75rem] border border-white/10 bg-[linear-gradient(180deg,rgba(250,250,250,0.06),rgba(255,255,255,0.02))] p-5 shadow-[var(--shadow-soft)]"
        >
          <p className="text-xs uppercase tracking-[0.18em] text-[color:var(--color-secondary-soft)]">
            {item.label}
          </p>
          <p className="mt-4 font-display text-5xl uppercase leading-none tracking-[0.06em] text-white">
            {item.value}
          </p>
          <div className="mt-4 h-1.5 rounded-full bg-white/8">
            <div className="h-full w-[68%] rounded-full bg-[linear-gradient(90deg,var(--color-primary),var(--color-secondary))]" />
          </div>
        </article>
      ))}
    </section>
  );
}
