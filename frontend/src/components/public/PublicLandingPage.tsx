import Link from 'next/link';

import { AppContainer } from '@/components/layout/AppContainer';
import { Section } from '@/components/layout/Section';
import { publicSite } from '@/content/publicSite';
import type { Challenge } from '@/types';

import { ChallengeScheduleGallery } from './ChallengeScheduleGallery';
import { MediaCarousel } from './MediaCarousel';
import { PublicSectionHeading } from './PublicSectionHeading';
import { VideoTestimonialsGrid } from './VideoTestimonialsGrid';

type PublicLandingPageProps = {
  activeChallenge: Challenge | null;
};

type TrialClassButtonProps = {
  className?: string;
  tone?: 'light' | 'dark';
};

function getYouTubeEmbedUrl(url: string) {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtube\.com\/shorts\/|youtu\.be\/)([^&?/]+)/);
  return match ? `https://www.youtube.com/embed/${match[1]}` : '';
}

function TrialClassIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-6 w-6" fill="none">
      <path
        d="M5 19.5 6.2 16A7.5 7.5 0 1 1 9 18.1L5 19.5Z"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="2"
      />
      <path
        d="M9 10.2c1.2 2.4 2.4 3.6 4.8 4.8l1.2-1.2"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="2"
      />
    </svg>
  );
}

function TrialClassButton({ className = '', tone = 'light' }: TrialClassButtonProps) {
  const isDark = tone === 'dark';

  return (
    <a
      href={publicSite.contact.trialClassCta.href}
      target="_blank"
      rel="noreferrer"
      className={`group inline-flex w-fit items-center justify-center gap-2.5 rounded-full border px-5 py-3 text-center text-[11px] font-bold uppercase tracking-[0.11em] whitespace-nowrap shadow-[0_18px_42px_rgba(37,211,102,0.24)] transition hover:-translate-y-0.5 hover:shadow-[0_22px_54px_rgba(37,211,102,0.32)] sm:text-xs ${
        isDark
          ? 'border-[#25D366] bg-[#25D366] text-white hover:bg-[#1ebe5d]'
          : 'border-[#25D366] bg-[#25D366] text-white hover:bg-[#1ebe5d]'
      } ${className}`}
    >
      <span
        className={`relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition group-hover:scale-105 ${
          isDark
            ? 'bg-white text-[#128C4A]'
            : 'bg-white/18 text-white ring-1 ring-white/35'
        }`}
      >
        <span className="absolute inset-0 rounded-full bg-white/25 opacity-70 motion-safe:animate-ping" />
        <TrialClassIcon />
      </span>
      <span>{publicSite.contact.trialClassCta.label}</span>
    </a>
  );
}

export function PublicLandingPage({ activeChallenge }: PublicLandingPageProps) {
  const embedUrl = activeChallenge ? getYouTubeEmbedUrl(activeChallenge.youtubeUrl) : '';

  return (
    <>
      <Section className="overflow-hidden bg-[linear-gradient(180deg,#ffffff_0%,#f3f7fb_54%,#ffffff_100%)] pb-20 pt-10 md:pb-28 md:pt-14">
        <AppContainer className="grid items-center gap-10 lg:grid-cols-[1.02fr_0.98fr] lg:gap-14">
          <div>
            <div className="inline-flex items-center gap-3 rounded-full border border-slate-200 bg-white px-4 py-2 shadow-[0_18px_45px_rgba(15,23,42,0.08)]">
              <span className="h-2.5 w-2.5 rounded-full bg-[color:var(--color-secondary)]" />
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
            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:flex-wrap">
              <TrialClassButton />
              <Link
                href={publicSite.hero.ctaPrimary.href}
                className="rounded-full bg-slate-950 px-7 py-4 text-center text-sm font-bold uppercase tracking-[0.18em] text-white shadow-[0_18px_44px_rgba(15,23,42,0.18)] transition hover:bg-[color:var(--color-primary)]"
              >
                {publicSite.hero.ctaPrimary.label}
              </Link>
              <Link
                href={publicSite.hero.ctaSecondary.href}
                className="rounded-full border border-slate-300 bg-white px-7 py-4 text-center text-sm font-bold uppercase tracking-[0.18em] text-slate-900 transition hover:border-[color:var(--color-secondary)] hover:text-[color:var(--color-secondary)]"
              >
                {publicSite.hero.ctaSecondary.label}
              </Link>
            </div>
          </div>

          <MediaCarousel slides={publicSite.gallery} />
        </AppContainer>
      </Section>

      <Section className="bg-white py-14 md:py-20">
        <AppContainer className="sole-card-lift grid gap-8 rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-[0_22px_70px_rgba(15,23,42,0.08)] lg:grid-cols-[0.85fr_1.15fr] lg:p-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[color:var(--color-primary)]">
              WOD actual
            </p>
            {activeChallenge ? (
              <>
                <h2 className="mt-4 font-display text-5xl uppercase leading-[0.92] tracking-[0.04em] text-slate-950">
                  {activeChallenge.title}
                </h2>
                <p className="mt-4 whitespace-pre-line text-base leading-8 text-slate-600">
                  {activeChallenge.summary}
                </p>
                <div className="mt-6 flex flex-wrap gap-2">
                  <span className="rounded-full bg-teal-100 px-3 py-2 text-xs font-bold uppercase tracking-[0.16em] text-teal-800">
                    {activeChallenge.category === 'power_lifting' ? 'Power Lifting' : 'Custom Metcon (Reps)'}
                  </span>
                  <span className="rounded-full bg-slate-100 px-3 py-2 text-xs font-bold uppercase tracking-[0.16em] text-slate-700">
                    {activeChallenge.startDate} · {activeChallenge.endDate}
                  </span>
                </div>
              </>
            ) : (
              <p className="mt-4 text-base leading-8 text-slate-600">
                No hay WOD activo para la fecha actual.
              </p>
            )}
          </div>
          <div className="aspect-video overflow-hidden rounded-[1.25rem] border border-slate-200 bg-slate-950 shadow-[0_20px_60px_rgba(15,23,42,0.14)]">
            {embedUrl ? (
              <iframe
                src={embedUrl}
                title={`Video ${activeChallenge?.title ?? 'WOD'}`}
                className="h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            ) : (
              <div className="flex h-full items-center justify-center px-6 text-center text-sm font-semibold text-white/70">
                Espacio reservado para el video explicativo del WOD.
              </div>
            )}
          </div>
        </AppContainer>
      </Section>

      <Section className="bg-white py-14 md:py-20">
        <AppContainer className="sole-hatch grid gap-10 rounded-[1.5rem] border border-slate-200 bg-white px-5 py-10 shadow-[0_20px_60px_rgba(15,23,42,0.06)] md:grid-cols-[0.9fr_1.1fr] md:px-8 md:py-14">
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
        <AppContainer className="space-y-10">
          <PublicSectionHeading
            eyebrow="Calendario"
            title="Cinco semanas. Un cierre grande."
            body="Cada fecha concentra el WOD, el video registrado y una galeria breve para recorrer el reto con claridad."
            align="center"
          />
          <ChallengeScheduleGallery items={publicSite.schedule} />
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
          <div className="sole-hatch rounded-[1.5rem] bg-slate-950 px-7 py-10 text-white shadow-[0_28px_90px_rgba(2,6,23,0.24)] md:px-10">
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
              <TrialClassButton tone="dark" className="shrink-0" />
            </div>
          </div>
        </AppContainer>
      </Section>
    </>
  );
}
