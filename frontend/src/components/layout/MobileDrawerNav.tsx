'use client';

import Image from 'next/image';
import Link from 'next/link';

import { brand } from '@/lib/config/brand';
import { logoutAction } from '@/services/auth/actions';
import type { AuthSession } from '@/services/auth/session';
import { cn } from '@/lib/utils/cn';

type MobileDrawerNavProps = {
  open: boolean;
  onClose: () => void;
  session: AuthSession | null;
};

export function MobileDrawerNav({ open, onClose, session }: MobileDrawerNavProps) {
  const dashboardHref = session?.user.role === 'coach' ? '/coach' : '/athlete/profile';

  return (
    <>
      <div
        className={cn(
          'fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity lg:hidden',
          open ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
        onClick={onClose}
      />
      <aside
        id="mobile-drawer-nav"
        aria-hidden={!open}
        aria-label="Menú móvil"
        className={cn(
          'fixed right-0 top-0 z-50 flex h-dvh w-[84vw] max-w-sm flex-col border-l border-slate-200 bg-white px-6 py-6 shadow-[0_32px_90px_rgba(15,23,42,0.18)] transition-transform duration-300 lg:hidden',
          open ? 'translate-x-0' : 'translate-x-full',
        )}
      >
        <div className="mb-6 flex shrink-0 items-center justify-between">
          <div className="rounded-2xl border border-slate-200 bg-white px-3 py-2 shadow-[0_14px_34px_rgba(15,23,42,0.06)]">
            <Image
              src={brand.assets.officialBlue}
              alt={brand.name}
              width={96}
              height={42}
              priority
              className="h-auto w-auto"
            />
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-slate-300 bg-slate-950 px-3 py-2 text-xs font-bold uppercase tracking-[0.2em] text-white shadow-[0_12px_28px_rgba(15,23,42,0.14)]"
          >
            Cerrar
          </button>
        </div>
        <div className="flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto overscroll-contain pb-2 pr-1">
          <nav aria-label="Navegación móvil" className="flex flex-col gap-3">
            {brand.navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm font-bold uppercase tracking-[0.18em] text-slate-900 transition hover:border-[color:var(--color-secondary)] hover:text-[color:var(--color-secondary)]"
              >
                {item.label}
              </Link>
            ))}
            {session ? (
              <>
                <a
                  href={dashboardHref}
                  onClick={onClose}
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-4 text-sm font-bold uppercase tracking-[0.18em] text-slate-900 transition hover:border-[color:var(--color-secondary)] hover:text-[color:var(--color-secondary)]"
                >
                  Mi panel
                </a>
                <form action={logoutAction}>
                  <button
                    type="submit"
                    className="w-full rounded-2xl bg-slate-950 px-4 py-4 text-sm font-bold uppercase tracking-[0.18em] text-white transition hover:bg-[color:var(--color-primary)]"
                  >
                    Cerrar sesion
                  </button>
                </form>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={onClose}
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-4 text-sm font-bold uppercase tracking-[0.18em] text-slate-900 transition hover:border-[color:var(--color-secondary)] hover:text-[color:var(--color-secondary)]"
                >
                  Ingresar
                </Link>
                <Link
                  href="/register"
                  onClick={onClose}
                  className="rounded-2xl bg-slate-950 px-4 py-4 text-sm font-bold uppercase tracking-[0.18em] text-white transition hover:bg-[color:var(--color-primary)]"
                >
                  Crear cuenta
                </Link>
              </>
            )}
          </nav>
          <div className="sole-hatch rounded-3xl border border-slate-200 bg-[linear-gradient(180deg,#f4f8ff,#ffffff)] p-5">
            {session ? (
              <>
                <p className="text-xs uppercase tracking-[0.24em] text-[color:var(--color-primary)]">
                  Sesión activa
                </p>
                <p className="mt-3 text-sm text-slate-900">{session.user.email}</p>
                <p className="mt-2 text-sm text-slate-600">
                  Acceso actual: {session.user.role === 'coach' ? 'coach' : 'athlete'}
                </p>
              </>
            ) : (
              <>
                <p className="text-xs uppercase tracking-[0.24em] text-[color:var(--color-primary)]">
                  Foco del mes
                </p>
                <p className="mt-3 text-sm text-slate-600">
                  Burn the Ships! vive ahora dentro del landing y sus páginas informativas, con espacio listo para fotos y testimonios.
                </p>
              </>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
