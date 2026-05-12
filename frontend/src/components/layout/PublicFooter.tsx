import Link from 'next/link';

import { brand } from '@/lib/config/brand';

import { AppContainer } from './AppContainer';

export function PublicFooter() {
  return (
    <footer className="border-t border-slate-200 bg-slate-950 text-white">
      <AppContainer className="grid gap-10 py-10 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <p className="font-display text-4xl uppercase tracking-[0.16em]">
            {brand.name}
          </p>
          <p className="mt-4 max-w-md text-sm leading-7 text-slate-300">
            Landing y páginas de información alineadas con Burn the Ships!, usando una base visual
            deportiva, clara y lista para fotos y videos.
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
                className="text-sm text-slate-300 transition hover:text-white"
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
          <p className="mt-4 text-sm leading-7 text-slate-300">
            Carrusel conectado a `public/challenge-gallery` y sección de testimonios preparada para
            incrustar links de YouTube reales sin tocar la estructura.
          </p>
        </div>
      </AppContainer>
    </footer>
  );
}
