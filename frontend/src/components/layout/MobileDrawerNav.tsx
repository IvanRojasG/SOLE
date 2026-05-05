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
        aria-label="Menu movil"
        className={cn(
          'fixed right-0 top-0 z-50 flex h-full w-[84vw] max-w-sm flex-col border-l border-slate-200 bg-white px-6 py-6 shadow-[0_32px_90px_rgba(15,23,42,0.18)] transition-transform duration-300 lg:hidden',
          open ? 'translate-x-0' : 'translate-x-full',
        )}
      >
        <div className="mb-10 flex items-center justify-between">
          <div className="rounded-[1.1rem] border border-slate-200 bg-white px-3 py-2">
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
            className="rounded-full border border-slate-200 px-3 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-slate-900"
          >
            Cerrar
          </button>
        </div>
        <nav aria-label="Navegacion movil" className="flex flex-1 flex-col gap-4">
          {brand.navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className="rounded-2xl border border-slate-200 bg-white px-4 py-4 text-sm font-semibold uppercase tracking-[0.2em] text-slate-900 transition hover:border-[color:var(--color-primary)] hover:text-[color:var(--color-primary)]"
            >
              {item.label}
            </Link>
          ))}
          {session ? (
            <>
              <a
                href={dashboardHref}
                onClick={onClose}
                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm font-semibold uppercase tracking-[0.2em] text-slate-900 transition hover:border-[color:var(--color-primary)] hover:text-[color:var(--color-primary)]"
              >
                Mi panel
              </a>
              <form action={logoutAction}>
                <button
                  type="submit"
                  className="w-full rounded-2xl bg-[color:var(--color-primary)] px-4 py-4 text-sm font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-[#0f6bff]"
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
                className="rounded-2xl border border-slate-200 bg-white px-4 py-4 text-sm font-semibold uppercase tracking-[0.2em] text-slate-900 transition hover:border-[color:var(--color-primary)] hover:text-[color:var(--color-primary)]"
              >
                Ingresar
              </Link>
              <Link
                href="/register"
                onClick={onClose}
                className="rounded-2xl bg-[color:var(--color-primary)] px-4 py-4 text-sm font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-[#0f6bff]"
              >
                Crear cuenta
              </Link>
            </>
          )}
        </nav>
        <div className="rounded-3xl border border-slate-200 bg-[linear-gradient(180deg,#f4f8ff,#ffffff)] p-5">
          {session ? (
            <>
              <p className="text-xs uppercase tracking-[0.24em] text-[color:var(--color-primary)]">
                Sesion activa
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
                Burn the Ships! vive ahora dentro del landing y sus paginas informativas, con espacio listo para fotos y testimonios.
              </p>
            </>
          )}
        </div>
      </aside>
    </>
  );
}
