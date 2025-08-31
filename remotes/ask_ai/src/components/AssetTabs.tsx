// remotes/ask_ai/src/components/AssetTabs.tsx
import * as React from 'react';
import {
  makeStyles,
  tokens,
  shorthands,
  Caption1,
  TabList,
  Tab,
  TabValue,
} from '@fluentui/react-components';
import type { AssetGroup } from '../types';

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
  chartBarWrap: {
    display: 'flex',
    alignItems: 'flex-end',
    ...shorthands.gap(tokens.spacingHorizontalS),
    height: '140px',
  },
  chartBar: {
    width: '24px',
    backgroundColor: tokens.colorBrandBackground,
    ...shorthands.borderRadius(tokens.borderRadiusMedium),
  },
  tableWrap: { overflowX: 'auto' },
});

type TabItem = { key: string; label: string; render: () => React.ReactNode };

export function AssetTabs({ group }: { group: AssetGroup }) {
  const styles = useStyles();
  const [active, setActive] = React.useState<TabValue>(() => {
    if (group.sqls[0]) return `sql:${group.sqls[0].id}`;
    if (group.dataframes[0]) return `df:${group.dataframes[0].id}`;
    if (group.charts[0]) return `chart:${group.charts[0].id}`;
    return 'none';
  });

  const tabs: TabItem[] = [];

  // SQL
  group.sqls.forEach((s) => {
    tabs.push({
      key: `sql:${s.id}`,
      label: `SQL`, // <-- แก้ไขตรงนี้
      render: () => (
        <div className={styles.tabPanelPad}>
          <pre className={styles.codeBox}>{s.sql}</pre>
        </div>
      ),
    });
  });

  // Tables
  group.dataframes.forEach((df) => {
    tabs.push({
      key: `df:${df.id}`,
      label: `Table`, // <-- แก้ไขตรงนี้
      render: () => (
        <div className={styles.tabPanelPad}>
          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  {df.columns.map((c) => (
                    <th key={c} style={{ textAlign: 'left', padding: '6px 10px' }}>
                      {c}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {df.rows.map((r, idx) => (
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
      ),
    });
  });

  // Charts (bar)
  group.charts.forEach((ch) => {
    if (ch.type === 'bar') {
      const max = Math.max(1, ...ch.values);
      tabs.push({
        key: `chart:${ch.id}`,
        label: `Chart`, // <-- แก้ไขตรงนี้เผื่ออนาคต
        render: () => (
          <div className={styles.tabPanelPad}>
            <div className={styles.chartBarWrap}>
              {ch.values.map((v, i) => (
                <div
                  key={i}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                >
                  <div className={styles.chartBar} style={{ height: `${(v / max) * 100}%` }} />
                  <Caption1>{ch.labels[i]}</Caption1>
                </div>
              ))}
            </div>
          </div>
        ),
      });
    }
  });

  if (tabs.length === 0) return null;

  const activeTab = tabs.find((t) => t.key === active) ?? tabs[0];

  return (
    <div className={styles.assetGroup}>
      <TabList selectedValue={active} onTabSelect={(_, data) => setActive(data.value)}>
        {tabs.map((t) => (
          <Tab key={t.key} value={t.key}>
            {t.label}
          </Tab>
        ))}
      </TabList>

      <div>{activeTab.render()}</div>
    </div>
  );
}
