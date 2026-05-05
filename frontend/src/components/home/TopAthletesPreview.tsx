import { AppContainer } from '@/components/layout/AppContainer';
import { Section } from '@/components/layout/Section';

const previewAthletes = [
  { rank: '01', name: 'Atleta Alpha', focus: 'Consistency streak', accent: 'from-[color:var(--color-primary)] to-[color:var(--color-accent)]' },
  { rank: '02', name: 'Atleta Pulse', focus: 'Heavy lifts rise', accent: 'from-[color:var(--color-secondary)] to-[color:var(--color-primary)]' },
  { rank: '03', name: 'Atleta Vector', focus: 'Gymnastics breakthrough', accent: 'from-[color:var(--color-accent)] to-[color:var(--color-secondary)]' },
];

export function TopAthletesPreview() {
  return (
    <Section id="atletas" className="pt-14 md:pt-20">
      <AppContainer>
        <div className="mb-10 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[color:var(--color-primary-soft)]">
              Preview visual
            </p>
            <h2 className="mt-3 font-display text-5xl uppercase tracking-[0.08em] text-white">
              Top atletas
            </h2>
          </div>
          <p className="max-w-xl text-sm leading-7 text-[color:var(--color-text-muted)]">
            Esta sección es intencionalmente visual. No hay datos reales conectados todavía, pero ya
            define el lenguaje de liderazgo y competencia.
          </p>
        </div>
        <div className="grid gap-6 lg:grid-cols-[1.15fr_0.92fr_0.92fr]">
          {previewAthletes.map((athlete, index) => (
            <article
              key={athlete.name}
              className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[color:var(--color-card)] p-7"
            >
              <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${athlete.accent}`} />
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-display text-6xl uppercase tracking-[0.1em] text-white">
                    {athlete.rank}
                  </p>
                  <h3 className="mt-5 text-2xl font-semibold text-white">{athlete.name}</h3>
                  <p className="mt-2 text-sm uppercase tracking-[0.18em] text-[color:var(--color-text-muted)]">
                    {athlete.focus}
                  </p>
                </div>
                <div className="rounded-full border border-white/10 px-3 py-2 text-xs uppercase tracking-[0.2em] text-[color:var(--color-primary-soft)]">
                  {index === 0 ? 'Leader' : 'Chaser'}
                </div>
              </div>
              <div className="mt-12 grid grid-cols-3 gap-3">
                {['PR', 'Skill', 'WODs'].map((label, metricIndex) => (
                  <div key={label} className="rounded-2xl border border-white/10 bg-black/10 p-4">
                    <p className="font-display text-3xl uppercase tracking-[0.08em] text-white">
                      {92 - index * 7 - metricIndex * 4}
                    </p>
                    <p className="mt-2 text-[11px] uppercase tracking-[0.22em] text-[color:var(--color-text-muted)]">
                      {label}
                    </p>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      </AppContainer>
    </Section>
  );
}
