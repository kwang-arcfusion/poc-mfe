// remotes/overview/src/Overview.tsx
import React, { useEffect, useState, useCallback, useMemo } from 'react'; // ✨ 1. เพิ่ม useMemo
import {
  makeStyles,
  shorthands,
  Spinner,
  tokens,
  Text,
  Button,
  ProgressBar,
} from '@fluentui/react-components';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { useLayoutStore } from '@arcfusion/store';
import { DateRangePicker, MultiSelect } from '@arcfusion/ui';
import { getModeFromValue } from '@arcfusion/ui';
import { ArrowCounterclockwiseFilled, Filter28Filled } from '@fluentui/react-icons';
import { OverallPerformance } from './components/OverallPerformance';
import { DailyPerformanceChart } from './components/DailyPerformanceChart';
import { ByChannelTable } from './components/ByChannelTable';
import { FilterPanel } from './components/FilterPanel';
import { useOverviewStore } from './stores/overviewFilterStore';

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
    gap: '6px',
    paddingLeft: '24px',
    paddingRight: '24px',
    paddingBottom: '48px',
  },
  loadingContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    flexDirection: 'column',
    ...shorthands.gap('16px'),
  },
  menuPopover: {
    minWidth: '120px',
  },
  applyButton: {
    minWidth: 0,
  },
  loadingBar: {},
});

// ✨ 2. กำหนด Type สำหรับ State การ Sort
type SortDirection = 'ascending' | 'descending';
interface SortState {
  sortColumn: string;
  sortDirection: SortDirection;
}

const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return debouncedValue;
};

