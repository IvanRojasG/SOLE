import { dataSource } from '@/lib/config/dataSource';
import { backendRequest } from '@/services/api/backend';
import { mockBaseline } from '@/services/mocks/baseline';
import type { AuthSession } from '@/services/auth/session';
import type { BaselineCatalogItem, BaselineEntry } from '@/types';

type BaselineCatalogPayload = {
  id: string;
  name: string;
  category: string;
  metric_type: string;
  unit: string;
  description: string;
  is_active: boolean;
};

const validCategories: BaselineEntry['category'][] = [
  'weightlifting',
  'wod',
  'gymnastics',
  'skill',
  'strength',
  'conditioning',
  'other',
];

const validMetricTypes: BaselineEntry['metricType'][] = [
  'weight',
  'time',
  'reps',
  'distance',
  'score',
  'status',
];

const validUnits: BaselineEntry['unit'][] = [
  'lb',
  'kg',
  'seconds',
  'reps',
  'meters',
  'points',
  'status',
];

function normalizeCategory(value: string): BaselineEntry['category'] {
  return validCategories.includes(value as BaselineEntry['category'])
    ? (value as BaselineEntry['category'])
    : 'other';
}

function normalizeMetricType(value: string): BaselineEntry['metricType'] {
  return validMetricTypes.includes(value as BaselineEntry['metricType'])
    ? (value as BaselineEntry['metricType'])
    : 'score';
}

function normalizeUnit(value: string): BaselineEntry['unit'] {
  return validUnits.includes(value as BaselineEntry['unit'])
    ? (value as BaselineEntry['unit'])
    : 'points';
}

function mapCatalogItem(item: BaselineCatalogPayload): BaselineCatalogItem {
  return {
    id: item.id,
    name: item.name,
    category: normalizeCategory(item.category),
    metricType: normalizeMetricType(item.metric_type),
    unit: normalizeUnit(item.unit),
    description: item.description,
    isActive: item.is_active,
  };
}

export async function getBaselineCatalog(session?: AuthSession): Promise<BaselineCatalogItem[]> {
  if (dataSource === 'api') {
    const payload = await backendRequest<BaselineCatalogPayload[]>('/baseline/catalog', {
      role: session ? 'coach' : undefined,
      session,
    });

    return payload.map(mapCatalogItem);
  }

  return mockBaseline.entries.map((entry: BaselineEntry) => ({
    id: entry.itemId,
    name: entry.name,
    category: entry.category,
    metricType: entry.metricType,
    unit: entry.unit,
    description: entry.description,
    isActive: true,
  }));
}
