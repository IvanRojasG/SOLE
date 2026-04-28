import Link from 'next/link';

import { AppContainer } from '@/components/layout/AppContainer';
import { Section } from '@/components/layout/Section';
import { publicSite } from '@/content/publicSite';

import { MediaCarousel } from './MediaCarousel';
import { PublicSectionHeading } from './PublicSectionHeading';
import { VideoTestimonialsGrid } from './VideoTestimonialsGrid';

export function PublicLandingPage() {
  return (
    <>
      <Section className="overflow-hidden bg-[linear-gradient(180deg,#ffffff_0%,#f4f8ff_54%,#ffffff_100%)] pb-20 pt-10 md:pb-28 md:pt-14">
        <AppContainer className="grid items-center gap-10 lg:grid-cols-[1.02fr_0.98fr] lg:gap-14">
          <div>
            <div className="inline-flex items-center gap-3 rounded-full border border-sky-100 bg-white px-4 py-2 shadow-[0_18px_45px_rgba(15,23,42,0.08)]">
              <span className="h-2.5 w-2.5 rounded-full bg-[color:var(--color-primary)]" />
              <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-700">
                {publicSite.hero.eyebrow}
              </p>
            </div>
            <h1 className="mt-8 font-display text-6xl uppercase leading-[0.88] tracking-[0.03em] text-slate-950 sm:text-7xl lg:text-8xl">
              {publicSite.hero.title}
              <span className="mt-2 block text-[color:var(--color-primary)]">
                {publicSite.hero.subtitle}
              </span>
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-600 lg:text-lg">
              {publicSite.hero.summary}
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link
                href={publicSite.hero.ctaPrimary.href}
                className="rounded-full bg-[color:var(--color-primary)] px-7 py-4 text-center text-sm font-bold uppercase tracking-[0.18em] text-white transition hover:bg-[#0f6bff]"
              >
                {publicSite.hero.ctaPrimary.label}
              </Link>
              <Link
                href={publicSite.hero.ctaSecondary.href}
                className="rounded-full border border-slate-200 bg-white px-7 py-4 text-center text-sm font-bold uppercase tracking-[0.18em] text-slate-900 transition hover:border-[color:var(--color-primary)] hover:text-[color:var(--color-primary)]"
              >
                {publicSite.hero.ctaSecondary.label}
              </Link>
            </div>
          </div>

          <MediaCarousel slides={publicSite.gallery} />
        </AppContainer>
      </Section>

      <Section className="bg-white py-14 md:py-20">
        <AppContainer className="grid gap-10 rounded-[2rem] border border-slate-200 bg-white px-5 py-10 shadow-[0_20px_60px_rgba(15,23,42,0.06)] md:grid-cols-[0.9fr_1.1fr] md:px-8 md:py-14">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[color:var(--color-primary)]">
              The Challenge
            </p>
            <h2 className="mt-4 font-display text-5xl uppercase leading-[0.92] tracking-[0.04em] text-slate-950 md:text-6xl">
              {publicSite.intro.title}
            </h2>
          </div>
          <div className="space-y-6">
            <p className="text-base leading-8 text-slate-600 md:text-lg">{publicSite.intro.body}</p>
            <p className="text-xs uppercase tracking-[0.24em] text-slate-500">{publicSite.intro.caption}</p>
          </div>
        </AppContainer>
      </Section>

      <Section className="bg-[linear-gradient(180deg,#ffffff,#f7fbff)] py-14 md:py-20">
        <AppContainer className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <PublicSectionHeading
            eyebrow="Calendario"
            title="Cinco semanas. Un cierre grande."
            body="La estructura del reto ya queda visible desde la portada para que la propuesta venda claridad antes de entrar al detalle."
          />
          <div className="grid gap-4 sm:grid-cols-2">
            {publicSite.schedule.map((item) => (
              <article
                key={item.label}
                className="rounded-[1.5rem] border border-slate-300/80 bg-white/95 p-5 shadow-[0_18px_46px_rgba(15,23,42,0.08)]"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[color:var(--color-primary)]">
                  {item.label}
                </p>
                <p className="mt-4 text-xl font-semibold text-slate-950">{item.value}</p>
              </article>
            ))}
          </div>
        </AppContainer>
      </Section>

      <Section className="bg-[linear-gradient(180deg,#f7fbff,#ffffff)] py-16 md:py-24">
        <AppContainer className="space-y-10">
          <PublicSectionHeading
            eyebrow="Testimonials"
            title={publicSite.testimonials.title}
            body={publicSite.testimonials.body}
            align="center"
          />
          <VideoTestimonialsGrid videos={publicSite.testimonials.videos} />
        </AppContainer>
      </Section>

      <Section className="bg-white py-16 md:py-24">
        <AppContainer>
          <div className="rounded-[2.25rem] bg-slate-950 px-7 py-10 text-white shadow-[0_28px_90px_rgba(2,6,23,0.24)] md:px-10">
            <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[color:var(--color-primary-soft)]">
              Contacto
            </p>
            <div className="mt-4 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl">
                <h2 className="font-display text-5xl uppercase leading-[0.94] tracking-[0.04em]">
                  {publicSite.contact.title}
                </h2>
                <p className="mt-4 text-base leading-8 text-slate-300">{publicSite.contact.body}</p>
              </div>
              <Link
                href={publicSite.contact.primaryCta.href}
                className="rounded-full bg-white px-7 py-4 text-center text-sm font-bold uppercase tracking-[0.18em] text-slate-950 transition hover:bg-slate-100"
              >
                {publicSite.contact.primaryCta.label}
              </Link>
            </div>
          </div>
        </AppContainer>
      </Section>
    </>
  );
}
