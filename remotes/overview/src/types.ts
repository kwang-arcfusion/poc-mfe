// remotes/overview/src/types.ts

// =================================================================
// Types for the /analytics/options API response
// =================================================================

/** Represents a single selectable option, e.g., { key: "SMS", label: "SMS" } */
export interface FilterOption {
  key: string;
  label: string;
}

/** Represents a filter dimension, e.g., "channel" and its available options */
export interface Dimension {
  key: string; // "channel"
  label: string; // "Channel"
  options: FilterOption[];
}

/** Represents a selectable metric */
export interface MetricOption {
  key: string; // "conversions_rate"
  label: string; // "Conversions Rate"
  type: 'percent' | 'currency' | 'number';
}

/** The complete structure for the options API response */
export interface AnalyticsOptions {
  dimensions: Dimension[];
  metrics: MetricOption[];
}

// =================================================================
// Types for the /analytics/overview API response
// =================================================================

/** Defines how a value should be formatted, e.g., as a percentage */
interface FormatConfig {
  type: 'percent' | 'currency' | 'number';
  precision?: number | null;
}

/** Data for a single Metric Card at the top of the dashboard */
export interface CardData {
  key: string;
  label: string;
  value: number;
  delta_pct: number;
  format: FormatConfig;
}

/** * A single data point for a time-series chart. 
 * Now includes an optional 'channel' property.
 */
export interface SeriesPoint {
  date: string;
  y: number;
  channel?: string;
}

/** Represents a single line on the chart (e.g., "Conversions Rate") and all its points */
interface SeriesItem {
  key: string;
  label: string;
  points: SeriesPoint[];
  format: FormatConfig;
}

/** Contains all the data needed for the multi-line chart component */
export interface SeriesData {
  x: {
    type: 'time';
    key: 'date';
  };
  series: SeriesItem[];
}

/** Defines a column for the "By Channel" table */
interface TableColumn {
  key: string;
  label: string;
  format: FormatConfig;
}

/** Represents a single row in the "By Channel" table, with dynamic keys */
export type TableRowData = {
  [key: string]: string | number;
} & {
  channel: string; // Ensures 'channel' is always present
};

/** Contains all the data for a single table component */
export interface TableData {
  title: string;
  dimension: {
    key: string; // "channel"
    label: string; // "Channel"
  };
  columns: TableColumn[];
  rows: TableRowData[];
}

/** The complete structure for the main overview data API response */
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

/** State for managing selected filter values in the UI */
export interface FilterValues {
  channels: string[];
  metrics: string[];
}