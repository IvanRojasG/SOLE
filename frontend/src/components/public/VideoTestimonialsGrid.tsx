type TestimonialVideo = {
  title: string;
  youtubeUrl: string;
};

type VideoTestimonialsGridProps = {
  videos: readonly TestimonialVideo[];
};

function extractYoutubeEmbedUrl(youtubeUrl: string) {
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

export function VideoTestimonialsGrid({ videos }: VideoTestimonialsGridProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {videos.map((video) => {
        const embedUrl = extractYoutubeEmbedUrl(video.youtubeUrl);

        return (
          <article
            key={video.title}
            className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-[0_22px_60px_rgba(15,23,42,0.08)]"
          >
            {embedUrl ? (
              <div className="aspect-video">
                <iframe
                  className="h-full w-full"
                  src={embedUrl}
                  title={video.title}
                  loading="lazy"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                />
              </div>
            ) : (
              <div className="flex aspect-video items-center justify-center bg-[linear-gradient(135deg,#e8f1ff,#f8fbff_56%,#dbe9ff)] p-8 text-center">
                <div>
                  <p className="text-xs font-semibold tracking-[0.22em] text-[color:var(--color-primary)] uppercase">
                    YouTube embed
                  </p>
                  <p className="mt-3 text-sm leading-7 text-slate-600">
                    Reemplaza el link vacio en{' '}
                    <span className="font-semibold text-slate-900">
                      `src/content/publicSite.ts`
                    </span>{' '}
                    para mostrar el video.
                  </p>
                </div>
              </div>
            )}
            <div className="px-5 py-4">
              <h3 className="text-lg font-semibold text-slate-900">
                {video.title}
              </h3>
            </div>
          </article>
        );
      })}
    </div>
  );
}
