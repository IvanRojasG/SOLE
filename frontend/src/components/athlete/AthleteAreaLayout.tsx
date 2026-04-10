import Link from 'next/link';

import { AppContainer } from '@/components/layout/AppContainer';
import { cn } from '@/lib/utils/cn';

const athleteNavigation = [
  { href: '/athlete', label: 'Dashboard' },
  { href: '/athlete/profile', label: 'Perfil' },
  { href: '/athlete/baseline', label: 'Baseline' },
  { href: '/athlete/achievements', label: 'Logros' },
  { href: '/athlete/attendance', label: 'Asistencia' },
] as const;

type AthleteAreaLayoutProps = {
  activePath: string;
  title: string;
  description: string;
  children: React.ReactNode;
};

export function AthleteAreaLayout({
  activePath,
  title,
  description,
  children,
}: AthleteAreaLayoutProps) {
  return (
    <div className="py-[--section-spacing]">
      <AppContainer className="space-y-8">
        <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
          <p className="text-xs uppercase tracking-[0.24em] text-[color:var(--color-primary-soft)]">
            Athlete Flow
          </p>
          <h1 className="mt-4 font-display text-5xl uppercase tracking-[0.08em] text-white md:text-6xl">
            {title}
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-[color:var(--color-text-muted)]">
            {description}
          </p>
        </div>

        <nav className="flex gap-3 overflow-x-auto pb-2">
          {athleteNavigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'rounded-full px-4 py-3 text-xs font-semibold uppercase tracking-[0.18em] whitespace-nowrap transition',
                activePath === item.href
                  ? 'bg-[color:var(--color-primary)] text-[color:var(--color-ink)]'
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
