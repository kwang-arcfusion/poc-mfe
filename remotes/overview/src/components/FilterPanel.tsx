// remotes/overview/src/components/FilterPanel.tsx

import React, { useMemo } from 'react';
import {
  makeStyles,
  shorthands,
  tokens,
  Tab,
  TabList,
  Text,
  Card,
  Spinner, // Spinner ถูก import อยู่แล้ว
  mergeClasses,
} from '@fluentui/react-components';

type Metric = { label: string; value: number };
type PerformanceCardData = {
  id: string;
  title: string;
  campaign_name: string;
  growth?: number;
  metrics: Metric[];
};

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
    flexDirection: 'column',
    ...shorthands.gap(tokens.spacingVerticalL),
    ...shorthands.padding('16px'),
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
  textContent: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
  },
  title: {
    fontWeight: tokens.fontWeightSemibold,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    marginBottom: tokens.spacingVerticalM,
    color: tokens.colorBrandForeground2Hover,
  },
  metricsContainer: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    columnGap: tokens.spacingHorizontalL,
    rowGap: tokens.spacingVerticalS,
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
    ...shorthands.padding(tokens.spacingVerticalXXS, tokens.spacingHorizontalS),
    minWidth: '40px',
    textAlign: 'center',
  },
  center: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  panelHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexShrink: 0,
    ...shorthands.padding(0, tokens.spacingHorizontalL),
  },
});

const formatMetricValue = (value: number): string => {
  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
  return value.toLocaleString();
};

const PerformanceCard: React.FC<{
  data: Omit<PerformanceCardData, 'campaign_name'>;
  onClick?: () => void;
  isSelected?: boolean;
}> = ({ data, onClick, isSelected }) => {
  const styles = useStyles();

  return (
    <div onClick={onClick}>
      <Card className={mergeClasses(styles.perfCard, isSelected && styles.selectedCard)}>
        <div className={styles.textContent}>
          <Text size={400} className={styles.title} title={data.title}>
            {data.title}
          </Text>
          <div className={styles.metricsContainer}>
            {data.metrics.map((metric) => (
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
      // แก้ไขโดยเปลี่ยนไปอ่านจาก offer.campaign_name
      const campaignKey = offer.campaign_name || 'Uncategorized';

      if (!campaignAggregates.has(campaignKey)) {
        campaignAggregates.set(campaignKey, {
          id: campaignKey,
          title: campaignKey,
          metrics: {},
        });
      }
      const campaign = campaignAggregates.get(campaignKey)!;
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
    const isOfferTab = selectedTab === 'offers';
    const itemsToRender = isOfferTab ? data : campaignData;

    if (!itemsToRender || itemsToRender.length === 0) {
      if (isLoading) {
        return (
          <div className={styles.center}>
            <Spinner />
          </div>
        );
      }
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
        onClick={isOfferTab ? () => onOfferClick(item.id) : undefined}
        isSelected={isOfferTab && item.id === focusedOfferId}
      />
    ));
  };

  return (
    <div className={styles.panelRoot}>
      <div className={styles.panelHeader}>
        <TabList
          selectedValue={selectedTab}
          onTabSelect={(_, data) => setSelectedTab(data.value as 'offers' | 'campaigns')}
        >
          <Tab value="offers">Offers</Tab>
          <Tab value="campaigns">Campaigns</Tab>
        </TabList>
        {isLoading && <Spinner size="tiny" />}
      </div>
      <div className={styles.panelContainer}>{renderContent()}</div>
    </div>
  );
};
