// remotes/stories/src/storyDetail/MoversComparisonTable.tsx
import * as React from 'react';
import { useMemo } from 'react';
import {
  Text,
  makeStyles,
  tokens,
  shorthands,
  Card,
  Table,
  TableHeader,
  TableRow,
  TableHeaderCell,
  TableBody,
  TableCell,
} from '@fluentui/react-components';
import { ArrowUp16Regular, ArrowDown16Regular, DataArea24Color } from '@fluentui/react-icons';
import type { Story } from '@arcfusion/types';

const useStyles = makeStyles({
  tableCard: {
    padding: '26px',
    boxSizing: 'border-box',
    marginTop: '12px',
    overflowX: 'auto',
    backgroundColor: tokens.colorNeutralBackground3,
    ...shorthands.borderRadius(tokens.borderRadiusXLarge),
    boxShadow: tokens.shadow4,
  },
  tableWrapper: {
    backgroundColor: tokens.colorNeutralBackground2,
    padding: '12px',
    borderRadius: '12px',
    boxSizing: 'border-box',
  },
  tableLayout: {
    tableLayout: 'auto',
  },
  titleWrap: { display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' },
  title: {
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForeground3,
    fontSize: '18px',
  },
  headerCell: {
    fontWeight: tokens.fontWeightSemibold,
  },
  up: {
    color: tokens.colorPaletteGreenForeground2,
    display: 'flex',
    alignItems: 'left',
    gap: tokens.spacingHorizontalXS,
  },
  down: {
    color: tokens.colorPaletteRedForeground1,
    display: 'flex',
    alignItems: 'left',
    gap: tokens.spacingHorizontalXS,
  },
});

interface MoverDetail {
  name: string;
  baseline: number | string;
  latest: number | string;
  pointChange: number | string;
  percentChange: string;
  direction: 'up' | 'down';
}

// ✨ 1. สร้าง Type สำหรับข้อมูล detail เพื่อความชัดเจนและแก้ปัญหา
interface TriggerDetail {
  group: string[];
  baseline_value: number | null;
  latest_value: number | null;
}
interface MoverValue {
  baseline: number | null;
  latest: number | null;
}

interface MoversComparisonTableProps {
  story: Story;
}

const formatValue = (value: number | null | undefined) => {
  if (value === null || value === undefined) return 'N/A';
  return value.toLocaleString(undefined, { maximumFractionDigits: 2 });
};

export const MoversComparisonTable: React.FC<MoversComparisonTableProps> = ({ story }) => {
  const styles = useStyles();

  const moverDetails = useMemo((): MoverDetail[] => {
    const triggeredRuleResult = story.metadata_info?.trigger_evaluation?.rules?.find(
      (r: any) => r.result?.triggered
    )?.result;

    if (!story.top_movers || !triggeredRuleResult?.details) {
      return [];
    }

    // ✨ 2. กำหนด Type ของ Key และ Value ให้กับ Map
    const detailsMap = new Map<string, MoverValue>(
      // ✨ 3. ใช้ Type 'TriggerDetail' แทน 'any'
      triggeredRuleResult.details.map((d: TriggerDetail) => [
        d.group[0],
        { baseline: d.baseline_value, latest: d.latest_value },
      ])
    );

    return story.top_movers.map((mover) => {
      const detail = detailsMap.get(mover.name);
      // ตอนนี้ TypeScript รู้จัก Type ของ detail แล้ว Error จึงหายไป
      const baseline = detail?.baseline ?? 0;
      const latest = detail?.latest ?? 0;
      const pointChange = latest - baseline;
      const percentChangeValue = baseline !== 0 ? (pointChange / baseline) * 100 : 0;

      return {
        name: mover.name,
        baseline: formatValue(baseline),
        latest: formatValue(latest),
        pointChange: formatValue(pointChange),
        percentChange: `${percentChangeValue.toFixed(2)}%`,
        direction: mover.direction,
      };
    });
  }, [story]);

  if (moverDetails.length === 0) {
    return null;
  }

  return (
    <Card className={styles.tableCard}>
      <div className={styles.titleWrap}>
        <DataArea24Color />
        <Text className={styles.title}>Top Movers Breakdown</Text>
      </div>
      <div className={styles.tableWrapper}>
        <Table arial-label="Top Movers Breakdown" className={styles.tableLayout}>
          <TableHeader>
            <TableRow>
              <TableHeaderCell>
                <Text weight="medium" style={{ color: tokens.colorBrandForeground2Hover }}>
                  Offer/Channel
                </Text>
              </TableHeaderCell>
              <TableHeaderCell style={{ textAlign: 'left' }}>
                <Text weight="medium" style={{ color: tokens.colorBrandForeground2Hover }}>
                  Baseline Value
                </Text>
              </TableHeaderCell>
              <TableHeaderCell style={{ textAlign: 'left' }}>
                <Text weight="medium" style={{ color: tokens.colorBrandForeground2Hover }}>
                  Latest Value
                </Text>
              </TableHeaderCell>
              <TableHeaderCell style={{ textAlign: 'left' }}>
                <Text weight="medium" style={{ color: tokens.colorBrandForeground2Hover }}>
                  Point Change
                </Text>
              </TableHeaderCell>
              <TableHeaderCell style={{ textAlign: 'left' }}>
                <Text weight="medium" style={{ color: tokens.colorBrandForeground2Hover }}>
                  % Change
                </Text>
              </TableHeaderCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {moverDetails.map((item) => (
              <TableRow key={item.name}>
                <TableCell>{item.name}</TableCell>
                <TableCell style={{ textAlign: 'left' }}>{item.baseline}</TableCell>
                <TableCell style={{ textAlign: 'left' }}>{item.latest}</TableCell>
                <TableCell style={{ textAlign: 'left' }}>
                  <span className={item.direction === 'up' ? styles.up : styles.down}>
                    {item.pointChange}
                  </span>
                </TableCell>
                <TableCell style={{ textAlign: 'left' }}>
                  <span className={item.direction === 'up' ? styles.up : styles.down}>
                    {item.direction === 'up' ? <ArrowUp16Regular /> : <ArrowDown16Regular />}
                    {item.percentChange}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
};
