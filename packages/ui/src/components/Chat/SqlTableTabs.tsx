// packages/ui/src/components/Chat/SqlTableTabs.tsx
import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import {
  makeStyles,
  tokens,
  shorthands,
  TabList,
  Tab,
  TabValue,
  Button,
  Dialog,
  DialogSurface,
  DialogBody,
  DialogTitle,
  DialogActions,
  Tooltip,
  Text,
  Spinner,
} from '@fluentui/react-components';
import {
  ArrowDownload24Regular,
  Copy24Regular,
  Checkmark24Regular,
  Dismiss24Regular,
  FullScreenMaximize16Filled,
} from '@fluentui/react-icons';
import { getExportCsvUrl } from '@arcfusion/client';
import type { SqlAsset, DataframeAsset, ChartAsset } from '@arcfusion/types';
import ReactECharts from 'echarts-for-react';
import { useThemeStore } from '@arcfusion/store';

const useStyles = makeStyles({
  chartWrap: {
    overflowX: 'auto',
    overflowY: 'hidden',
    paddingBottom: '15px',
  },
  assetGroup: {
    ...shorthands.border('2px', 'solid', tokens.colorNeutralStroke2),
    ...shorthands.borderRadius(tokens.borderRadiusLarge),
    backgroundColor: tokens.colorNeutralBackground3,
    ...shorthands.padding(tokens.spacingVerticalM, tokens.spacingHorizontalM),
    width: '100%',
    boxSizing: 'border-box',
  },
  expandView: {
    opacity: 0.3,
    transition: '0.25s ease',
    ':hover': {
      opacity: 1,
    },
  },
  tabHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leftActions: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap(tokens.spacingHorizontalXS),
  },
  rightActions: {
    display: 'flex',
    alignItems: 'center',
  },
  dialogSurface: {
    width: '90vw',
    maxWidth: '1200px',
    height: '80vh',
  },
  dialogBody: {
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap(tokens.spacingVerticalM),
    height: '100%',
    overflowY: 'hidden',
  },
  dialogContent: {
    flexGrow: 1,
    overflowY: 'auto',
  },
  tabPanelPad: { ...shorthands.padding(tokens.spacingVerticalS, tokens.spacingHorizontalS) },
  codeBox: {
    maxHeight: '400px',
    overflow: 'auto',
    ...shorthands.border('1px', 'solid', tokens.colorNeutralStroke2),
    ...shorthands.borderRadius(tokens.borderRadiusMedium),
    backgroundColor: tokens.colorNeutralBackground1,
    ...shorthands.padding(tokens.spacingVerticalS, tokens.spacingHorizontalS),
    fontFamily:
      'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
    fontSize: tokens.fontSizeBase200,
    overflowX: 'auto',
    whiteSpace: 'pre',
  },
  tableWrap: {
    overflow: 'auto',
    maxHeight: '400px',
    '&::-webkit-scrollbar': {
      width: '8px',
      height: '8px',
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: tokens.colorNeutralStroke2,
      ...shorthands.borderRadius(tokens.borderRadiusMedium),
    },
  },
});

interface SqlTableTabsProps {
  sql: SqlAsset;
  dataframe?: DataframeAsset;
  // --- START EDIT ---
  // เรายังรับ chart object อยู่ แต่ข้างในจะมีแค่ processedConfig ที่สำคัญ
  chart?: ChartAsset & {
    processedConfig: Record<string, any>;
  };
  // --- END EDIT ---
  messageId?: string;
}

