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
} from '@fluentui/react-components';
import { ArrowDownload24Regular, Copy24Regular, Checkmark24Regular } from '@fluentui/react-icons';
import { getExportCsvUrl } from '@arcfusion/client';
// ✨ 1. แก้ไข Path การ Import
import type { SqlAsset, DataframeAsset } from '@arcfusion/types';

// ... (Styles เหมือนเดิม) ...
const useStyles = makeStyles({
  assetGroup: {
    ...shorthands.border('2px', 'solid', tokens.colorNeutralStroke2),
    ...shorthands.borderRadius(tokens.borderRadiusLarge),
    backgroundColor: tokens.colorNeutralBackground3,
    ...shorthands.padding(tokens.spacingVerticalM, tokens.spacingHorizontalM),
  },
  tabHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tabPanelPad: { ...shorthands.padding(tokens.spacingVerticalS, tokens.spacingHorizontalS) },
  codeBox: {
    ...shorthands.border('1px', 'solid', tokens.colorNeutralStroke2),
    ...shorthands.borderRadius(tokens.borderRadiusMedium),
    backgroundColor: tokens.colorNeutralBackground3,
    ...shorthands.padding(tokens.spacingVerticalS, tokens.spacingHorizontalS),
    fontFamily:
      'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
    fontSize: tokens.fontSizeBase200,
    overflowX: 'auto',
    whiteSpace: 'pre',
  },
  tableWrap: { overflowX: 'auto' },
});

interface SqlTableTabsProps {
  sql: SqlAsset;
  dataframe: DataframeAsset;
  messageId?: string;
}

export function SqlTableTabs({ sql, dataframe, messageId }: SqlTableTabsProps) {
  const styles = useStyles();
  const [activeTab, setActiveTab] = React.useState<TabValue>('table');
  const [copyState, setCopyState] = useState<'idle' | 'copied'>('idle');
  const timeoutRef = useRef<number | null>(null);

  const handleExport = () => {
    if (!messageId) {
      console.error('Cannot export: messageId is missing.');
      return;
    }
    const url = getExportCsvUrl(messageId);
    if (url) {
      window.open(url, '_blank');
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
    <div className={styles.assetGroup}>
      <div className={styles.tabHeader}>
        <TabList selectedValue={activeTab} onTabSelect={(_, data) => setActiveTab(data.value)}>
          <Tab value="table">Table</Tab> <Tab value="sql">SQL</Tab>
        </TabList>

        {activeTab === 'table' && messageId && (
          <Button
            size="small"
            icon={<ArrowDownload24Regular />}
            appearance="subtle"
            onClick={handleExport}
          >
            Export CSV
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
      </div>

      {activeTab === 'sql' && (
        <div className={styles.tabPanelPad}>
          <pre className={styles.codeBox}>{sql.sql}</pre>
        </div>
      )}

      {activeTab === 'table' && (
        <div className={styles.tabPanelPad}>
          <div className={styles.tableWrap}>
            <table>
              <thead>
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
      )}
    </div>
  );
}
