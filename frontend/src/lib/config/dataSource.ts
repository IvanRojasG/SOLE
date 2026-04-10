export type DataSource = 'mock' | 'api';

const rawDataSource = process.env.NEXT_PUBLIC_DATA_SOURCE;

export const dataSource: DataSource = rawDataSource === 'api' ? 'api' : 'mock';
