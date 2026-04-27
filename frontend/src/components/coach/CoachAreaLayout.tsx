import Link from 'next/link';

import { AppContainer } from '@/components/layout/AppContainer';
import { cn } from '@/lib/utils/cn';

const coachNavigation = [
  { href: '/coach', label: 'Dashboard' },
  { href: '/coach/athletes', label: 'Atletas' },
  { href: '/coach/attendance', label: 'Asistencia' },
  { href: '/coach/achievements', label: 'Logros' },
  { href: '/coach/challenges', label: 'Retos' },
  { href: '/coach/baseline', label: 'Baseline' },
] as const;

type CoachAreaLayoutProps = {
  activePath: string;
  title: string;
  description: string;
  children: React.ReactNode;
};

export function CoachAreaLayout({
  activePath,
  title,
  description,
  children,
}: CoachAreaLayoutProps) {
  return (
    <div className="py-[--section-spacing]">
      <AppContainer className="space-y-8">
        <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
          <p className="text-xs uppercase tracking-[0.24em] text-[color:var(--color-secondary-soft)]">
            Coach Panel
          </p>
          <h1 className="mt-4 font-display text-5xl uppercase tracking-[0.08em] text-white md:text-6xl">
            {title}
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-[color:var(--color-text-muted)]">
            {description}
          </p>
        </div>
        <nav className="flex gap-3 overflow-x-auto pb-2">
          {coachNavigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'rounded-full px-4 py-3 text-xs font-semibold uppercase tracking-[0.18em] whitespace-nowrap transition',
                activePath === item.href
                  ? 'bg-[color:var(--color-secondary)] text-[color:var(--color-ink)]'
                  : 'border border-white/10 bg-white/5 text-white',
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        {children}
      </AppContainer>
    </div>
  );
}
