import Link from 'next/link';

import { AppContainer } from '@/components/layout/AppContainer';
import { Section } from '@/components/layout/Section';

export function CTASection() {
  return (
    <Section id="cta" className="pt-12 md:pt-18">
      <AppContainer>
        <div className="overflow-hidden rounded-[2.25rem] border border-white/10 bg-[linear-gradient(135deg,rgba(0,92,255,0.28),rgba(8,17,27,0.94)_42%,rgba(207,224,255,0.24))] p-8 shadow-[var(--shadow-glow)] md:p-12 lg:p-14">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[color:var(--color-primary-soft)]">
            Base preparada
          </p>
          <h2 className="mt-4 max-w-3xl font-display text-5xl uppercase tracking-[0.08em] text-white md:text-6xl">
            Diseño listo para crecer hacia producto real.
          </h2>
          <p className="mt-6 max-w-2xl text-sm leading-7 text-[color:var(--color-text-muted)] md:text-base">
            La estructura visual ya separa branding, tokens, layout y secciones. El siguiente paso es
            conectar catálogos, autenticación y estado sin rehacer la experiencia pública.
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Link
              href="#inicio"
              className="rounded-full bg-white px-7 py-4 text-center text-sm font-bold uppercase tracking-[0.18em] text-[color:var(--color-ink)] transition hover:bg-[color:var(--color-primary-soft)]"
            >
              Volver arriba
            </Link>
            <Link
              href="#proceso"
              className="rounded-full border border-white/20 bg-white/5 px-7 py-4 text-center text-sm font-bold uppercase tracking-[0.18em] text-white transition hover:bg-white/10"
            >
              Revisar estructura
            </Link>
          </div>
        </div>
      </AppContainer>
    </Section>
  );
}
