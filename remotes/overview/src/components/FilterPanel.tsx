// remotes/overview/src/components/FilterPanel.tsx
import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  makeStyles,
  shorthands,
  tokens,
  Tab,
  TabList,
  Text,
  Card,
  Popover,
  PopoverTrigger,
  PopoverSurface,
  Body1,
  Spinner,
  mergeClasses,
} from '@fluentui/react-components';
// --- NEW: Import icons for the new design ---
import { Tag24Regular, MegaphoneLoud24Regular } from '@fluentui/react-icons';

// --- Type Definitions ---
type Metric = { label: string; value: number };
type PerformanceCardData = {
  id: string;
  title: string;
  campaignName: string;
  growth?: number;
  metrics: Metric[];
  // imageColor is no longer needed
};

// --- Styles ---
const useStyles = makeStyles({
  panelRoot: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    backgroundColor: tokens.colorNeutralBackground1,
    overflow: 'hidden',
  },
  panelContainer: {
    overflowY: 'auto',
    flexGrow: 1,
    ...shorthands.padding(tokens.spacingVerticalM, tokens.spacingHorizontalL),
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap(tokens.spacingVerticalL),
  },
  perfCard: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center', // Align items vertically
    ...shorthands.gap(tokens.spacingHorizontalL),
    ...shorthands.padding('16px'), // Increase padding slightly
    cursor: 'pointer',
    ...shorthands.border('2px', 'solid', 'transparent'),
    ':hover': {
      ...shorthands.borderColor(tokens.colorNeutralStroke1Hover),
      backgroundColor: tokens.colorNeutralBackground1Hover,
    },
  },
  selectedCard: {
    ...shorthands.borderColor(tokens.colorBrandStroke1),
    boxShadow: tokens.shadow8,
  },
  // --- NEW: Style for the icon container ---
  iconContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '48px',
    height: '48px',
    ...shorthands.borderRadius(tokens.borderRadiusCircular),
    backgroundColor: tokens.colorNeutralBackground2,
    color: tokens.colorNeutralForeground2,
    flexShrink: 0,
  },
  textContent: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    minWidth: 0,
  },
  title: {
    fontWeight: tokens.fontWeightSemibold,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    marginBottom: tokens.spacingVerticalS,
  },
  metricsContainer: {
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap(tokens.spacingVerticalXXS),
  },
  metricRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    ...shorthands.gap(tokens.spacingHorizontalM),
  },
  metricLabel: {
    color: tokens.colorNeutralForeground3,
  },
  metricValue: {
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorBrandForeground1,
    backgroundColor: tokens.colorBrandBackground2,
    ...shorthands.borderRadius(tokens.borderRadiusMedium),
    ...shorthands.padding(0, tokens.spacingHorizontalS),
    minWidth: '60px',
    textAlign: 'right',
  },
  popoverSurface: {
    ...shorthands.padding(tokens.spacingVerticalS, tokens.spacingHorizontalM),
    ...shorthands.borderRadius(tokens.borderRadiusMedium),
    boxShadow: tokens.shadow16,
    width: '280px',
  },
  popoverTitle: {
    fontWeight: tokens.fontWeightSemibold,
    paddingBottom: tokens.spacingVerticalXS,
    marginBottom: tokens.spacingVerticalS,
    ...shorthands.borderBottom('1px', 'solid', tokens.colorNeutralStroke2),
    wordBreak: 'break-word',
  },
  center: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
});

const formatMetricValue = (value: number): string => {
  if (value >= 1000000000) return `${(value / 1000000000).toFixed(1)}B`;
  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `${(value / 1000).toFixed(2)}K`;
  return value.toString();
};

