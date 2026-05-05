import Link from 'next/link';

import { AppContainer } from '@/components/layout/AppContainer';
import { cn } from '@/lib/utils/cn';

const coachNavigation = [
  { href: '/coach', label: 'Dashboard' },
  { href: '/coach/athletes', label: 'Atletas' },
  { href: '/coach/achievements', label: 'Logros' },
  { href: '/coach/challenges', label: 'Retos' },
  { href: '/coach/baseline', label: 'Baseline' },
  { href: '/account/password', label: 'Password' },
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
    <div className="sole-dashboard-shell py-[--section-spacing]">
      <AppContainer className="space-y-8">
        <div className="rounded-[2rem] border border-slate-200/80 bg-white/90 p-6 shadow-[0_24px_70px_rgba(15,23,42,0.08)]">
          <div className="flex flex-col gap-5">
            <div>
              <p className="text-xs font-semibold tracking-[0.24em] text-[color:var(--color-primary)] uppercase">
                Coach Panel
              </p>
              <h1 className="font-display mt-4 text-5xl tracking-[0.08em] text-slate-950 uppercase md:text-6xl">
                {title}
              </h1>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600">
                {description}
              </p>
            </div>
          </div>
        </div>
        <nav className="flex gap-3 overflow-x-auto pb-2">
          {coachNavigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'rounded-full px-4 py-3 text-xs font-semibold tracking-[0.18em] whitespace-nowrap uppercase transition',
                activePath === item.href
                  ? 'bg-[color:var(--color-primary)] text-white shadow-[0_14px_32px_rgba(0,92,255,0.22)]'
                  : 'border border-slate-200 bg-white/85 text-slate-700 shadow-[0_12px_30px_rgba(15,23,42,0.05)] hover:border-[color:var(--color-primary)] hover:text-[color:var(--color-primary)]',
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
