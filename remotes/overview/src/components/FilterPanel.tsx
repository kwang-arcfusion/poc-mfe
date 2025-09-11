// remotes/overview/src/components/FilterPanel.tsx
import React, { useState, useRef, useEffect } from 'react';
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
} from '@fluentui/react-components';

// =================================================================
// Data and Types (เหมือนเดิม)
// =================================================================
type Metric = {
  label: string;
  value: number;
};

type PerformanceCardData = {
  id: string;
  title: string;
  imageColor: string;
  growth?: number;
  metrics: Metric[];
};

const mockOfferData: PerformanceCardData[] = [
  {
    id: 'offer-1',
    title: 'ndk:ContentPromo_MOU_ShortSeries_August_Promotion_Main',
    imageColor: '#a19f9d',
    growth: 30.6,
    metrics: [
      { label: 'Impressions', value: 167500000 },
      { label: 'Reach', value: 144600000 },
      { label: 'Engagement', value: 13200000 },
      { label: 'Clicks', value: 620240 },
      { label: 'Video views', value: 620240 },
    ],
  },
  {
    id: 'offer-2',
    title: 'True5G_Sim_Prepaid_Special',
    imageColor: '#605e5c',
    growth: 12.1,
    metrics: [
      { label: 'Impressions', value: 98200000 },
      { label: 'Reach', value: 85000000 },
      { label: 'Engagement', value: 9800000 },
      { label: 'Clicks', value: 410000 },
      { label: 'Video views', value: 380000 },
    ],
  },
  {
    id: 'offer-3',
    title: 'CP_FamilyPack_Discount_Aug',
    imageColor: '#b3b0ad',
    metrics: [
      { label: 'Impressions', value: 75000000 },
      { label: 'Reach', value: 68000000 },
      { label: 'Engagement', value: 5400000 },
    ],
  },
  {
    id: 'offer-4',
    title: 'NewUser_Welcome_Voucher_For_New_Subscribers_Only',
    imageColor: '#8a8886',
    growth: 45.8,
    metrics: [
      { label: 'Impressions', value: 210000000 },
      { label: 'Reach', value: 198000000 },
      { label: 'Engagement', value: 25000000 },
      { label: 'Clicks', value: 980000 },
    ],
  },
  {
    id: 'offer-5',
    title: 'GamingNation_TopUp_Promo',
    imageColor: '#c9c7c5',
    metrics: [
      { label: 'Impressions', value: 12000000 },
      { label: 'Reach', value: 11000000 },
      { label: 'Engagement', value: 2100000 },
      { label: 'Clicks', value: 95000 },
      { label: 'Video views', value: 89000 },
    ],
  },
  {
    id: 'offer-6',
    title: 'MovieLovers_Weekend_Pass',
    imageColor: '#a19f9d',
    growth: 8.2,
    metrics: [
      { label: 'Impressions', value: 45000000 },
      { label: 'Reach', value: 41000000 },
      { label: 'Engagement', value: 3800000 },
    ],
  },
];

const mockCampaignData: PerformanceCardData[] = [...mockOfferData]
  .reverse()
  .map((c) => ({ ...c, id: c.id.replace('offer', 'campaign') }));

// =================================================================
// Styles
// =================================================================
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
    ...shorthands.gap(tokens.spacingHorizontalL),
    ...shorthands.padding('12px'),
  },
  imagePlaceholder: {
    width: '100px',
    height: '100px',
    ...shorthands.borderRadius(tokens.borderRadiusMedium),
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
  }, // ✨ แก้ไข Style ตรงนี้
  popoverTitle: {
    fontWeight: tokens.fontWeightSemibold,
    paddingBottom: tokens.spacingVerticalXS,
    marginBottom: tokens.spacingVerticalS,
    ...shorthands.borderBottom('1px', 'solid', tokens.colorNeutralStroke2), // ลบ nowrap และ ellipsis ออก แล้วเพิ่ม word-break
    wordBreak: 'break-word',
  },
});

// =================================================================
// Helper and Sub-Component
// =================================================================
const formatMetricValue = (value: number): string => {
  if (value >= 1000000000) return `${(value / 1000000000).toFixed(1)}B`;
  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `${(value / 1000).toFixed(2)}K`;
  return value.toString();
};

const PerformanceCard: React.FC<{ data: PerformanceCardData }> = ({ data }) => {
  const styles = useStyles();
  const visibleMetrics = data.metrics.slice(0, 3);
  const hasMoreMetrics = data.metrics.length > 3;

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
    timeoutRef.current = window.setTimeout(() => {
      setIsOpen(false);
    }, 50); // delay สั้นๆ เพื่อให้สามารถเลื่อนเมาส์ไปที่ Popover ได้
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
        <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
          <Card className={styles.perfCard}>
            <div className={styles.imagePlaceholder} style={{ backgroundColor: data.imageColor }} />

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

// =================================================================
// Main FilterPanel Component (เหมือนเดิม)
// =================================================================
interface FilterPanelProps {
  onClose: () => void;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({ onClose }) => {
  const styles = useStyles();
  const [selectedTab, setSelectedTab] = React.useState('offers');

  return (
    <div className={styles.panelRoot}>
      <TabList
        selectedValue={selectedTab}
        onTabSelect={(_, data) => setSelectedTab(data.value as string)}
      >
        <Tab value="offers">Offers</Tab> <Tab value="campaigns">Campaigns</Tab>
      </TabList>

      <div className={styles.panelContainer}>
        {selectedTab === 'offers' &&
          mockOfferData.map((offer) => <PerformanceCard key={offer.id} data={offer} />)}

        {selectedTab === 'campaigns' &&
          mockCampaignData.map((campaign) => <PerformanceCard key={campaign.id} data={campaign} />)}
      </div>
    </div>
  );
};
