import { AuthForm } from '@/components/auth/AuthForm';
import { AppContainer } from '@/components/layout/AppContainer';
import { getSession } from '@/services/auth/session';

export const dynamic = 'force-dynamic';

type LoginPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const session = await getSession();
  const initialRedirectTo = session
    ? session.user.role === 'coach'
      ? '/coach'
      : '/athlete/profile'
    : undefined;

  const params = await searchParams;
  const nextTarget = typeof params.next === 'string' ? params.next : undefined;
  const sessionExpired = params.expired === '1';

  return (
    <section className="sole-auth-shell py-[--section-spacing]">
      <AppContainer>
        <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-[2rem] border border-slate-200/90 bg-[linear-gradient(135deg,#ffffff_0%,#eef5ff_58%,#ffffff_100%)] p-6 shadow-[0_26px_80px_rgba(15,23,42,0.09)] sm:p-8">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-blue-100 bg-blue-50 text-[color:var(--color-primary)] shadow-[0_16px_42px_rgba(0,92,255,0.12)]">
              <svg viewBox="0 0 24 24" aria-hidden="true" className="h-7 w-7" fill="none">
                <path
                  d="M7 11.5 10.5 15 17 8.5"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                />
                <path
                  d="M12 3.5 5.5 6v5.5c0 4.2 2.8 7.4 6.5 9 3.7-1.6 6.5-4.8 6.5-9V6L12 3.5Z"
                  stroke="currentColor"
                  strokeLinejoin="round"
                  strokeWidth="1.8"
                />
              </svg>
            </div>
            <p className="mt-8 text-xs font-semibold uppercase tracking-[0.24em] text-[color:var(--color-primary)]">
              Acceso
            </p>
            <h1 className="mt-4 font-display text-4xl uppercase tracking-[0.08em] text-slate-950 sm:text-5xl">
              Entra a tu panel
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-7 text-slate-600">
              Autenticación real contra el backend FastAPI. Desde aquí el atleta entra a su flujo y
              el coach a su panel operativo.
            </p>
            <div className="mt-8 rounded-[1.5rem] border border-cyan-200 bg-[linear-gradient(135deg,#ecfeff,#ffffff)] p-5 shadow-[0_18px_48px_rgba(8,145,178,0.12)]">
              <div className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-cyan-100 text-cyan-700">
                  <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5" fill="none">
                    <path
                      d="M8 12h8M12 8v8"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeWidth="2"
                    />
                    <path
                      d="M12 21a8.5 8.5 0 1 0 0-17 8.5 8.5 0 0 0 0 17Z"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-cyan-700">
                    Acceso seguro
                  </p>
                  <p className="mt-3 text-sm leading-7 text-slate-600">
                    Inicia sesión para operar el reto mensual con workouts, logros, ranking y paneles
                    diferenciados por rol.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="rounded-[2rem] border border-slate-200/90 bg-white/95 p-6 shadow-[0_26px_80px_rgba(15,23,42,0.09)] sm:p-8">
            <AuthForm
              mode="login"
              initialRedirectTo={initialRedirectTo}
              nextTarget={nextTarget}
              sessionExpired={sessionExpired}
            />
          </div>
        </div>
      </AppContainer>
    </section>
  );
}