export default function Overview() {
  const styles = useStyles();
  const { setMainOverflow } = useLayoutStore();
  const {
    initialize,
    overviewData,
    isLoading,
    error,
    isDirty,
    pendingDateRange,
    pendingOfferFilters,
    pendingChannelFilters,
    availableCampaignOffers,
    availableChannels,
    chartMetricKey,
    focusedOfferId,
    rightPanelData,
    isRightPanelVisible,
    searchOffers,
    setPendingDateRange,
    setPendingOfferFilters,
    setPendingChannelFilters,
    setChartMetricKey,
    setFocusedOfferId,
    applyFilters,
    cancelChanges,
  } = useOverviewStore();

  const [isPanelOpen, setIsPanelOpen] = React.useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  // ✨ 3. เพิ่ม State สำหรับการ Sort
  const [sortState, setSortState] = useState<SortState | null>(null);

  const mode = getModeFromValue(pendingDateRange);
  const isDateInvalid = !pendingDateRange.start || (mode === 'dateRange' && !pendingDateRange.end);

  useEffect(() => {
    setMainOverflow('hidden');
    initialize();
    return () => {
      setMainOverflow('auto');
    };
  }, []);

  useEffect(() => {
    if (debouncedSearchTerm !== undefined) {
      searchOffers(debouncedSearchTerm);
    }
  }, [debouncedSearchTerm, searchOffers]);

  // ✨ 4. สร้างฟังก์ชันสำหรับจัดการการ Sort
  const handleSort = (columnKey: string) => {
    setSortState((currentState) => {
      if (currentState?.sortColumn === columnKey) {
        // ถ้าคลิกคอลัมน์เดิม ให้สลับทิศทาง
        return {
          sortColumn: columnKey,
          sortDirection: currentState.sortDirection === 'ascending' ? 'descending' : 'ascending',
        };
      }
      // ถ้าคลิกคอลัมน์ใหม่ ให้เริ่ม sort แบบ ascending
      return {
        sortColumn: columnKey,
        sortDirection: 'ascending',
      };
    });
  };

  // ✨ 5. ใช้ useMemo เพื่อเรียงข้อมูลเมื่อ data หรือ sortState เปลี่ยนแปลง
  const sortedTableData = useMemo(() => {
    const table = overviewData?.tables?.[0];
    if (!table || !sortState) {
      return table; // คืนค่าเดิมถ้าไม่มีข้อมูลหรือยังไม่มีการ sort
    }

    const sortedRows = [...table.rows].sort((a, b) => {
      const aValue = a[sortState.sortColumn];
      const bValue = b[sortState.sortColumn];

      // ตรวจสอบว่าเป็นตัวเลขหรือไม่
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortState.sortDirection === 'ascending' ? aValue - bValue : bValue - aValue;
      }

      // ถ้าเป็น String
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortState.sortDirection === 'ascending'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      return 0;
    });

    return { ...table, rows: sortedRows };
  }, [overviewData, sortState]);

  const FilterActionButton = () => {
    if (isDirty) {
      return (
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button
            appearance="secondary"
            onClick={cancelChanges}
            icon={<ArrowCounterclockwiseFilled />}
          ></Button>
          <Button
            appearance="primary"
            icon={<Filter28Filled />}
            onClick={applyFilters}
            disabled={isLoading || isDateInvalid}
          >
            Apply
          </Button>
        </div>
      );
    }
    return null;
  };

  const renderLeftPanelContent = () => {
    if (isLoading && !overviewData) {
      return (
        <div className={styles.loadingContainer}>
          <Spinner size="huge" />
        </div>
      );
    }

    if (error && !isLoading) {
      return (
        <div className={styles.loadingContainer}>
          <Text weight="semibold" style={{ color: tokens.colorPaletteRedForeground1 }}>
            {error}
          </Text>
        </div>
      );
    }

    if (!overviewData) {
      return (
        <div className={styles.loadingContainer}>
          <Text weight="semibold">No data</Text>
        </div>
      );
    }

    return (
      <>
        {isLoading && (
          <div className={styles.loadingBar}>
            <ProgressBar />
          </div>
        )}
        <div className={styles.contentContainer}>
          <OverallPerformance
            cards={overviewData.cards}
            onCardClick={setChartMetricKey}
            selectedMetricKey={chartMetricKey}
          />
          <DailyPerformanceChart data={overviewData.series} metricKey={chartMetricKey} />
          {/* ✨ 6. ส่งข้อมูลที่ sort แล้ว และ props ที่จำเป็นลงไป */}
          {sortedTableData && (
            <ByChannelTable items={sortedTableData} sortState={sortState} onSort={handleSort} />
          )}
        </div>
      </>
    );
  };

  return (
    <div className={styles.pageContainer}>
      <header className={styles.header}>
        <Button
          appearance="subtle"
          icon={<Filter28Filled />}
          aria-label="Filters are up to date"
          disabled
        />
        <DateRangePicker
          value={pendingDateRange}
          onChange={setPendingDateRange}
          isInvalid={isDateInvalid}
        />
        <MultiSelect
          label="Offers"
          maxWidth={92}
          min={1}
          options={availableCampaignOffers}
          selectedOptions={pendingOfferFilters}
          onSelectionChange={(newSelection) => {
            const prefixedSelection = newSelection.map((id) => `offer_group:${id}`);
            setPendingOfferFilters(prefixedSelection);
          }}
          onSearchChange={setSearchTerm}
        />
        <MultiSelect
          min={1}
          label="Channels"
          options={availableChannels}
          selectedOptions={pendingChannelFilters}
          onSelectionChange={setPendingChannelFilters}
          showSelectAll
          showSelectAllByName={false}
        />
        <div style={{ flexGrow: 1 }} />
        <FilterActionButton />
      </header>
      <div className={styles.outer}>
        <div className={styles.splitGrid}>
          {isPanelOpen && isRightPanelVisible ? (
            <PanelGroup direction="horizontal">
              <Panel defaultSize={70} minSize={40}>
                <div className={styles.leftPane}>{renderLeftPanelContent()}</div>
              </Panel>
              <PanelResizeHandle className={styles.resizeHandle} />
              <Panel defaultSize={30} minSize={20}>
                <aside className={styles.rightPane}>
                  <FilterPanel
                    data={rightPanelData}
                    isLoading={isLoading}
                    onClose={() => setIsPanelOpen(false)}
                    onOfferClick={setFocusedOfferId}
                    focusedOfferId={focusedOfferId}
                  />
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
