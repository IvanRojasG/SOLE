import { ForgotPasswordForm } from '@/components/auth/ForgotPasswordForm';
import { AppContainer } from '@/components/layout/AppContainer';

export default function ForgotPasswordPage() {
  return (
    <section className="bg-[linear-gradient(180deg,#ffffff_0%,#f4f8ff_55%,#ffffff_100%)] py-[--section-spacing]">
      <AppContainer className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[color:var(--color-primary)]">
            Recuperación
          </p>
          <h1 className="mt-4 font-display text-5xl uppercase leading-[0.9] tracking-[0.06em] text-slate-950 md:text-6xl">
            Olvidé mi contraseña
          </h1>
          <p className="mt-5 text-sm leading-7 text-slate-600">
            Ingresa tu correo para generar un enlace de recuperación. En modo local se muestra el
            token en pantalla; en producción este paso debe enviarse por email.
          </p>
        </div>
        <ForgotPasswordForm />
      </AppContainer>
    </section>
  );
}
