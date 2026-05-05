import { AppContainer } from '@/components/layout/AppContainer';
import { Section } from '@/components/layout/Section';

export function ChallengePreviewSection() {
  return (
    <Section id="reto" className="pt-14 md:pt-20">
      <AppContainer className="grid gap-8 lg:grid-cols-[0.88fr_1.12fr] lg:gap-10">
        <div className="rounded-[2rem] border border-white/10 bg-[color:var(--color-surface)] p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[color:var(--color-secondary-soft)]">
            Challenge focus
          </p>
          <h2 className="mt-4 font-display text-5xl uppercase tracking-[0.08em] text-white">
            Momentum Month
          </h2>
          <p className="mt-5 text-sm leading-7 text-[color:var(--color-text-muted)]">
            Un reto visualmente presentado como una campaña deportiva. Cada atleta sabe qué registrar,
            cómo se valida y dónde se refleja el progreso.
          </p>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {[
            ['01', 'Baseline', 'Carga inicial de marcas y skills.'],
            ['02', 'Validación', 'Coaches validan resultados y aprobaciones.'],
            ['03', 'Ranking', 'El progreso se vuelve visible y competitivo.'],
          ].map(([step, title, copy]) => (
            <article
              key={title}
              className="rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(31,182,170,0.08),rgba(255,255,255,0.03))] p-7"
            >
              <p className="font-display text-5xl uppercase tracking-[0.08em] text-[color:var(--color-primary)]">
                {step}
              </p>
              <h3 className="mt-5 text-xl font-semibold text-white">{title}</h3>
              <p className="mt-3 text-sm leading-7 text-[color:var(--color-text-muted)]">{copy}</p>
            </article>
          ))}
        </div>
      </AppContainer>
    </Section>
  );
}
