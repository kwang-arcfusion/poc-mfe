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
import { DataTrending24Color, ArrowUp16Regular, ArrowDown16Regular } from '@fluentui/react-icons';
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
  tableLayout: {
    tableLayout: 'auto',
    padding: '24px',
    borderRadius: '12px',
    backgroundColor: tokens.colorNeutralBackground2,
  },
  titleWrap: { display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' },
  title: {
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForeground3,
    fontSize: '18px',
  },
  // เราไม่จำเป็นต้องใช้ numericCell แล้ว เพราะจะใช้ inline style แทน
  // numericCell: {
  //   textAlign: 'left',
  // },
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

    const detailsMap = new Map(
      triggeredRuleResult.details.map((d: any) => [
        d.group[0],
        { baseline: d.baseline_value, latest: d.latest_value },
      ])
    );

    return story.top_movers.map((mover) => {
      const detail = detailsMap.get(mover.name);
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
        <DataTrending24Color />
        <Text className={styles.title}>Top Movers Breakdown</Text>
      </div>
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
              {/* FIX: เปลี่ยนจากการใช้ className มาเป็น inline style เพื่อให้จัดขวาแน่นอน */}
              <TableCell style={{ textAlign: 'left' }}>{item.baseline}</TableCell>
              <TableCell style={{ textAlign: 'left' }}>{item.latest}</TableCell>
              <TableCell style={{ textAlign: 'left' }}>
                <Text className={item.direction === 'up' ? styles.up : styles.down}>
                  {item.pointChange}
                </Text>
              </TableCell>
              <TableCell style={{ textAlign: 'left' }}>
                <Text className={item.direction === 'up' ? styles.up : styles.down}>
                  {item.direction === 'up' ? <ArrowUp16Regular /> : <ArrowDown16Regular />}
                  {item.percentChange}
                </Text>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
};