const TabContent = ({
  activeTab,
  sql,
  dataframe,
  chart,
  theme,
}: {
  activeTab: TabValue;
  sql: SqlAsset;
  dataframe?: DataframeAsset;
  // --- START EDIT ---
  // ลบ dynamicHeight และ dynamicWidth ออกจาก props
  chart?: ChartAsset & { processedConfig: Record<string, any> };
  theme: 'light' | 'dark';
  // --- END EDIT ---
}) => {
  const styles = useStyles();

  if (activeTab === 'sql') {
    return (
      <div className={styles.tabPanelPad}>
        <pre className={styles.codeBox}>{sql.sql}</pre>
      </div>
    );
  }

  // --- START EDIT ---
  // ปรับแก้ Logic การแสดงผล Chart
  if (activeTab === 'chart' && chart) {
    return (
      <ReactECharts
        option={chart.processedConfig}
        theme={theme}
        style={{
          height: '400px', // ใช้ความสูงคงที่
          width: '100%',
        }}
        notMerge={true}
        lazyUpdate={true}
      />
    );
  }
  // --- END EDIT ---

  if (!dataframe || dataframe.rows.length === 0) {
    return (
      <div className={styles.tabPanelPad} style={{ textAlign: 'center', padding: '24px' }}>
        <Text>No results to display.</Text>
      </div>
    );
  }

  return (
    <div className={styles.tabPanelPad}>
      <div className={styles.tableWrap}>
        <table style={{ width: '100%', position: 'relative' }}>
          <thead
            style={{
              position: 'sticky',
              top: 0,
              zIndex: 10,
              backgroundColor: tokens.colorNeutralBackground3,
            }}
          >
            <tr>
              {dataframe.columns.map((c: string) => (
                <th key={c} style={{ textAlign: 'left', padding: '6px 10px' }}>
                  {c}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {dataframe.rows.map((r: (string | number)[], idx: number) => (
              <tr key={idx}>
                {r.map((cell: string | number, i: number) => (
                  <td
                    key={i}
                    style={{
                      padding: '6px 10px',
                      borderTop: `1px solid ${tokens.colorNeutralStroke2}`,
                    }}
                  >
                    {String(cell)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export function SqlTableTabs({ sql, dataframe, chart, messageId }: SqlTableTabsProps) {
  const styles = useStyles();
  const { theme } = useThemeStore();

  const [activeTab, setActiveTab] = React.useState<TabValue>(
    chart ? 'chart' : dataframe ? 'table' : 'sql'
  );

  const [copyState, setCopyState] = useState<'idle' | 'copied'>('idle');
  const timeoutRef = useRef<number | null>(null);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isExportingCsv, setIsExportingCsv] = useState(false);

  const handleExportCsv = async () => {
    if (!messageId || isExportingCsv) {
      return;
    }

    setIsExportingCsv(true);
    try {
      const url = getExportCsvUrl(messageId);
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Failed to fetch CSV: ${response.statusText}`);
      }

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.setAttribute('download', `export-${messageId}.csv`);
      document.body.appendChild(link);
      link.click();

      link.remove();
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('Export CSV failed:', error);
    } finally {
      setIsExportingCsv(false);
    }
  };

  const handleCopy = async () => {
    if (copyState === 'copied') return;
    try {
      await navigator.clipboard.writeText(sql.sql);
      setCopyState('copied');
      timeoutRef.current = window.setTimeout(() => {
        setCopyState('idle');
      }, 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <>
      <div className={styles.assetGroup}>
        <div className={styles.tabHeader}>
          <div className={styles.leftActions}>
            <TabList selectedValue={activeTab} onTabSelect={(_, data) => setActiveTab(data.value)}>
              {chart && <Tab value="chart">Chart</Tab>}
              <Tab value="table">Table</Tab> <Tab value="sql">SQL</Tab>
            </TabList>
          </div>

          <div className={styles.rightActions}>
            {activeTab === 'table' && messageId && dataframe && dataframe.rows.length > 0 && (
              <Button
                size="small"
                icon={isExportingCsv ? <Spinner size="tiny" /> : <ArrowDownload24Regular />}
                appearance="subtle"
                onClick={handleExportCsv}
                disabled={isExportingCsv}
              >
                {isExportingCsv ? 'Exporting...' : 'Export CSV'}
              </Button>
            )}

            {activeTab === 'sql' && messageId && (
              <Button
                size="small"
                icon={copyState === 'idle' ? <Copy24Regular /> : <Checkmark24Regular />}
                appearance="subtle"
                onClick={handleCopy}
              >
                {copyState === 'idle' ? 'Copy SQL' : 'Copied!'}
              </Button>
            )}

            <Tooltip content="Expand view" relationship="label">
              <Button
                className={styles.expandView}
                size="small"
                icon={<FullScreenMaximize16Filled />}
                appearance="subtle"
                onClick={() => setIsDialogOpen(true)}
              />
            </Tooltip>
          </div>
        </div>

        <TabContent
          activeTab={activeTab}
          sql={sql}
          dataframe={dataframe}
          chart={chart}
          theme={theme}
        />
      </div>

      <Dialog open={isDialogOpen} onOpenChange={(_, data) => setIsDialogOpen(data.open)}>
        <DialogSurface className={styles.dialogSurface}>
          <DialogBody className={styles.dialogBody}>
            <DialogTitle>
              Asset Details
              <Button
                appearance="subtle"
                aria-label="close"
                icon={<Dismiss24Regular />}
                onClick={() => setIsDialogOpen(false)}
                style={{ position: 'absolute', top: '10px', right: '10px' }}
              />
            </DialogTitle>

            <div className={styles.dialogContent}>
              <TabList
                selectedValue={activeTab}
                onTabSelect={(_, data) => setActiveTab(data.value)}
              >
                {chart && <Tab value="chart">Chart</Tab>}
                <Tab value="table">Table</Tab>
                <Tab value="sql">SQL</Tab>
              </TabList>

              <TabContent
                activeTab={activeTab}
                sql={sql}
                dataframe={dataframe}
                chart={chart}
                theme={theme}
              />
            </div>
          </DialogBody>
        </DialogSurface>
      </Dialog>
    </>
  );
}
