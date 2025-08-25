import React, { useState, useEffect } from 'react';
import {
  makeStyles,
  shorthands,
  Spinner,
  Button,
  TagGroup,
  Tag,
  tokens,
} from '@fluentui/react-components';
import { Filter24Regular } from '@fluentui/react-icons';

import { OverviewData, FilterValues } from './types';
import { fetchOverviewData } from './services/api';

import { OverallPerformance } from './components/OverallPerformance';
import { DailyPerformanceChart } from './components/DailyPerformanceChart';
import { ByChannelTable } from './components/ByChannelTable';
import { FilterPanel } from './components/FilterPanel';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap('24px'),
    ...shorthands.padding('24px'),
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
    ...shorthands.gap('12px'),
    flexWrap: 'wrap',
  },
});

interface OverviewProps {
  navigate: (path: string) => void;
}

export default function Overview({ navigate }: OverviewProps) {
  const styles = useStyles();
  const [data, setData] = useState<OverviewData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState<FilterValues>({
    channels: ['Facebook'], // ค่าเริ่มต้น
  });

  useEffect(() => {
    setIsLoading(true);
    fetchOverviewData(filters).then((fetchedData) => {
      setData(fetchedData);
      setIsLoading(false);
    });
  }, [filters]); // Rerun effect when filters change

  const handleFilterChange = (newFilters: FilterValues) => {
    setFilters(newFilters);
  };

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <Spinner size="huge" />
      </div>
    );
  }

  if (!data) {
    return <div>Error loading data.</div>;
  }

  return (
    <div className={styles.root}>
      {/* ส่วนที่ 1: Filter */}
      <FilterPanel
        isOpen={isFilterOpen}
        onOpenChange={setIsFilterOpen}
        filters={filters}
        onFiltersChange={handleFilterChange}
      />
      <header className={styles.header}>
        <Button icon={<Filter24Regular />} onClick={() => setIsFilterOpen(true)}>
          Filter
        </Button>
        <TagGroup>
          {filters.channels?.map((channel) => (
            <Tag key={channel} shape="rounded">
              {channel}
            </Tag>
          ))}
        </TagGroup>
        {/* แสดง Badge อื่นๆ จาก filter ที่นี่ */}
      </header>

      {/* ส่วนที่ 2: Overall Performance */}
      <OverallPerformance metrics={data.metrics} />

      {/* ส่วนที่ 3: Daily Performance */}
      <DailyPerformanceChart data={data.dailyPerformance} />

      {/* ส่วนที่ 4: By Channel Table */}
      <ByChannelTable items={data.channelPerformance} />
    </div>
  );
}
