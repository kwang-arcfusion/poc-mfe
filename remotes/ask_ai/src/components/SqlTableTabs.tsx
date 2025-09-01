// remotes/ask_ai/src/components/SqlTableTabs.tsx

import * as React from 'react';
import {
  makeStyles,
  tokens,
  shorthands,
  TabList,
  Tab,
  TabValue,
} from '@fluentui/react-components';
import type { SqlAsset, DataframeAsset } from '../types';

// ใช้ Styles จาก AssetTabs.tsx เดิมมาปรับใช้
const useStyles = makeStyles({
  assetGroup: {
    ...shorthands.border('2px', 'solid', tokens.colorNeutralStroke2),
    ...shorthands.borderRadius(tokens.borderRadiusLarge),
    backgroundColor: tokens.colorNeutralBackground3,
    ...shorthands.padding(tokens.spacingVerticalM, tokens.spacingHorizontalM),
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
}

export function SqlTableTabs({ sql, dataframe }: SqlTableTabsProps) {
  const styles = useStyles();
  const [activeTab, setActiveTab] = React.useState<TabValue>('sql');

  return (
    <div className={styles.assetGroup}>
      <TabList selectedValue={activeTab} onTabSelect={(_, data) => setActiveTab(data.value)}>
        <Tab value="sql">SQL</Tab>
        <Tab value="table">Table</Tab>
      </TabList>

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
                  {dataframe.columns.map((c) => (
                    <th key={c} style={{ textAlign: 'left', padding: '6px 10px' }}>
                      {c}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {dataframe.rows.map((r, idx) => (
                  <tr key={idx}>
                    {r.map((cell, i) => (
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