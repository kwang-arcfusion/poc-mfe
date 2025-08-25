// remotes/overview/src/Overview.tsx
import React, { useState, useEffect } from 'react';
import {
  makeStyles,
  shorthands,
  Spinner,
  Button,
  tokens,
  Label,
  ToggleButton,
  Divider, // Divider ยังคง import อยู่ แต่เราจะไม่ใช้ใน JSX แล้ว
} from '@fluentui/react-components';

import { OverviewData, FilterValues } from './types';
import { fetchOverviewData } from './services/api';

import { OverallPerformance } from './components/OverallPerformance';
import { DailyPerformanceChart } from './components/DailyPerformanceChart';
import { ByChannelTable } from './components/ByChannelTable';
import { FilterPanel } from './components/FilterPanel';
import { Filter24Regular } from '@fluentui/react-icons';

// --- ⬇️ [1] แก้ไข Styles ⬇️ ---
const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap('12px'),
    paddingLeft: '24px',
    paddingRight: '24px',
    paddingBottom: '24px',
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
    alignItems: 'flex-start',
    ...shorthands.gap('12px'),
    flexWrap: 'wrap',
    position: 'sticky',
    top: 0,
    zIndex: 10,
    backgroundColor: tokens.colorNeutralBackground2,
    paddingBottom: '12px',
  },
  tagContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    ...shorthands.gap(tokens.spacingVerticalS, tokens.spacingHorizontalM),
  },
  filterGroup: {
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap(tokens.spacingHorizontalS),
    // เพิ่ม border, padding, และ borderRadius
    ...shorthands.border('1px', 'solid', tokens.colorNeutralStroke2),
    ...shorthands.borderRadius(tokens.borderRadiusMedium),
    paddingLeft: '6px',
  },
  filterButton: {
    fontSize: tokens.fontSizeBase200,
    fontWeight: tokens.fontWeightRegular,
  },
});
// --- ⬆️ สิ้นสุดการแก้ไข Styles ⬆️ ---

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

const allFilterOptions = {
  channels: ['Facebook', 'Google', 'TikTok', 'Instagram'],
  campaigns: ['Campaign Alpha', 'Campaign Beta', 'Campaign Charlie', 'Summer Sale'],
  groupBy: ['Day', 'Week', 'Campaign', 'Ad Set'],
  metrics: ['Impressions', 'Clicks', 'CTR', 'Conversions'],
  ads: ['Ad Creative 1', 'Ad Creative 2', 'Video Ad A', 'Carousel Ad B'],
};

const initialFilters: FilterValues = {
  channels: ['Facebook', 'Google', 'TikTok'],
  campaigns: [],
  groupBy: ['Day'],
  ads: [],
  metrics: [],
};

interface OverviewProps {
  navigate: (path: string) => void;
  isFilterOpen: boolean;
  setIsFilterOpen: (isOpen: boolean) => void;
}

export default function Overview({ navigate, isFilterOpen, setIsFilterOpen }: OverviewProps) {
  const styles = useStyles();
  const [data, setData] = useState<OverviewData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<FilterValues>(initialFilters);
  const [visibleFilterOptions, setVisibleFilterOptions] = useState<FilterValues>(initialFilters);

  useEffect(() => {
    setIsLoading(true);
    fetchOverviewData(filters).then((fetchedData) => {
      setData(fetchedData);
      setIsLoading(false);
    });
  }, [filters]);

  const handleFilterChange = (newFilters: FilterValues) => {
    setFilters(newFilters);
    setVisibleFilterOptions((prevVisible) => {
      const newVisible = { ...prevVisible };
      Object.keys(allFilterOptions).forEach((cat) => {
        const category = cat as keyof FilterValues;
        const existingVisibleItems = new Set(prevVisible[category] || []);
        const newlySelectedItems = newFilters[category] || [];
        newlySelectedItems.forEach((item) => existingVisibleItems.add(item));
        newVisible[category] = Array.from(existingVisibleItems);
      });
      return newVisible;
    });
  };

  const handleToggleFilter = (category: keyof FilterValues, option: string) => {
    setFilters((prevFilters) => {
      const currentSelection = prevFilters[category] || [];
      const isSelected = currentSelection.includes(option);
      let newSelection;

      if (isSelected) {
        newSelection = currentSelection.filter((item) => item !== option);
      } else {
        newSelection = [...currentSelection, option];
      }

      return {
        ...prevFilters,
        [category]: newSelection,
      };
    });
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
      <FilterPanel
        isOpen={isFilterOpen}
        onOpenChange={setIsFilterOpen}
        filters={filters}
        onFiltersChange={handleFilterChange}
      />
      <header className={styles.header}>
        <Filter24Regular></Filter24Regular>
        <div className={styles.tagContainer}>
          {/* --- ⬇️ [2] แก้ไข JSX ⬇️ --- */}
          {Object.entries(visibleFilterOptions)
            .filter(([, options]) => options && options.length > 0)
            .map(([category, options]) => (
              <div key={category} className={styles.filterGroup}>
                <Label size="small" weight="semibold">
                  {capitalize(category)}:
                </Label>
                {(options as string[]).map((option: string) => (
                  <ToggleButton
                    key={option}
                    className={styles.filterButton}
                    size="small"
                    appearance="subtle"
                    checked={filters[category as keyof FilterValues]?.includes(option) ?? false}
                    onClick={() => handleToggleFilter(category as keyof FilterValues, option)}
                  >
                    {option}
                  </ToggleButton>
                ))}
              </div>
              // --- ลบ Divider ออกจากตรงนี้ ---
            ))}
          {/* --- ⬆️ สิ้นสุดการแก้ไข JSX ⬆️ --- */}
        </div>
      </header>

      <OverallPerformance metrics={data.metrics} />
      <DailyPerformanceChart data={data.dailyPerformance} />
      <ByChannelTable items={data.channelPerformance} />
    </div>
  );
}
