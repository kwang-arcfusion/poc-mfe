// remotes/overview/src/components/FilterPanel.tsx
import React, { useState } from 'react'; // [FIX] เพิ่ม useState
import {
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerHeaderTitle,
  Button,
  Label,
  makeStyles,
  shorthands,
} from '@fluentui/react-components';

// --- ⬇️ [FIX] แก้ไขการ import DatePicker ⬇️ ---
import { DatePicker } from '@fluentui/react-datepicker-compat';
// --- ⬆️ สิ้นสุดการแก้ไข ⬆️ ---

import { Dismiss24Regular } from '@fluentui/react-icons';
import { FilterValues } from '../types';
import { FilterGroup } from './FilterGroup';

const useStyles = makeStyles({
  body: {
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap('24px'),
    overflowY: 'auto',
  },
  dateRangeContainer: {
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap('8px'),
  },
  datePickers: {
    display: 'flex',
    ...shorthands.gap('12px'),
  },
});

// Mock Data (เหมือนเดิม)
const mockCampaigns = ['Campaign Alpha', 'Campaign Beta', 'Campaign Charlie', 'Summer Sale'];
const mockAds = ['Ad Creative 1', 'Ad Creative 2', 'Video Ad A', 'Carousel Ad B'];
const mockChannels = ['Facebook', 'Google', 'TikTok', 'Instagram'];
const mockGroupBy = ['Day', 'Week', 'Campaign', 'Ad Set'];
const mockMetrics = ['Impressions', 'Clicks', 'CTR', 'Conversions'];

interface FilterPanelProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  filters: FilterValues;
  onFiltersChange: (newFilters: FilterValues) => void;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
  isOpen,
  onOpenChange,
  filters,
  onFiltersChange,
}) => {
  const styles = useStyles();

  // [FIX] เพิ่ม State สำหรับจัดการวันที่ที่เลือก
  const [selectedDates, setSelectedDates] = useState<{ start?: Date | null; end?: Date | null }>({
    start: null,
    end: null,
  });

  const handleGroupChange = (category: keyof FilterValues, selection: string[]) => {
    onFiltersChange({
      ...filters,
      [category]: selection,
    });
  };

  return (
    <Drawer
      type="overlay"
      separator
      open={isOpen}
      onOpenChange={(_, { open }) => onOpenChange(open)}
      position="start"
    >
      <DrawerHeader>
        <DrawerHeaderTitle
          action={
            <Button
              appearance="subtle"
              aria-label="Close"
              icon={<Dismiss24Regular />}
              onClick={() => onOpenChange(false)}
            />
          }
        >
          Filter
        </DrawerHeaderTitle>
      </DrawerHeader>
      <DrawerBody className={styles.body}>
        {/* --- ⬇️ ส่วนของ Date Range Picker (อัปเดต props) ⬇️ --- */}
        <div className={styles.dateRangeContainer}>
          <Label required size="large" weight="semibold">
            Date Range
          </Label>
          <div className={styles.datePickers}>
            <DatePicker
              placeholder="Start date"
              style={{ minWidth: 0, flexGrow: 1 }}
              value={selectedDates.start}
              onSelectDate={(date) => setSelectedDates((prev) => ({ ...prev, start: date }))}
            />
            <DatePicker
              placeholder="End date"
              style={{ minWidth: 0, flexGrow: 1 }}
              value={selectedDates.end}
              onSelectDate={(date) => setSelectedDates((prev) => ({ ...prev, end: date }))}
            />
          </div>
        </div>

        {/* --- ส่วนของ Filter Groups (เหมือนเดิม) --- */}
        <FilterGroup
          title="Campaigns"
          options={mockCampaigns}
          selectedOptions={filters.campaigns || []}
          onSelectionChange={(selection) => handleGroupChange('campaigns', selection)}
        />
        <FilterGroup
          title="Ads"
          options={mockAds}
          selectedOptions={filters.ads || []}
          onSelectionChange={(selection) => handleGroupChange('ads', selection)}
        />
        <FilterGroup
          title="Channels"
          options={mockChannels}
          selectedOptions={filters.channels || []}
          onSelectionChange={(selection) => handleGroupChange('channels', selection)}
        />
        <FilterGroup
          title="Group By"
          options={mockGroupBy}
          selectedOptions={filters.groupBy || []}
          onSelectionChange={(selection) => handleGroupChange('groupBy', selection)}
        />
        <FilterGroup
          title="Metrics"
          options={mockMetrics}
          selectedOptions={filters.metrics || []}
          onSelectionChange={(selection) => handleGroupChange('metrics', selection)}
        />
      </DrawerBody>
    </Drawer>
  );
};
