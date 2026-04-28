'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

type Slide = {
  src: string;
  alt: string;
  caption: string;
};

type MediaCarouselProps = {
  slides: readonly Slide[];
};

export function MediaCarousel({ slides }: MediaCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (slides.length < 2) {
      return;
    }

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length);
    }, 5000);

    return () => window.clearInterval(timer);
  }, [slides.length]);

  if (slides.length === 0) {
    return null;
  }

  const activeSlide = slides[activeIndex];

  return (
    <div className="overflow-hidden rounded-[2rem] border border-slate-300/80 bg-white/95 shadow-[0_30px_78px_rgba(15,23,42,0.16)]">
      <div className="relative aspect-[4/5] overflow-hidden bg-slate-100 sm:aspect-[16/10]">
        <Image
          key={activeSlide.src}
          src={activeSlide.src}
          alt={activeSlide.alt}
          fill
          priority
          className="object-cover"
        />
      </div>
      <div className="flex justify-end gap-2 border-t border-slate-200 px-5 py-4 sm:px-6">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setActiveIndex((activeIndex - 1 + slides.length) % slides.length)}
            className="rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-700 transition hover:border-[color:var(--color-primary)] hover:text-[color:var(--color-primary)]"
            aria-label="Imagen anterior"
          >
            Prev
          </button>
          <button
            type="button"
            onClick={() => setActiveIndex((activeIndex + 1) % slides.length)}
            className="rounded-full bg-[color:var(--color-primary)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-[#0f6bff]"
            aria-label="Siguiente imagen"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
