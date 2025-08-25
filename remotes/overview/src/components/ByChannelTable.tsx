import React from 'react';
import {
  TableBody,
  TableCell,
  TableRow,
  Table,
  TableHeader,
  TableHeaderCell,
  makeStyles,
  Card,
  Text,
  TableCellLayout,
} from '@fluentui/react-components';
import { ChannelPerformance } from '../types';

const useStyles = makeStyles({
  tableCard: {
    padding: 0,
    marginTop: '12px',
  },
});

const columns = [
  { columnKey: 'channel', label: 'Channel' },
  { columnKey: 'impr', label: 'Impr' },
  { columnKey: 'reach', label: 'Reach' },
  { columnKey: 'clicks', label: 'Clicks' },
  { columnKey: 'ctr', label: 'CTR' },
  { columnKey: 'cost', label: 'Cost' },
  { columnKey: 'leads', label: 'Leads' },
  { columnKey: 'purch', label: 'Purch' },
  { columnKey: 'conv', label: 'Conv' },
  { columnKey: 'cvr', label: 'CVR' },
];

export const ByChannelTable: React.FC<{ items: ChannelPerformance[] }> = ({ items }) => {
  const styles = useStyles();
  return (
    <section>
      <Text as="h2" size={600} weight="semibold">
        By Channel
      </Text>
      <Card className={styles.tableCard}>
        <Table arial-label="By Channel Performance">
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHeaderCell key={column.columnKey}>{column.label}</TableHeaderCell>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.channel}>
                <TableCell>
                  <TableCellLayout>{item.channel}</TableCellLayout>
                </TableCell>
                <TableCell>{item.impr.toLocaleString()}</TableCell>
                <TableCell>{item.reach.toLocaleString()}</TableCell>
                <TableCell>{item.clicks.toLocaleString()}</TableCell>
                <TableCell>{item.ctr.toFixed(1)}%</TableCell>
                <TableCell>${item.cost.toLocaleString()}</TableCell>
                <TableCell>{item.leads.toLocaleString()}</TableCell>
                <TableCell>{item.purch.toLocaleString()}</TableCell>
                <TableCell>{item.conv.toLocaleString()}</TableCell>
                <TableCell>{item.cvr.toFixed(1)}%</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </section>
  );
};
