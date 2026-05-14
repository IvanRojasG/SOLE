'use client';

import Image from 'next/image';
import { useCallback, useEffect, useMemo, useState } from 'react';

type ScheduleMedia = {
  src: string;
  alt: string;
};

type ScheduleItem = {
  label: string;
  value: string;
  wodName: string;
  youtubeUrl: string;
  photos: readonly ScheduleMedia[];
};

type SelectedMedia = {
  itemIndex: number;
  mediaIndex: number;
};

type ChallengeScheduleGalleryProps = {
  items: readonly ScheduleItem[];
};

const imageExtensions = new Set(['jpg', 'jpeg', 'png', 'webp', 'avif']);
const videoExtensions = new Set(['mov', 'mp4', 'webm']);

function getExtension(src: string) {
  return src.split('?')[0].split('.').pop()?.toLowerCase() ?? '';
}

function getMediaType(src: string) {
  const extension = getExtension(src);

  if (videoExtensions.has(extension)) {
    return 'video';
  }

  if (imageExtensions.has(extension)) {
    return 'image';
  }

  return 'unknown';
}

function getYouTubeEmbedUrl(youtubeUrl: string) {
  if (!youtubeUrl) {
    return null;
  }

  try {
    const parsedUrl = new URL(youtubeUrl);
    const videoId =
      parsedUrl.searchParams.get('v') ||
      parsedUrl.pathname.split('/').filter(Boolean).pop() ||
      '';

    return videoId ? `https://www.youtube-nocookie.com/embed/${videoId}` : null;
  } catch {
    return null;
  }
}