const PerformanceCard: React.FC<{
  data: Omit<PerformanceCardData, 'campaignName'>;
  icon: React.ReactNode; // <-- Pass icon as a prop
  onClick?: () => void;
  isSelected?: boolean;
}> = ({ data, icon, onClick, isSelected }) => {
  const styles = useStyles();
  const visibleMetrics = data.metrics.slice(0, 2); // Show 2 metrics to keep it clean
  const [isOpen, setIsOpen] = useState(false);
  const timeoutRef = useRef<number>();

  useEffect(() => {
    return () => {
      clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleMouseEnter = () => {
    clearTimeout(timeoutRef.current);
    setIsOpen(true);
  };
  const handleMouseLeave = () => {
    timeoutRef.current = window.setTimeout(() => setIsOpen(false), 50);
  };

  const popoverContent = (
    <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <Text as="h3" size={400} className={styles.popoverTitle} title={data.title}>
        {data.title}
      </Text>
      <div className={styles.metricsContainer}>
        {data.metrics.map((metric) => (
          <div key={metric.label} className={styles.metricRow}>
            <Body1 className={styles.metricLabel}>{metric.label}</Body1>
            <Body1 className={styles.metricValue}>{formatMetricValue(metric.value)}</Body1>
          </div>
        ))}
      </div>
    </div>
  );
  return (
    <Popover withArrow positioning="before" open={isOpen}>
      <PopoverTrigger disableButtonEnhancement>
        <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} onClick={onClick}>
          <Card className={mergeClasses(styles.perfCard, isSelected && styles.selectedCard)}>
            {/* --- REPLACEMENT: Use Icon instead of image placeholder --- */}
            <div className={styles.iconContainer}>{icon}</div>
            <div className={styles.textContent}>
              <Text size={400} className={styles.title} title={data.title}>
                {data.title}
              </Text>
              <div className={styles.metricsContainer}>
                {visibleMetrics.map((metric) => (
                  <div key={metric.label} className={styles.metricRow}>
                    <Text size={300} className={styles.metricLabel}>
                      {metric.label}
                    </Text>
                    <Text size={300} className={styles.metricValue}>
                      {formatMetricValue(metric.value)}
                    </Text>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </PopoverTrigger>
      <PopoverSurface className={styles.popoverSurface}>{popoverContent}</PopoverSurface>
    </Popover>
  );
};

interface FilterPanelProps {
  data: PerformanceCardData[];
  isLoading: boolean;
  onClose: () => void;
  onOfferClick: (offerId: string) => void;
  focusedOfferId: string | null;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
  data,
  isLoading,
  onClose,
  onOfferClick,
  focusedOfferId,
}) => {
  const styles = useStyles();
  const [selectedTab, setSelectedTab] = React.useState<'offers' | 'campaigns'>('offers');

  const campaignData = useMemo(() => {
    if (!data) return [];
    const campaignAggregates = new Map<
      string,
      { id: string; title: string; metrics: { [label: string]: number } }
    >();
    data.forEach((offer) => {
      if (!campaignAggregates.has(offer.campaignName)) {
        campaignAggregates.set(offer.campaignName, {
          id: offer.campaignName,
          title: offer.campaignName,
          metrics: {},
        });
      }
      const campaign = campaignAggregates.get(offer.campaignName)!;
      offer.metrics.forEach((metric) => {
        campaign.metrics[metric.label] = (campaign.metrics[metric.label] || 0) + metric.value;
      });
    });
    return Array.from(campaignAggregates.values()).map((c) => ({
      ...c,
      campaignName: c.title,
      metrics: Object.entries(c.metrics).map(([label, value]) => ({ label, value })),
    }));
  }, [data]);

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className={styles.center}>
          <Spinner />
        </div>
      );
    }
    const isOfferTab = selectedTab === 'offers';
    const itemsToRender = isOfferTab ? data : campaignData;

    if (!itemsToRender || itemsToRender.length === 0) {
      return (
        <div className={styles.center}>
          <Text>No data to display.</Text>
        </div>
      );
    }
    return itemsToRender.map((item) => (
      <PerformanceCard
        key={item.id}
        data={item}
        // --- NEW: Dynamically provide the correct icon ---
        icon={isOfferTab ? <Tag24Regular /> : <MegaphoneLoud24Regular />}
        onClick={isOfferTab ? () => onOfferClick(item.id) : undefined}
        isSelected={isOfferTab && item.id === focusedOfferId}
      />
    ));
  };

  return (
    <div className={styles.panelRoot}>
      <TabList
        selectedValue={selectedTab}
        onTabSelect={(_, data) => setSelectedTab(data.value as 'offers' | 'campaigns')}
      >
        <Tab value="offers">Offers</Tab>
        <Tab value="campaigns">Campaigns</Tab>
      </TabList>
      <div className={styles.panelContainer}>{renderContent()}</div>
    </div>
  );
};
