import { AppContainer } from '@/components/layout/AppContainer';
import { Section } from '@/components/layout/Section';

type PageHeroProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export function PageHero({ eyebrow, title, description }: PageHeroProps) {
  return (
    <Section className="pb-10 pt-8 md:pb-12">
      <AppContainer>
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[color:var(--color-primary-soft)]">
          {eyebrow}
        </p>
        <h1 className="mt-4 max-w-5xl font-display text-4xl uppercase tracking-[0.08em] text-white sm:text-5xl lg:text-6xl xl:text-7xl">
          {title}
        </h1>
        <p className="mt-5 max-w-3xl text-sm leading-7 text-[color:var(--color-text-muted)] md:text-base lg:text-lg">
          {description}
        </p>
      </AppContainer>
    </Section>
  );
}
