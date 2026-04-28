import Link from 'next/link';

import { brand } from '@/lib/config/brand';

import { AppContainer } from './AppContainer';

export function PublicFooter() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <AppContainer className="grid gap-10 py-10 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <p className="font-display text-4xl uppercase tracking-[0.16em] text-slate-950">
            {brand.name}
          </p>
          <p className="mt-4 max-w-md text-sm leading-7 text-slate-600">
            Landing y paginas de informacion alineadas con Burn the Ships!, usando base blanca,
            azules mas suaves y una arquitectura lista para fotos y videos.
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[color:var(--color-primary)]">
            Navegación
          </p>
          <div className="mt-4 flex flex-col gap-3">
            {brand.navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm text-slate-600 transition hover:text-[color:var(--color-primary)]"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[color:var(--color-primary)]">
            Estado
          </p>
          <p className="mt-4 text-sm leading-7 text-slate-600">
            Carrusel conectado a `public/challenge-gallery` y seccion de testimonios preparada para
            incrustar links de YouTube reales sin tocar la estructura.
          </p>
        </div>
      </AppContainer>
    </footer>
  );
}
