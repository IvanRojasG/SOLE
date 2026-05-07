'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

type CoachImageSlide = {
  src: string;
  alt: string;
};

type CoachImageCarouselProps = {
  slides: readonly CoachImageSlide[];
  coachName: string;
  priority?: boolean;
};

export function CoachImageCarousel({
  slides,
  coachName,
  priority = false,
}: CoachImageCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [availableSlides, setAvailableSlides] = useState([...slides]);

  useEffect(() => {
    setAvailableSlides([...slides]);
    setActiveIndex(0);
  }, [slides]);

  useEffect(() => {
    if (availableSlides.length < 2) {
      return;
    }

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % availableSlides.length);
    }, 4500);

    return () => window.clearInterval(timer);
  }, [availableSlides.length]);

  if (availableSlides.length === 0) {
    return null;
  }

  const activeSlide = availableSlides[activeIndex] ?? availableSlides[0];

  function removeMissingSlide(src: string) {
    setAvailableSlides((current) => {
      if (current.length <= 1) {
        return current;
      }

      const nextSlides = current.filter((slide) => slide.src !== src);
      setActiveIndex((currentIndex) =>
        Math.min(currentIndex, Math.max(nextSlides.length - 1, 0)),
      );
      return nextSlides;
    });
  }

  return (
    <div className="absolute inset-0">
      <Image
        key={activeSlide.src}
        src={activeSlide.src}
        alt={activeSlide.alt}
        fill
        sizes="(min-width: 1024px) 44vw, 100vw"
        className="object-cover transition-opacity duration-700"
        priority={priority}
        unoptimized
        onError={() => removeMissingSlide(activeSlide.src)}
      />
      <div className="absolute right-5 bottom-5 z-10 flex items-center gap-2 rounded-full border border-white/25 bg-black/35 px-3 py-2 backdrop-blur-md">
        {availableSlides.map((slide, index) => (
          <button
            key={slide.src}
            type="button"
            onClick={() => setActiveIndex(index)}
            className={`h-2.5 rounded-full transition-all ${
              index === activeIndex ? 'w-8 bg-white' : 'w-2.5 bg-white/55'
            }`}
            aria-label={`${coachName}: imagen ${index + 1}`}
          />
        ))}
      </div>
      {availableSlides.length > 1 ? (
        <div className="absolute bottom-5 left-5 z-10 flex gap-2">
          <button
            type="button"
            onClick={() =>
              setActiveIndex(
                (activeIndex - 1 + availableSlides.length) %
                  availableSlides.length,
              )
            }
            className="rounded-full border border-white/25 bg-white/90 px-3 py-2 text-xs font-bold tracking-[0.14em] text-slate-950 uppercase shadow-[0_12px_32px_rgba(0,0,0,0.18)]"
          >
            Prev
          </button>
          <button
            type="button"
            onClick={() =>
              setActiveIndex((activeIndex + 1) % availableSlides.length)
            }
            className="rounded-full bg-[color:var(--color-secondary)] px-3 py-2 text-xs font-bold tracking-[0.14em] text-[color:var(--color-ink)] uppercase shadow-[0_12px_32px_rgba(0,0,0,0.18)]"
          >
            Next
          </button>
        </div>
      ) : null}
    </div>
  );
}
