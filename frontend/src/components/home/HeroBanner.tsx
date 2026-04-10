import Link from 'next/link';

import { brand } from '@/lib/config/brand';

import { AppContainer } from '@/components/layout/AppContainer';
import { Section } from '@/components/layout/Section';

export function HeroBanner() {
  return (
    <Section id="inicio" className="overflow-hidden pb-14 pt-10 md:pb-20 md:pt-14">
      <AppContainer className="grid items-end gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:gap-14 xl:gap-20">
        <div className="relative">
          <div className="absolute -left-10 top-4 h-24 w-24 rounded-full bg-[color:var(--color-secondary)]/16 blur-3xl" />
          <div className="absolute left-24 top-28 h-28 w-28 rounded-full bg-[color:var(--color-primary)]/25 blur-3xl" />
          <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 shadow-[var(--shadow-soft)]">
            <span className="h-2.5 w-2.5 rounded-full bg-[color:var(--color-primary)]" />
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[color:var(--color-secondary-soft)]">
              Reto mensual de rendimiento
            </p>
          </div>
          <h1 className="mt-6 max-w-4xl font-display text-5xl uppercase leading-[0.9] tracking-[0.04em] text-white sm:text-6xl lg:text-7xl xl:text-8xl">
            Construye
            <span className="block text-[color:var(--color-primary-soft)]">tracción.</span>
            <span className="block text-[color:var(--color-primary)]">Mide progreso.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-[color:var(--color-text-muted)] lg:text-lg">
            {brand.description} La interfaz enfatiza claridad competitiva, seguimiento estructurado y
            una lectura inmediata del rendimiento del box.
          </p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Link
              href="#reto"
              className="rounded-full bg-[color:var(--color-primary)] px-7 py-4 text-center text-sm font-bold uppercase tracking-[0.18em] text-[color:var(--color-text)] transition hover:bg-[color:var(--color-primary-soft)]"
            >
              {brand.cta.primary}
            </Link>
            <Link
              href="#proceso"
              className="rounded-full border border-white/15 bg-white/5 px-7 py-4 text-center text-sm font-bold uppercase tracking-[0.18em] text-white transition hover:border-white/30 hover:bg-white/10"
            >
              {brand.cta.secondary}
            </Link>
          </div>
        </div>

        <div className="relative">
          <div className="absolute inset-x-6 top-10 h-24 rounded-full bg-[color:var(--color-primary)]/25 blur-3xl" />
          <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(160deg,rgba(0,92,255,0.24),rgba(10,27,70,0.96)_46%,rgba(250,250,250,0.08))] p-6 shadow-[var(--shadow-glow)] sm:p-7 lg:p-8">
            <div className="absolute inset-0 bg-[linear-gradient(120deg,transparent,rgba(250,250,250,0.03),transparent)]" />
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-[color:var(--color-secondary-soft)]">
                  Sole Command Center
                </p>
                <p className="mt-3 font-display text-5xl uppercase tracking-[0.1em] text-white">
                  30
                </p>
                <p className="text-sm text-[color:var(--color-text-muted)]">días de ejecución medible</p>
              </div>
              <div className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs uppercase tracking-[0.22em] text-white">
                Abril
              </div>
            </div>
            <div className="mt-12 grid gap-4 sm:grid-cols-3">
              {[
                ['100', 'Atletas objetivo'],
                ['2', 'Coaches validadores'],
                ['1', 'Ranking central'],
              ].map(([value, label]) => (
                <div key={label} className="rounded-3xl border border-white/10 bg-[rgba(250,250,250,0.05)] p-4">
                  <p className="font-display text-4xl uppercase tracking-[0.08em] text-white">{value}</p>
                  <p className="mt-2 text-xs uppercase tracking-[0.2em] text-[color:var(--color-text-muted)]">
                    {label}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-10 rounded-[1.5rem] border border-white/10 bg-[rgba(6,21,47,0.66)] p-5">
              <div className="flex items-center justify-between">
                <p className="text-xs uppercase tracking-[0.24em] text-[color:var(--color-secondary-soft)]">
                  Pulso del reto
                </p>
                <p className="text-xs uppercase tracking-[0.24em] text-white">Listo para datos</p>
              </div>
              <div className="mt-4 h-3 overflow-hidden rounded-full bg-white/10">
                <div className="h-full w-[72%] rounded-full bg-[linear-gradient(90deg,var(--color-secondary),var(--color-primary),#fafafa)]" />
              </div>
              <div className="mt-4 flex justify-between text-xs uppercase tracking-[0.18em] text-[color:var(--color-text-muted)]">
                <span>Fase visual</span>
                <span>72%</span>
              </div>
            </div>
          </div>
        </div>
      </AppContainer>
    </Section>
  );
}
