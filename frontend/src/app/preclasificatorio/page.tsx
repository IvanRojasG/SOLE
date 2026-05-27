import type { Metadata } from 'next';

import { PrequalifierView } from '@/components/pages/PrequalifierView';
import { brand } from '@/lib/config/brand';
import { getRanking } from '@/services/repository/rankingRepository';

export const metadata: Metadata = {
  title: `${brand.name} | Preclasificatorio`,
  description: 'Top 10 preclasificatorio del reto Burn the Ships de SOLE Fitness.',
};

export default async function PreclasificatorioPage() {
  const entries = await getRanking({ view: 'event' });

  return <PrequalifierView entries={entries} />;
}
