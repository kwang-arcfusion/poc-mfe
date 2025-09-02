// remotes/stories/src/Stories.tsx
import React, { useState, useEffect } from 'react';
import { makeStyles, shorthands, Button, tokens, Spinner } from '@fluentui/react-components';
import { Filter28Filled } from '@fluentui/react-icons';
import { DateRangePicker, type DateRange, MultiSelect } from '@arcfusion/ui';
import { useGroupedStories } from './hooks/useGroupedStories';
import { StoryGroup } from './components/StoryGroup';
// ✨ 1. Import สิ่งที่จำเป็นสำหรับการดึงข้อมูล
import { getStories } from '@arcfusion/client';
import type { Story } from '@arcfusion/types';

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

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    paddingLeft: '24px',
    paddingRight: '24px',
    paddingBottom: '48px',
    boxSizing: 'border-box',
  },
  // ✨ 2. เพิ่ม Style สำหรับ Loading และ Error state
  centerContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: 'calc(100vh - 200px)', // Adjust height as needed
    flexDirection: 'column',
    ...shorthands.gap('16px'),
  },
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
    backgroundColor: tokens.colorNeutralBackground2,
  },
  footer: {
    display: 'flex',
    justifyContent: 'center',
    paddingTop: '32px',
    paddingBottom: '32px',
  },
});

interface StoriesProps {
  navigate: (path: string) => void;
}

export default function Stories({ navigate }: StoriesProps) {
  const styles = useStyles();
  // ✨ 3. เพิ่ม State สำหรับจัดการข้อมูล, loading, และ error
  const [stories, setStories] = useState<Story[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const allGroupedStories = useGroupedStories(stories);
  const [visibleGroupCount, setVisibleGroupCount] = useState(1);
  const [filters, setFilters] = useState<FilterValues>(initialFilters);
  const [dateRange, setDateRange] = useState<DateRange>({ start: null, end: null });

  // ✨ 4. ใช้ useEffect เพื่อดึงข้อมูลจาก API
  useEffect(() => {
    const fetchStories = async () => {
      try {
        setIsLoading(true);
        const response = await getStories();
        console.log('Stories.tsx:101 |response| : ', response);
        setStories(response.items);
        setError(null);
      } catch (err) {
        setError('Failed to fetch stories. Please try again later.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStories();
  }, []);

  const handleFilterChange = (category: keyof FilterValues, selection: string[]) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [category]: selection,
    }));
  };
  const visibleGroups = allGroupedStories.slice(0, visibleGroupCount);
  const hasMoreGroups = visibleGroupCount < allGroupedStories.length;

  const handleSeeMore = () => {
    if (hasMoreGroups) {
      setVisibleGroupCount((prevCount) => prevCount + 1);
    }
  };

  // ✨ 5. เพิ่ม Logic การแสดงผลสำหรับ Loading และ Error states
  if (isLoading) {
    return (
      <div className={styles.centerContainer}>
        <Spinner size="huge" />
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.centerContainer}>
        <h3>{error}</h3>
      </div>
    );
  }

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
          <StoryGroup
            key={group.title}
            title={group.title}
            stories={group.stories}
            navigate={navigate}
          />
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
