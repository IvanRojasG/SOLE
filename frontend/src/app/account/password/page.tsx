import { ChangePasswordForm } from '@/components/auth/ChangePasswordForm';
import { AthleteAreaLayout } from '@/components/athlete/AthleteAreaLayout';
import { CoachAreaLayout } from '@/components/coach/CoachAreaLayout';
import { requireSession } from '@/services/auth/session';

export default async function AccountPasswordPage() {
  const session = await requireSession(undefined, '/account/password');
  const content = (
    <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[color:var(--color-primary)]">
          Cuenta
        </p>
        <h2 className="mt-4 font-display text-5xl uppercase leading-[0.9] tracking-[0.06em] text-slate-950 md:text-6xl">
          Seguridad de acceso
        </h2>
        <p className="mt-5 text-sm leading-7 text-slate-600">
          Sesión activa: <span className="font-semibold text-slate-950">{session.user.email}</span>.
          Usa este formulario para cambiar tu contraseña sin depender del coach.
        </p>
      </div>
      <ChangePasswordForm />
    </div>
  );

  if (session.user.role === 'coach') {
    return (
      <CoachAreaLayout
        activePath="/account/password"
        title="Password"
        description="Actualiza tu contraseña de acceso sin salir del panel de coach."
      >
        {content}
      </CoachAreaLayout>
    );
  }

  return (
    <AthleteAreaLayout
      activePath="/account/password"
      title="Password"
      description="Actualiza tu contraseña de acceso sin salir del flujo de atleta."
    >
      {content}
    </AthleteAreaLayout>
  );
}