export function ChallengeScheduleGallery({
  items,
}: ChallengeScheduleGalleryProps) {
  const [selected, setSelected] = useState<SelectedMedia | null>(null);
  const selectedItem = selected ? items[selected.itemIndex] : null;
  const selectedMedia = selectedItem?.photos[selected?.mediaIndex ?? 0] ?? null;
  const selectedType = selectedMedia ? getMediaType(selectedMedia.src) : 'unknown';

  const selectedTitle = useMemo(() => {
    if (!selectedItem || !selectedMedia) {
      return '';
    }

    return `${selectedItem.label} · ${selectedItem.wodName}`;
  }, [selectedItem, selectedMedia]);

  const moveSelection = useCallback((direction: -1 | 1) => {
    setSelected((current) => {
      if (!current) {
        return current;
      }

      const mediaCount = items[current.itemIndex]?.photos.length ?? 0;
      if (mediaCount === 0) {
        return current;
      }

      return {
        itemIndex: current.itemIndex,
        mediaIndex: (current.mediaIndex + direction + mediaCount) % mediaCount,
      };
    });
  }, [items]);

  useEffect(() => {
    if (!selected) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setSelected(null);
      }

      if (event.key === 'ArrowLeft') {
        moveSelection(-1);
      }

      if (event.key === 'ArrowRight') {
        moveSelection(1);
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [moveSelection, selected]);

  return (
    <>
      <div className="space-y-6">
        {items.map((item, itemIndex) => {
          const embedUrl = getYouTubeEmbedUrl(item.youtubeUrl);

          return (
            <article
              key={item.label}
              className="overflow-hidden rounded-[1.25rem] border border-slate-200 bg-white shadow-[0_22px_62px_rgba(15,23,42,0.08)]"
            >
              <div className="grid gap-0 lg:grid-cols-[0.82fr_1.18fr]">
                <div className="flex flex-col justify-between gap-7 p-5 sm:p-6 lg:p-7">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-[color:var(--color-primary)]/10 px-3 py-2 text-[11px] font-bold uppercase tracking-[0.18em] text-[color:var(--color-primary)]">
                        {item.label}
                      </span>
                      <span className="rounded-full bg-slate-100 px-3 py-2 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-600">
                        {item.value}
                      </span>
                    </div>
                    <h3 className="mt-5 font-display text-4xl uppercase leading-[0.95] tracking-[0.04em] text-slate-950 sm:text-5xl">
                      {item.wodName}
                    </h3>
                  </div>

                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">
                      Galeria del WOD
                    </p>
                    <div className="mt-3 grid max-h-[24rem] grid-cols-3 gap-2 overflow-y-auto pr-1 sm:grid-cols-4 lg:grid-cols-3">
                      {item.photos.map((media, mediaIndex) => {
                        const mediaType = getMediaType(media.src);

                        return (
                          <button
                            key={`${item.label}-${media.src}`}
                            type="button"
                            onClick={() =>
                              setSelected({ itemIndex, mediaIndex })
                            }
                            className="group relative aspect-square overflow-hidden rounded-xl bg-slate-100 text-left outline-none ring-offset-2 ring-offset-white transition hover:scale-[1.015] focus-visible:ring-2 focus-visible:ring-[color:var(--color-primary)]"
                            aria-label={`Abrir ${media.alt}`}
                          >
                            {mediaType === 'video' ? (
                              <video
                                src={media.src}
                                muted
                                playsInline
                                preload="metadata"
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <Image
                                src={media.src}
                                alt={media.alt}
                                fill
                                sizes="(min-width: 1024px) 9vw, (min-width: 640px) 20vw, 28vw"
                                className="object-cover"
                                priority={itemIndex === 0 && mediaIndex === 0}
                              />
                            )}
                            <span className="absolute inset-0 bg-slate-950/0 transition group-hover:bg-slate-950/18" />
                            {mediaType === 'video' ? (
                              <span className="absolute left-2 top-2 rounded-full bg-slate-950/80 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-white">
                                Video
                              </span>
                            ) : null}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="bg-slate-950 p-2">
                  <div className="aspect-video overflow-hidden rounded-[1rem] bg-slate-900 lg:min-h-[27rem]">
                    {embedUrl ? (
                      <iframe
                        src={embedUrl}
                        title={`Video ${item.wodName}`}
                        className="h-full w-full"
                        loading="lazy"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        referrerPolicy="strict-origin-when-cross-origin"
                        allowFullScreen
                      />
                    ) : (
                      <div className="flex h-full min-h-[15rem] items-center justify-center px-6 text-center">
                        <div>
                          <p className="text-xs font-bold uppercase tracking-[0.22em] text-[color:var(--color-primary-soft)]">
                            Video del reto
                          </p>
                          <p className="mt-3 text-sm leading-7 text-white/70">
                            {item.wodName}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {selected && selectedItem && selectedMedia ? (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/92 px-4 py-6"
          role="dialog"
          aria-modal="true"
          aria-label={selectedTitle}
          onClick={() => setSelected(null)}
        >
          <div
            className="flex max-h-full w-full max-w-6xl flex-col gap-4"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex flex-wrap items-center justify-between gap-3 text-white">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[color:var(--color-primary-soft)]">
                  {selectedTitle}
                </p>
                <p className="mt-1 text-sm text-white/70">{selectedMedia.alt}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="rounded-full border border-white/25 bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-slate-950 transition hover:bg-slate-100"
              >
                Cerrar
              </button>
            </div>

            <div className="relative overflow-hidden rounded-[1.25rem] bg-black shadow-[0_28px_90px_rgba(0,0,0,0.42)]">
              {selectedType === 'video' ? (
                <video
                  key={selectedMedia.src}
                  src={selectedMedia.src}
                  controls
                  playsInline
                  className="max-h-[74vh] w-full bg-black object-contain"
                />
              ) : (
                <div className="relative h-[74vh] min-h-[20rem] w-full">
                  <Image
                    key={selectedMedia.src}
                    src={selectedMedia.src}
                    alt={selectedMedia.alt}
                    fill
                    sizes="96vw"
                    className="object-contain"
                    priority
                  />
                </div>
              )}
            </div>

            <div className="flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => moveSelection(-1)}
                className="rounded-full border border-white/25 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-white transition hover:border-white hover:bg-white hover:text-slate-950"
              >
                Anterior
              </button>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/60">
                {selected.mediaIndex + 1} / {selectedItem.photos.length}
              </p>
              <button
                type="button"
                onClick={() => moveSelection(1)}
                className="rounded-full border border-white/25 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-white transition hover:border-white hover:bg-white hover:text-slate-950"
              >
                Siguiente
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
