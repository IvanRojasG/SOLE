import { cn } from '@/lib/utils/cn';
import type { AchievementStatus } from '@/types';

type StatusBadgeProps = {
  status: AchievementStatus;
};

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        'rounded-full px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.18em]',
        status === 'approved' && 'bg-[color:var(--color-success)]/15 text-[color:var(--color-success)]',
        status === 'submitted' && 'bg-[color:var(--color-accent)]/15 text-[color:var(--color-accent)]',
        status === 'rejected' && 'bg-[color:var(--color-danger)]/15 text-[color:var(--color-danger)]',
      )}
    >
      {status}
    </span>
  );
}
