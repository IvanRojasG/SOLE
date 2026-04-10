import { cn } from '@/lib/utils/cn';

type SectionProps = {
  id?: string;
  className?: string;
  children: React.ReactNode;
};

export function Section({ id, className, children }: SectionProps) {
  return (
    <section id={id} className={cn('py-[--section-spacing]', className)}>
      {children}
    </section>
  );
}
