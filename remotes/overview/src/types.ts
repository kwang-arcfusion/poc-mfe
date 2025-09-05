export interface FilterOption {
  key: string;
  label: string;
}

export interface Dimension {
  key: string;
  label: string;
  options: FilterOption[];
}

export interface MetricOption {
  key: string;
  label: string;
  type: 'percent' | 'currency' | 'number';
}

export interface AnalyticsOptions {
  dimensions: Dimension[];
  metrics: MetricOption[];
}

interface FormatConfig {
  type: 'percent' | 'currency' | 'number';
  precision?: number | null;
}

export interface CardData {
  key: string;
  label: string;
  value: number;
  delta_pct: number;
  format: FormatConfig;
}

interface SeriesPoint {
  date: string;
  y: number;
}

interface SeriesItem {
  key: string;
  label: string;
  points: SeriesPoint[];
  format: FormatConfig;
}

export interface SeriesData {
  x: {
    type: 'time';
    key: 'date';
  };
  series: SeriesItem[];
}

interface TableColumn {
  key: string;
  label: string;
  format: FormatConfig;
}

export type TableRowData = {
  [key: string]: string | number;
} & {
  channel: string;
};

export interface TableData {
  title: string;
  dimension: {
    key: string;
    label: string;
  };
  columns: TableColumn[];
  rows: TableRowData[];
}

export interface OverviewApiResponse {
  meta: {
    tz: string;
    currency: string;
    filters: Record<string, any>;
  };
  cards: CardData[];
  series: SeriesData;
  tables: TableData[];
}

export interface FilterValues {
  channels: string[];
  metrics: string[];
}
