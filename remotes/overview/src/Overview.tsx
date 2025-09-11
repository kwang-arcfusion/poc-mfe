// remotes/overview/src/Overview.tsx
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { makeStyles, shorthands, Spinner, tokens, Text, Button } from '@fluentui/react-components';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { useLayoutStore } from '@arcfusion/store';

import { OverviewApiResponse, FilterValues, AnalyticsOptions, FilterOption } from './types';
import { fetchOverviewData, fetchAnalyticsOptions } from './services/api';

import { OverallPerformance } from './components/OverallPerformance';
import { DailyPerformanceChart } from './components/DailyPerformanceChart';
import { ByChannelTable } from './components/ByChannelTable';
import { FilterPanel } from './components/FilterPanel';
import { Filter28Filled, MoreHorizontal24Filled } from '@fluentui/react-icons';
import { DateRangePicker, type DateRange, MultiSelect, type OptionGroup } from '@arcfusion/ui';

const useStyles = makeStyles({
  pageContainer: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    backgroundColor: tokens.colorNeutralBackground2,
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    ...shorthands.gap('12px'),
    flexShrink: 0,
    ...shorthands.padding('12px', '24px', '16px', '24px'),
    ...shorthands.borderBottom('1px', 'solid', tokens.colorNeutralStroke2),
    backgroundColor: tokens.colorNeutralBackground2,
  },
  outer: {
    flexGrow: 1,
    position: 'relative',
    overflow: 'hidden',
    // TODO: workaround, should use another approch
    height: 'calc(100vh - 130px)',
  },
  splitGrid: {
    display: 'flex',
    height: '100%',
  },
  leftPane: {
    height: '100%',
    overflowY: 'auto',
  },
  rightPane: {
    height: '100%',
    overflow: 'hidden',
    ...shorthands.border('1px', 'solid', tokens.colorNeutralStroke2),
    ...shorthands.borderRadius(tokens.borderRadiusLarge),
    backgroundColor: tokens.colorNeutralBackground1,
    minWidth: '320px',
  },
  resizeHandle: {
    width: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    outline: 'none',
    ':after': {
      content: '""',
      display: 'block',
      width: '2px',
      height: '32px',
      backgroundColor: tokens.colorNeutralStroke2,
      ...shorthands.borderRadius(tokens.borderRadiusMedium),
    },
  },
  contentContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
    paddingLeft: '24px',
    paddingRight: '24px',
    paddingBottom: '24px',
  },
  loadingContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
});

const initialFilters: FilterValues = {
  channels: ['SMS', 'Email'],
  metrics: ['conversions_rate', 'impression_rate'],
};

const mockCampaignData: OptionGroup[] = [
  {
    name: 'holiday',
    children: [
      { id: '1', name: 'Happy Songkran Day' },
      { id: '2', name: 'Happy New Year' },
    ],
  },
  {
    name: 'holiday-2',
    children: [
      { id: '3', name: 'Songkran Day 2' },
      { id: '4', name: 'Happy Chinese Day' },
    ],
  },
  {
    name: 'holiday-3',
    children: [
      { id: '5', name: 'Happy Songkran Day' },
      { id: '6', name: 'Happy Chinese Day 3' },
    ],
  },
];

export default function Overview() {
  const styles = useStyles();
  const isInitialMount = useRef(true);
  const { setMainOverflow } = useLayoutStore();

  const [data, setData] = useState<OverviewApiResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [filterOptions, setFilterOptions] = useState<AnalyticsOptions | null>(null);
  const [selectedFilters, setSelectedFilters] = useState<FilterValues>(initialFilters);
  const [dateRange, setDateRange] = useState<DateRange>({ start: null, end: null });
  const [selectedCampaignOffers, setSelectedCampaignOffers] = useState<string[]>([]);
  const [isPanelOpen, setIsPanelOpen] = useState(true);

  useEffect(() => {
    setMainOverflow('hidden');
    return () => {
      setMainOverflow('auto');
    };
  }, [setMainOverflow]);

  useEffect(() => {
    const loadInitialData = async () => {
      setIsLoading(true);
      try {
        setError(null);
        const [options, overviewData] = await Promise.all([
          fetchAnalyticsOptions(),
          fetchOverviewData({ start: null, end: null }, initialFilters),
        ]);
        setFilterOptions(options);
        setData(overviewData);
        const { start, end } = overviewData.meta.filters;
        if (start && end) {
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
    }, 500);
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

  const channelOptionGroups: OptionGroup[] = useMemo(
    () => [{ name: '', children: channelOptions.map((opt) => ({ id: opt.key, name: opt.label })) }],
    [channelOptions]
  );

  const metricOptionGroups: OptionGroup[] = useMemo(
    () => [{ name: '', children: metricOptions.map((opt) => ({ id: opt.key, name: opt.label })) }],
    [metricOptions]
  );

  const renderLeftPanelContent = () => {
    if (isLoading && !data) {
      return (
        <div className={styles.loadingContainer}>
          <Spinner size="huge" />
        </div>
      );
    }

    return (
      <div className={styles.contentContainer}>
        {isLoading && <Spinner />}
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
  };

  return (
    <div className={styles.pageContainer}>
      <header className={styles.header}>
        <Filter28Filled />

        {isLoading ? (
          <Spinner size="tiny" label="Loading filters..." />
        ) : (
          <>
            <DateRangePicker value={dateRange} onChange={setDateRange} />
            <MultiSelect
              label="Offers"
              options={mockCampaignData}
              selectedOptions={selectedCampaignOffers}
              onSelectionChange={setSelectedCampaignOffers}
            />
            {channelOptions.length > 0 && (
              <MultiSelect
                label="Channels"
                options={channelOptionGroups}
                selectedOptions={selectedFilters.channels}
                onSelectionChange={(s) => handleFilterChange('channels', s)}
              />
            )}
            {metricOptions.length > 0 && (
              <MultiSelect
                label="Metrics"
                options={metricOptionGroups}
                selectedOptions={selectedFilters.metrics}
                onSelectionChange={(s) => handleFilterChange('metrics', s)}
              />
            )}
          </>
        )}

        <div style={{ flexGrow: 1 }} />
        <Button
          icon={<MoreHorizontal24Filled />}
          appearance="subtle"
          onClick={() => setIsPanelOpen(!isPanelOpen)}
          aria-label="Toggle filter panel"
        />
      </header>

      <div className={styles.outer}>
        <div className={styles.splitGrid}>
          {isPanelOpen ? (
            <PanelGroup direction="horizontal">
              <Panel defaultSize={70} minSize={40}>
                <div className={styles.leftPane}>{renderLeftPanelContent()}</div>
              </Panel>
              <PanelResizeHandle className={styles.resizeHandle} />
              <Panel defaultSize={30} minSize={20}>
                <aside className={styles.rightPane}>
                  <FilterPanel onClose={() => setIsPanelOpen(false)} />
                </aside>
              </Panel>
            </PanelGroup>
          ) : (
            <div className={styles.leftPane} style={{ width: '100%' }}>
              {renderLeftPanelContent()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
