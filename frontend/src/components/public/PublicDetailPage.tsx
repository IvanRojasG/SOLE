import Link from 'next/link';

import { AppContainer } from '@/components/layout/AppContainer';
import { Section } from '@/components/layout/Section';

import { PublicSectionHeading } from './PublicSectionHeading';

type PublicDetailPageProps = {
  eyebrow: string;
  title: string;
  intro: string;
  cards: readonly {
    title: string;
    body: string;
  }[];
  cta?: {
    label: string;
    href: string;
  };
};

export function PublicDetailPage({
  eyebrow,
  title,
  intro,
  cards,
  cta,
}: PublicDetailPageProps) {
  return (
    <Section className="bg-[linear-gradient(180deg,#ffffff_0%,#f4f8fb_100%)]">
      <AppContainer className="space-y-10">
        <PublicSectionHeading eyebrow={eyebrow} title={title} body={intro} />
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {cards.map((card) => (
            <article
              key={card.title}
              className="sole-card-lift rounded-[1.25rem] border border-slate-300/80 bg-white/95 p-6 shadow-[0_20px_52px_rgba(15,23,42,0.08)]"
            >
              <div className="mb-5 h-1.5 w-12 rounded-full bg-[color:var(--color-secondary)]" />
              <h3 className="text-lg font-semibold text-slate-950">{card.title}</h3>
              <p className="mt-4 text-sm leading-7 text-slate-600">{card.body}</p>
            </article>
          ))}
        </div>
        {cta ? (
          <div className="flex justify-start">
            <Link
              href={cta.href}
              className="rounded-full bg-slate-950 px-7 py-4 text-sm font-bold uppercase tracking-[0.18em] text-white shadow-[0_18px_44px_rgba(15,23,42,0.18)] transition hover:bg-[color:var(--color-primary)]"
            >
              {cta.label}
            </Link>
          </div>
        ) : null}
      </AppContainer>
    </Section>
  );
}
