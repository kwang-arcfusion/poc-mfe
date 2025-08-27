// remotes/stories/src/storyDetail/BreakdownTable.tsx
import * as React from 'react';
import {
  Card,
  Table,
  TableHeader,
  TableRow,
  TableHeaderCell,
  TableBody,
  TableCell,
  Text,
  makeStyles,
  shorthands,
  tokens,
} from '@fluentui/react-components';
import { BreakdownRow } from './types';

const useStyles = makeStyles({
  card: { ...shorthands.padding('16px'), rowGap: '8px' },
  red: { color: tokens.colorPaletteRedForeground1 },
});

type Props =
  | { title: string; columns: ['Segment', 'Conversions', 'CPA', 'Δ']; rows: BreakdownRow[] }
  | { title: string; columns: ['Segment', 'Share', 'Δ']; rows: BreakdownRow[] };

export const BreakdownTable: React.FC<Props> = ({ title, columns, rows }) => {
  const s = useStyles();
  const isDevice = columns.length === 4;
  return (
    <Card appearance="filled" className={s.card}>
      <Text weight="semibold">{title}</Text>
      <Table size="small">
        <TableHeader>
          <TableRow>
            {columns.map((c) => (
              <TableHeaderCell key={c}>{c}</TableHeaderCell>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((r) => (
            <TableRow key={r.seg}>
              <TableCell>{r.seg}</TableCell>
              {isDevice ? (
                <>
                  <TableCell>{r.conversions}</TableCell>
                  <TableCell>{r.cpa}</TableCell>
                </>
              ) : (
                <TableCell>{r.share}</TableCell>
              )}
              <TableCell className={s.red}>{r.delta}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
};
