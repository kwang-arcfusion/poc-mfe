// remotes/overview/src/Overview.tsx
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { makeStyles, shorthands, Spinner, tokens, Text } from '@fluentui/react-components';

import { OverviewApiResponse, FilterValues, AnalyticsOptions, FilterOption } from './types';
import { fetchOverviewData, fetchAnalyticsOptions } from './services/api';

import { OverallPerformance } from './components/OverallPerformance';
import { DailyPerformanceChart } from './components/DailyPerformanceChart';
import { ByChannelTable } from './components/ByChannelTable';
import { Filter28Filled } from '@fluentui/react-icons';
import { DateRangePicker, type DateRange, MultiSelect } from '@arcfusion/ui'; // The import remains simple!

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap('24px'),
    ...shorthands.padding('0px', '24px', '24px', '24px'),
    height: '100%',
    boxSizing: 'border-box',
  },
  loadingContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    ...shorthands.gap('12px'),
    position: 'sticky',
    top: 0,
    zIndex: 10,
    backgroundColor: tokens.colorNeutralBackground2,
    paddingBottom: '16px',
    paddingTop: '12px',
  },
});

const initialFilters: FilterValues = {
  channels: ['SMS', 'Email'],
  metrics: ['conversions_rate', 'impression_rate'],
};

export default function Overview() {
  const styles = useStyles();
  const isInitialMount = useRef(true);

  const [data, setData] = useState<OverviewApiResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [filterOptions, setFilterOptions] = useState<AnalyticsOptions | null>(null);

  const [selectedFilters, setSelectedFilters] = useState<FilterValues>(initialFilters);
  const [dateRange, setDateRange] = useState<DateRange>({ start: null, end: null });

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const [options, overviewData] = await Promise.all([
          fetchAnalyticsOptions(),
          fetchOverviewData({ start: null, end: null }, initialFilters),
        ]);

        setFilterOptions(options);
        setData(overviewData);

        const { start, end } = overviewData.meta.filters;
        if (start && end) {
          // API returns 'YYYY-MM-DD', new Date() will handle it correctly.
          setDateRange({ start: new Date(start), end: new Date(end) });
        }
      } catch (err: any) {
        console.error('Failed to load initial data:', err);
        setError(err.message || 'Could not load dashboard data.');
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialData();
  }, []);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    const fetchDataOnUpdate = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const fetchedData = await fetchOverviewData(dateRange, selectedFilters);
        setData(fetchedData);
      } catch (err: any) {
        console.error('Data fetching error:', err);
        setError(err.message || 'An unexpected error occurred.');
      } finally {
        setIsLoading(false);
      }
    };

    const timer = setTimeout(() => {
      fetchDataOnUpdate();
    }, 500); // Debounce API calls

    return () => clearTimeout(timer);
  }, [selectedFilters, dateRange]);

  const channelOptions = useMemo(
    () => filterOptions?.dimensions.find((d) => d.key === 'channel')?.options || [],
    [filterOptions]
  );
  const metricOptions = useMemo(() => filterOptions?.metrics || [], [filterOptions]);

  const handleFilterChange = (category: keyof FilterValues, selection: string[]) => {
    setSelectedFilters((prevFilters) => ({
      ...prevFilters,
      [category]: selection,
    }));
  };

  const getOptionsFromKeys = (options: FilterOption[] | { key: string; label: string }[]) =>
    options.map((opt) => opt.label);

  if (isLoading && !data) {
    return (
      <div className={styles.loadingContainer}>
        <Spinner size="huge" />
      </div>
    );
  }

  return (
    <div className={styles.root}>
      <header className={styles.header}>
        <Filter28Filled />
        <DateRangePicker value={dateRange} onChange={setDateRange} />
        {channelOptions.length > 0 && (
          <MultiSelect
            label="Channels"
            options={getOptionsFromKeys(channelOptions)}
            selectedOptions={selectedFilters.channels.map(
              (key) => channelOptions.find((opt) => opt.key === key)?.label || key
            )}
            onSelectionChange={(selectedLabels) => {
              const selectedKeys = selectedLabels.map(
                (label) => channelOptions.find((opt) => opt.label === label)?.key || ''
              );
              handleFilterChange(
                'channels',
                selectedKeys.filter((k) => k)
              );
            }}
          />
        )}
        {metricOptions.length > 0 && (
          <MultiSelect
            label="Metrics"
            options={getOptionsFromKeys(metricOptions)}
            selectedOptions={selectedFilters.metrics.map(
              (key) => metricOptions.find((opt) => opt.key === key)?.label || key
            )}
            onSelectionChange={(selectedLabels) => {
              const selectedKeys = selectedLabels.map(
                (label) => metricOptions.find((opt) => opt.label === label)?.key || ''
              );
              handleFilterChange(
                'metrics',
                selectedKeys.filter((k) => k)
              );
            }}
          />
        )}
      </header>

      {isLoading && <Spinner label="Updating data..." />}
      {error && !isLoading && (
        <Text weight="semibold" style={{ color: tokens.colorPaletteRedForeground1 }}>
          {error}
        </Text>
      )}

      {data && !error && (
        <>
          <OverallPerformance cards={data.cards} />
          <DailyPerformanceChart data={data.series} />
          {data.tables[0] && <ByChannelTable items={data.tables[0]} />}
        </>
      )}
    </div>
  );
}
