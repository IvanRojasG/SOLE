import { cn } from '@/lib/utils/cn';

type PublicSectionHeadingProps = {
  eyebrow: string;
  title: string;
  body?: string;
  align?: 'left' | 'center';
};

export function PublicSectionHeading({
  eyebrow,
  title,
  body,
  align = 'left',
}: PublicSectionHeadingProps) {
  return (
    <div className={cn('max-w-3xl', align === 'center' && 'mx-auto text-center')}>
      <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[color:var(--color-primary)]">
        {eyebrow}
      </p>
      <h2 className="mt-4 font-display text-5xl uppercase leading-[0.95] tracking-[0.04em] text-slate-950 md:text-6xl">
        {title}
      </h2>
      {body ? <p className="mt-5 text-base leading-8 text-slate-600 md:text-lg">{body}</p> : null}
    </div>
  );
}
