// remotes/overview/src/components/ByChannelTable.tsx
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
import { TableData } from '../types';

const useStyles = makeStyles({
  tableCard: {
    padding: 0,
    marginTop: '12px',
    overflowX: 'auto',
  },
  tableLayout: {
    tableLayout: 'auto',
  },
});

const formatCell = (
  value: string | number,
  format: { type: string; precision?: number | null }
) => {
  if (typeof value !== 'number') return value;

  if (format.type === 'percent') {
    return `${value.toFixed(format.precision ?? 1)}%`;
  }
  if (format.type === 'currency') {
    return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
  }
  return value.toLocaleString();
};

export const ByChannelTable: React.FC<{ items: TableData }> = ({ items }) => {
  const styles = useStyles();

  return (
    <section>
      <Text as="h2" size={500} weight="semibold">
        {items.title}
      </Text>
      <Card className={styles.tableCard}>
        <Table aria-label={items.title} className={styles.tableLayout}>
          <TableHeader>
            <TableRow>
              <TableHeaderCell key={items.dimension.key}>{items.dimension.label}</TableHeaderCell>
              {items.columns.map((column) => (
                <TableHeaderCell key={column.key}>{column.label}</TableHeaderCell>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.rows.map((row, rowIndex) => (
              <TableRow key={rowIndex}>
                <TableCell>
                  <TableCellLayout>{String(row[items.dimension.key])}</TableCellLayout>
                </TableCell>
                {items.columns.map((column) => (
                  <TableCell key={column.key}>
                    {formatCell(row[column.key], column.format)}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </section>
  );
};
