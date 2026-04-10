import { AppContainer } from '@/components/layout/AppContainer';
import { Section } from '@/components/layout/Section';

const stats = [
  { value: '100', label: 'Atletas proyectados', note: 'Escala pensada para boxes con comunidad activa.' },
  { value: '02', label: 'Coaches líderes', note: 'Validan hitos y protegen la integridad del reto.' },
  { value: '01', label: 'Experiencia central', note: 'Una home que organiza el mensaje antes de los datos.' },
];

export function FeaturedStatsSection() {
  return (
    <Section className="pt-14 md:pt-18">
      <AppContainer className="grid gap-6 md:grid-cols-3">
        {stats.map((stat) => (
          <article
            key={stat.label}
            className="rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))] p-7 shadow-[var(--shadow-soft)]"
          >
            <p className="font-display text-6xl uppercase tracking-[0.1em] text-white">{stat.value}</p>
            <h2 className="mt-5 text-lg font-semibold text-white">{stat.label}</h2>
            <p className="mt-3 text-sm leading-7 text-[color:var(--color-text-muted)]">{stat.note}</p>
          </article>
        ))}
      </AppContainer>
    </Section>
  );
}
