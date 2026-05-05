'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { BaselineCatalogForm } from '@/components/coach/BaselineCatalogForm';
import { ActionToast } from '@/components/shared/ActionToast';
import type { BaselineCatalogItem } from '@/types';

type CoachBaselineViewProps = {
  items: BaselineCatalogItem[];
};

const categoryLabels: Record<BaselineCatalogItem['category'], string> = {
  weightlifting: 'Halterofilia',
  wod: 'WOD',
  gymnastics: 'Gymnastics',
  skill: 'Skill',
  strength: 'Fuerza',
  conditioning: 'Conditioning',
  other: 'Otro',
};

const metricLabels: Record<BaselineCatalogItem['metricType'], string> = {
  weight: 'Peso',
  time: 'Tiempo',
  reps: 'Reps',
  distance: 'Distancia',
  score: 'Score',
  status: 'Estado',
};

export function CoachBaselineView({ items }: CoachBaselineViewProps) {
  const [localItems, setLocalItems] = useState(items);
  const [toast, setToast] = useState<{
    message: string;
    tone: 'success' | 'error';
  } | null>(null);
  const router = useRouter();

  return (
    <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:gap-8">
      {toast ? (
        <ActionToast
          message={toast.message}
          tone={toast.tone}
          onDismiss={() => setToast(null)}
        />
      ) : null}
      <section className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
        <div className="flex flex-col gap-3 border-b border-white/10 pb-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs tracking-[0.22em] text-[color:var(--color-secondary-soft)] uppercase">
              Mediciones activas
            </p>
            <h2 className="mt-3 text-2xl font-semibold text-white">
              Catalogo del box
            </h2>
          </div>
          <p className="text-sm text-[color:var(--color-text-muted)]">
            {localItems.length} items
          </p>
        </div>
        <div className="mt-6 grid gap-4">
          {localItems.map((item) => (
            <article
              key={item.id}
              className="grid gap-4 rounded-[1.5rem] border border-white/10 bg-[color:var(--color-surface)] p-4 md:grid-cols-[1fr_auto]"
            >
              <div>
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-semibold tracking-[0.16em] text-white uppercase">
                    {categoryLabels[item.category]}
                  </span>
                  <span className="rounded-full border border-[color:var(--color-secondary)]/30 bg-[color:var(--color-secondary)]/10 px-3 py-1 text-[11px] font-semibold tracking-[0.16em] text-[color:var(--color-secondary-soft)] uppercase">
                    {metricLabels[item.metricType]} / {item.unit}
                  </span>
                </div>
                <h3 className="mt-3 text-lg font-semibold text-white">
                  {item.name}
                </h3>
                <p className="mt-2 text-sm leading-6 text-[color:var(--color-text-muted)]">
                  {item.description || 'Sin descripcion.'}
                </p>
              </div>
              <div className="self-start rounded-full bg-white/10 px-3 py-2 text-[11px] font-semibold tracking-[0.16em] text-white uppercase">
                {item.isActive ? 'Activo' : 'Inactivo'}
              </div>
            </article>
          ))}
        </div>
      </section>
      <BaselineCatalogForm
        onCreated={(item) => {
          setLocalItems((current) => [item, ...current]);
          setToast({
            message: 'Medición creada correctamente.',
            tone: 'success',
          });
          router.refresh();
        }}
        onError={(message) => setToast({ message, tone: 'error' })}
      />
    </div>
  );
}
