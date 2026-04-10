'use client';

import { useDeferredValue, useMemo, useState } from 'react';

import { ChallengeFilters } from '@/components/challenges/ChallengeFilters';
import { ChallengeGrid } from '@/components/challenges/ChallengeGrid';
import { AppContainer } from '@/components/layout/AppContainer';
import { Section } from '@/components/layout/Section';
import type { Challenge, ChallengeCategory } from '@/types';

type ChallengesViewProps = {
  challenges: Challenge[];
};

export function ChallengesView({ challenges }: ChallengesViewProps) {
  const [selectedCategory, setSelectedCategory] = useState<ChallengeCategory | 'all'>('all');
  const deferredCategory = useDeferredValue(selectedCategory);

  const categories = useMemo(
    () => Array.from(new Set(challenges.map((challenge) => challenge.category))),
    [challenges],
  );

  const filteredChallenges = useMemo(() => {
    if (deferredCategory === 'all') {
      return challenges;
    }

    return challenges.filter((challenge) => challenge.category === deferredCategory);
  }, [challenges, deferredCategory]);

  return (
    <Section className="pt-0">
      <AppContainer className="space-y-6 lg:space-y-8">
        <ChallengeFilters
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />
        <ChallengeGrid challenges={filteredChallenges} />
      </AppContainer>
    </Section>
  );
}
