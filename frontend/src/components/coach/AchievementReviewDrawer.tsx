'use client';

import type { PendingAchievementReview } from '@/types';

import { ApproveButton } from './ApproveButton';
import { RejectButton } from './RejectButton';

type AchievementReviewDrawerProps = {
  item: PendingAchievementReview | null;
  open: boolean;
  onApprove: () => void;
  onReject: () => void;
  onClose: () => void;
};

export function AchievementReviewDrawer({
  item,
  open,
  onApprove,
  onReject,
  onClose,
}: AchievementReviewDrawerProps) {
  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-black/60 transition-opacity ${open ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
        onClick={onClose}
      />
      <aside
        className={`fixed right-0 top-0 z-50 h-full w-[92vw] max-w-md border-l border-white/10 bg-[color:var(--color-surface)] p-6 shadow-[var(--shadow-lift)] transition-transform ${open ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {item ? (
          <>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-[color:var(--color-primary-soft)]">
                  Review
                </p>
                <h2 className="mt-3 text-2xl font-semibold text-white">{item.title}</h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-full border border-white/10 px-3 py-2 text-xs uppercase tracking-[0.18em] text-white"
              >
                Cerrar
              </button>
            </div>
            <div className="mt-8 space-y-4">
              <div className="rounded-[1.5rem] border border-white/10 p-4">
                <p className="text-[11px] uppercase tracking-[0.18em] text-[color:var(--color-text-muted)]">Atleta</p>
                <p className="mt-2 text-base font-semibold text-white">{item.athleteName}</p>
              </div>
              <div className="rounded-[1.5rem] border border-white/10 p-4">
                <p className="text-[11px] uppercase tracking-[0.18em] text-[color:var(--color-text-muted)]">Notas</p>
                <p className="mt-2 text-sm leading-7 text-[color:var(--color-text-muted)]">{item.notes}</p>
              </div>
            </div>
            <div className="mt-8 flex gap-3">
              <ApproveButton onClick={onApprove} />
              <RejectButton onClick={onReject} />
            </div>
          </>
        ) : null}
      </aside>
    </>
  );
}
