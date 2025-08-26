// remotes/overview/src/Overview.tsx
import React, { useState, useEffect } from 'react';
import { makeStyles, shorthands, Spinner, tokens } from '@fluentui/react-components';

import { OverviewData, FilterValues } from './types';
import { fetchOverviewData } from './services/api';

import { OverallPerformance } from './components/OverallPerformance';
import { DailyPerformanceChart } from './components/DailyPerformanceChart';
import { ByChannelTable } from './components/ByChannelTable';
import { FilterGroupSelect } from './components/FilterGroupSelect';
import { Filter28Filled } from '@fluentui/react-icons';

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
  },
});

// --- [1] เพิ่ม Ads และ Metrics กลับเข้ามาใน options ---
const allFilterOptions = {
  channels: ['Facebook', 'Google', 'TikTok', 'Instagram'],
  campaigns: ['Campaign Alpha', 'Campaign Beta', 'Campaign Charlie', 'Summer Sale'],
  groupBy: ['Day', 'Week', 'Campaign', 'Ad Set'],
  ads: ['Ad Creative 1', 'Ad Creative 2', 'Video Ad A', 'Carousel Ad B'],
  metrics: ['Impressions', 'Clicks', 'CTR', 'Conversions'],
};

// --- [2] เพิ่ม Ads และ Metrics กลับเข้ามาในค่าเริ่มต้น ---
const initialFilters: FilterValues = {
  channels: ['Facebook', 'Google', 'TikTok'],
  campaigns: [],
  groupBy: ['Day'],
  ads: [],
  metrics: [],
};

interface OverviewProps {
  navigate: (path: string) => void;
}

export default function Overview({ navigate }: OverviewProps) {
  const styles = useStyles();
  const [data, setData] = useState<OverviewData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<FilterValues>(initialFilters);

  useEffect(() => {
    setIsLoading(true);
    fetchOverviewData(filters).then((fetchedData) => {
      setData(fetchedData);
      setIsLoading(false);
    });
  }, [filters]);

  const handleFilterChange = (category: keyof FilterValues, selection: string[]) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [category]: selection,
    }));
  };

  if (isLoading && !data) {
    return (
      <div className={styles.loadingContainer}>
        <Spinner size="huge" />
      </div>
    );
  }

  if (!data) {
    return <h3>Error loading data.</h3>;
  }

  return (
    <div className={styles.root}>
      <header className={styles.header}>
        <Filter28Filled />
        <FilterGroupSelect
          label="Channels"
          options={allFilterOptions.channels}
          selectedOptions={filters.channels || []}
          onSelectionChange={(selection) => handleFilterChange('channels', selection)}
        />
        <FilterGroupSelect
          label="Campaigns"
          options={allFilterOptions.campaigns}
          selectedOptions={filters.campaigns || []}
          onSelectionChange={(selection) => handleFilterChange('campaigns', selection)}
        />
        <FilterGroupSelect
          label="Group By"
          options={allFilterOptions.groupBy}
          selectedOptions={filters.groupBy || []}
          onSelectionChange={(selection) => handleFilterChange('groupBy', selection)}
        />
        {/* --- [3] เพิ่ม Component สำหรับ Ads และ Metrics --- */}
        <FilterGroupSelect
          label="Ads"
          options={allFilterOptions.ads}
          selectedOptions={filters.ads || []}
          onSelectionChange={(selection) => handleFilterChange('ads', selection)}
        />
        <FilterGroupSelect
          label="Metrics"
          options={allFilterOptions.metrics}
          selectedOptions={filters.metrics || []}
          onSelectionChange={(selection) => handleFilterChange('metrics', selection)}
        />
      </header>

      <OverallPerformance metrics={data.metrics} />
      <DailyPerformanceChart data={data.dailyPerformance} />
      <ByChannelTable items={data.channelPerformance} />
    </div>
  );
}
