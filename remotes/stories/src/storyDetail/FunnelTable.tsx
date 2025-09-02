// remotes/stories/src/storyDetail/FunnelTable.tsx
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
} from '@fluentui/react-components';
import { FunnelRow } from './types';

const useStyles = makeStyles({ card: { ...shorthands.padding('16px'), rowGap: '8px' } });

export const FunnelTable: React.FC<{ rows: FunnelRow[] }> = ({ rows }) => {
  const s = useStyles();
  return (
    <Card appearance="filled" className={s.card}>
      <Text weight="semibold">Funnel — per 1,000 Clicks</Text>
      <Table size="small">
        <TableHeader>
          <TableRow>
            <TableHeaderCell>Step</TableHeaderCell>
            <TableHeaderCell>Current</TableHeaderCell>
            <TableHeaderCell>Prior</TableHeaderCell>
            <TableHeaderCell>Δ</TableHeaderCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((r) => (
            <TableRow key={r.step}>
              <TableCell>{r.step}</TableCell>
              <TableCell>{r.now}</TableCell>
              <TableCell>{r.prior}</TableCell>
              <TableCell>{r.delta}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
};
