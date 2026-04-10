'use client';

import type { ChallengeCategory } from '@/types';

type ChallengeFiltersProps = {
  categories: ChallengeCategory[];
  selectedCategory: ChallengeCategory | 'all';
  onCategoryChange: (value: ChallengeCategory | 'all') => void;
};

export function ChallengeFilters({
  categories,
  selectedCategory,
  onCategoryChange,
}: ChallengeFiltersProps) {
  return (
    <div className="flex flex-wrap gap-2 rounded-[1.75rem] border border-white/10 bg-white/5 p-4">
      <button
        type="button"
        onClick={() => onCategoryChange('all')}
        className={`rounded-full px-4 py-3 text-xs font-semibold uppercase tracking-[0.18em] ${
          selectedCategory === 'all'
            ? 'bg-[color:var(--color-primary)] text-[color:var(--color-ink)]'
            : 'border border-white/10 bg-[color:var(--color-surface)] text-white'
        }`}
      >
        Todos
      </button>
      {categories.map((category) => (
        <button
          key={category}
          type="button"
          onClick={() => onCategoryChange(category)}
          className={`rounded-full px-4 py-3 text-xs font-semibold uppercase tracking-[0.18em] ${
            selectedCategory === category
              ? 'bg-[color:var(--color-secondary)] text-[color:var(--color-ink)]'
              : 'border border-white/10 bg-[color:var(--color-surface)] text-white'
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  );
}
