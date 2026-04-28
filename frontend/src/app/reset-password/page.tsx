import Link from 'next/link';

import { ResetPasswordForm } from '@/components/auth/ResetPasswordForm';
import { AppContainer } from '@/components/layout/AppContainer';

type ResetPasswordPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function ResetPasswordPage({ searchParams }: ResetPasswordPageProps) {
  const params = await searchParams;
  const token = typeof params.token === 'string' ? params.token : '';

  return (
    <section className="bg-[linear-gradient(180deg,#ffffff_0%,#f4f8ff_55%,#ffffff_100%)] py-[--section-spacing]">
      <AppContainer className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[color:var(--color-primary)]">
            Nueva contraseña
          </p>
          <h1 className="mt-4 font-display text-5xl uppercase leading-[0.9] tracking-[0.06em] text-slate-950 md:text-6xl">
            Restablecer acceso
          </h1>
          <p className="mt-5 text-sm leading-7 text-slate-600">
            Define una nueva contraseña para volver a entrar a tu panel.
          </p>
        </div>
        {token ? (
          <ResetPasswordForm token={token} />
        ) : (
          <div className="rounded-[2rem] border border-amber-200 bg-amber-50 p-6 text-sm leading-7 text-amber-900">
            Falta el token de recuperación. Solicita uno nuevo desde{' '}
            <Link href="/forgot-password" className="font-semibold underline">
              recuperar contraseña
            </Link>
            .
          </div>
        )}
      </AppContainer>
    </section>
  );
}
