// remotes/overview/src/Overview.tsx
import React, { useEffect } from 'react';
import {
  makeStyles,
  shorthands,
  Spinner,
  tokens,
  Text,
  Button,
  Menu,
  MenuItem,
  MenuList,
  MenuPopover,
  MenuTrigger,
  SplitButton,
} from '@fluentui/react-components';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { useLayoutStore } from '@arcfusion/store';
import { DateRangePicker, MultiSelect } from '@arcfusion/ui';
import { Filter28Filled, MoreHorizontal24Filled } from '@fluentui/react-icons';
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
  menuPopover: {
    minWidth: '120px',
  },
  applyButton: {
    minWidth: 0,
  },
});

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
    pendingFilters,
    pendingCampaignOffers,
    availableCampaignOffers,
    availableChannels,
    chartMetricKey,
    focusedOfferId,
    rightPanelData,
    setPendingDateRange,
    setPendingFilters,
    setPendingCampaignOffers,
    setChartMetricKey,
    setFocusedOfferId,
    applyFilters,
    cancelChanges,
  } = useOverviewStore();

  const [isPanelOpen, setIsPanelOpen] = React.useState(true);

  useEffect(() => {
    setMainOverflow('hidden');
    initialize();
    return () => {
      setMainOverflow('auto');
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const FilterActionButton = () => {
    if (isDirty) {
      return (
        <Menu positioning="below-end">
          <MenuTrigger>
            {(triggerProps) => (
              <SplitButton
                appearance="primary"
                icon={<Filter28Filled />}
                menuButton={triggerProps}
                primaryActionButton={{
                  onClick: applyFilters,
                  className: styles.applyButton,
                }}
              >
                Apply
              </SplitButton>
            )}
          </MenuTrigger>
          <MenuPopover className={styles.menuPopover}>
            <MenuList>
              <MenuItem onClick={applyFilters}>Apply</MenuItem>
              <MenuItem onClick={cancelChanges}>Undo</MenuItem>
            </MenuList>
          </MenuPopover>
        </Menu>
      );
    }

    return (
      <Button
        appearance="subtle"
        icon={<Filter28Filled />}
        aria-label="Filters are up to date"
        disabled
      />
    );
  };

  const renderLeftPanelContent = () => {
    if (isLoading && !overviewData) {
      return (
        <div className={styles.loadingContainer}>
          <Spinner size="huge" label="Loading initial dashboard..." />
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
    if (overviewData) {
      return (
        <div className={styles.contentContainer}>
          {isLoading && <Spinner label="Applying filters..." />}
          <OverallPerformance
            cards={overviewData.cards}
            onCardClick={setChartMetricKey}
            selectedMetricKey={chartMetricKey}
          />
          <DailyPerformanceChart data={overviewData.series} metricKey={chartMetricKey} />
          {overviewData.tables[0] && <ByChannelTable items={overviewData.tables[0]} />}
        </div>
      );
    }
    return null;
  };

  return (
    <div className={styles.pageContainer}>
      <header className={styles.header}>
        <FilterActionButton />
        <DateRangePicker value={pendingDateRange} onChange={setPendingDateRange} />
        <MultiSelect
          label="Offers"
          maxWidth={92}
          options={availableCampaignOffers}
          selectedOptions={pendingCampaignOffers}
          onSelectionChange={setPendingCampaignOffers}
        />
        <MultiSelect
          label="Channels"
          options={availableChannels}
          selectedOptions={pendingFilters.channels}
          onSelectionChange={(s) => setPendingFilters('channels', s)}
        />
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
