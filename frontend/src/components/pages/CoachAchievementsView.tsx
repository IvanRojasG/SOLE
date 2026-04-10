'use client';

import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';

import { AchievementReviewDrawer } from '@/components/coach/AchievementReviewDrawer';
import { PendingAchievementsTable } from '@/components/coach/PendingAchievementsTable';
import { approveAchievementAction, rejectAchievementAction } from '@/services/actions';
import type { PendingAchievementReview } from '@/types';

type CoachAchievementsViewProps = {
  items: PendingAchievementReview[];
};

export function CoachAchievementsView({ items }: CoachAchievementsViewProps) {
  const [state, setState] = useState(items);
  const [selected, setSelected] = useState<PendingAchievementReview | null>(null);
  const [error, setError] = useState('');
  const router = useRouter();

  const hasItems = useMemo(() => state.length > 0, [state]);

  return (
    <div className="space-y-6">
      {error ? (
        <div className="rounded-[1.5rem] border border-[color:var(--color-danger)]/30 bg-[color:var(--color-danger)]/10 p-4 text-sm text-[color:var(--color-danger)]">
          {error}
        </div>
      ) : null}
      {!hasItems ? (
        <div className="rounded-[2rem] border border-dashed border-white/15 bg-white/5 p-6 text-sm text-[color:var(--color-text-muted)]">
          Todo está al día. No hay revisiones pendientes.
        </div>
      ) : (
        <PendingAchievementsTable items={state} onSelect={setSelected} />
      )}
      <AchievementReviewDrawer
        item={selected}
        open={selected !== null}
        onClose={() => setSelected(null)}
        onApprove={() => {
          if (!selected) {
            setError('No se pudo aprobar el logro seleccionado.');
            return;
          }
          void approveAchievementAction(selected.id).then(() => {
            setState((current) => current.filter((item) => item.id !== selected.id));
            setSelected(null);
            setError('');
            router.refresh();
          });
        }}
        onReject={() => {
          if (!selected) {
            setError('No se pudo rechazar el logro seleccionado.');
            return;
          }
          void rejectAchievementAction(selected.id).then(() => {
            setState((current) => current.filter((item) => item.id !== selected.id));
            setSelected(null);
            setError('');
            router.refresh();
          });
        }}
      />
    </div>
  );
}
