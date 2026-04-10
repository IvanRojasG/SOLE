import type { AthleteDashboard } from '@/types';

type WelcomeBannerProps = {
  dashboard: AthleteDashboard;
};

export function WelcomeBanner({ dashboard }: WelcomeBannerProps) {
  return (
    <section className="overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(135deg,rgba(247,92,3,0.18),rgba(255,255,255,0.04),rgba(31,182,170,0.18))] p-6 shadow-[var(--shadow-glow)]">
      <p className="text-xs uppercase tracking-[0.24em] text-[color:var(--color-primary-soft)]">
        Bienvenida de atleta
      </p>
      <h2 className="mt-4 text-3xl font-semibold text-white md:text-4xl">
        {dashboard.athlete.fullName}, tu progreso sigue visible y en ascenso.
      </h2>
      <p className="mt-4 max-w-2xl text-sm leading-7 text-[color:var(--color-text-muted)]">
        Nivel {dashboard.athlete.level} • enfoque {dashboard.athlete.favoriteFocus} • ciudad{' '}
        {dashboard.athlete.city}
      </p>
    </section>
  );
}
