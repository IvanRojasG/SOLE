import { AppContainer } from '@/components/layout/AppContainer';
import { Section } from '@/components/layout/Section';

const steps = [
  {
    title: 'Registro limpio',
    copy: 'El atleta entra al reto con una identidad clara y un perfil deportivo definido.',
  },
  {
    title: 'Baseline controlado',
    copy: 'Se cargan PRs y skills una sola vez para fijar un punto de partida confiable.',
  },
  {
    title: 'Acciones validadas',
    copy: 'Resultados y logros pasan por control de coach antes de impactar el ranking.',
  },
  {
    title: 'Progreso visible',
    copy: 'La interfaz traduce disciplina en lectura rápida: quién avanza, cómo y cuánto.',
  },
];

export function HowItWorksSection() {
  return (
    <Section id="proceso" className="pt-14 md:pt-20">
      <AppContainer className="grid gap-10 lg:grid-cols-[0.84fr_1.16fr] lg:gap-12">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[color:var(--color-primary-soft)]">
            How it works
          </p>
          <h2 className="mt-4 font-display text-5xl uppercase tracking-[0.08em] text-white">
            Sistema claro,
            <span className="block text-[color:var(--color-secondary)]">esfuerzo visible</span>
          </h2>
        </div>
        <div className="grid gap-5">
          {steps.map((step, index) => (
            <article
              key={step.title}
              className="grid gap-4 rounded-[1.75rem] border border-white/10 bg-white/5 p-6 md:grid-cols-[82px_1fr]"
            >
              <div className="font-display text-5xl uppercase tracking-[0.08em] text-[color:var(--color-accent)]">
                0{index + 1}
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white">{step.title}</h3>
                <p className="mt-3 text-sm leading-7 text-[color:var(--color-text-muted)]">
                  {step.copy}
                </p>
              </div>
            </article>
          ))}
        </div>
      </AppContainer>
    </Section>
  );
}
