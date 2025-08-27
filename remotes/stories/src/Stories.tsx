// remotes/stories/src/Stories.tsx
import React, { useState } from 'react';
import {
  makeStyles,
  shorthands,
  Button,
  tokens, // Import 'tokens' for styling
} from '@fluentui/react-components';

// --- [ADDED] Imports for filters ---
import { Filter28Filled } from '@fluentui/react-icons';
import { DateRangePicker, type DateRange, MultiSelect } from '@arcfusion/ui';
// -----------------------------------

import { mockStories } from './data/mockData';
import { useGroupedStories } from './hooks/useGroupedStories';
import { StoryGroup } from './components/StoryGroup';

// --- [ADDED] Types and constants for filters (copied from Overview.tsx) ---
interface FilterValues {
  channels?: string[];
  campaigns?: string[];
  ads?: string[];
  groupBy?: string[];
  metrics?: string[];
}

const allFilterOptions = {
  channels: ['Facebook', 'Google', 'TikTok', 'Instagram'],
  campaigns: ['Campaign Alpha', 'Campaign Beta', 'Campaign Charlie', 'Summer Sale'],
  groupBy: ['Day', 'Week', 'Campaign', 'Ad Set'],
  ads: ['Ad Creative 1', 'Ad Creative 2', 'Video Ad A', 'Carousel Ad B'],
  metrics: ['Impressions', 'Clicks', 'CTR', 'Conversions'],
};

const initialFilters: FilterValues = {
  channels: ['Facebook', 'Google', 'TikTok'],
  campaigns: [],
  groupBy: ['Day'],
  ads: [],
  metrics: [],
};
// --------------------------------------------------------------------------

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    paddingLeft: '24px',
    paddingRight: '24px',
    paddingBottom: '48px',
    boxSizing: 'border-box',
  }, // --- [ADDED] Header style for filters (copied from Overview.tsx) ---
  storiesGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '32px',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    ...shorthands.gap('12px'),
    position: 'sticky',
    top: 0,
    zIndex: 10,
    paddingTop: '12px',
    paddingBottom: '24px',
    backgroundColor: tokens.colorNeutralBackground2, // Add some padding to lift it off the content
  }, // -------------------------------------------------------------------
  footer: {
    display: 'flex',
    justifyContent: 'center',
    paddingTop: '32px',
    paddingBottom: '32px',
  },
});

export default function Stories() {
  const styles = useStyles();
  const allGroupedStories = useGroupedStories(mockStories);
  const [visibleGroupCount, setVisibleGroupCount] = useState(1); // --- [ADDED] State and handler for filters ---

  const [filters, setFilters] = useState<FilterValues>(initialFilters);
  const [dateRange, setDateRange] = useState<DateRange>({ start: null, end: null });

  const handleFilterChange = (category: keyof FilterValues, selection: string[]) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [category]: selection,
    }));
  }; // -------------------------------------------
  const visibleGroups = allGroupedStories.slice(0, visibleGroupCount);
  const hasMoreGroups = visibleGroupCount < allGroupedStories.length;

  const handleSeeMore = () => {
    if (hasMoreGroups) {
      setVisibleGroupCount((prevCount) => prevCount + 1);
    }
  };

  return (
    <div className={styles.root}>
      <header className={styles.header}>
        <Filter28Filled />
        <DateRangePicker value={dateRange} onChange={setDateRange} />
        <MultiSelect
          label="Channels"
          options={allFilterOptions.channels}
          selectedOptions={filters.channels || []}
          onSelectionChange={(selection) => handleFilterChange('channels', selection)}
        />
        <MultiSelect
          label="Campaigns"
          options={allFilterOptions.campaigns}
          selectedOptions={filters.campaigns || []}
          onSelectionChange={(selection) => handleFilterChange('campaigns', selection)}
        />
        <MultiSelect
          label="Group By"
          options={allFilterOptions.groupBy}
          selectedOptions={filters.groupBy || []}
          onSelectionChange={(selection) => handleFilterChange('groupBy', selection)}
        />
        <MultiSelect
          label="Ads"
          options={allFilterOptions.ads}
          selectedOptions={filters.ads || []}
          onSelectionChange={(selection) => handleFilterChange('ads', selection)}
        />
        <MultiSelect
          label="Metrics"
          options={allFilterOptions.metrics}
          selectedOptions={filters.metrics || []}
          onSelectionChange={(selection) => handleFilterChange('metrics', selection)}
        />
      </header>
      <div className={styles.storiesGroup}>
        {visibleGroups.map((group) => (
          <StoryGroup key={group.title} title={group.title} stories={group.stories} />
        ))}
      </div>

      {hasMoreGroups && (
        <div className={styles.footer}>
          <Button appearance="secondary" size="large" onClick={handleSeeMore}>
            See more
          </Button>
        </div>
      )}
    </div>
  );
}
