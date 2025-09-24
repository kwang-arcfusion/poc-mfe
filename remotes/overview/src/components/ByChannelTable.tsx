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
  tokens,
} from '@fluentui/react-components';
import { TableData } from '../types';

// ✨ 1. เพิ่ม Type สำหรับ State การ Sort
type SortDirection = 'ascending' | 'descending';
interface SortState {
  sortColumn: string;
  sortDirection: SortDirection;
}

const useStyles = makeStyles({
  tableCard: {
    padding: '26px',
    boxSizing: 'border-box',
    marginTop: '12px',
    overflowX: 'auto',
  },
  tableLayout: {
    tableLayout: 'auto',
    padding: '12px',
    backgroundColor: tokens.colorNeutralBackground2,
  },
  byChannelText: {
    color: tokens.colorNeutralForeground3,
  },
  // ✨ 2. เพิ่ม Style สำหรับ Header ที่คลิกได้
  sortableHeader: {
    cursor: 'pointer',
    ':hover': {
      backgroundColor: tokens.colorNeutralBackground1Hover,
    },
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

// ✨ 3. เพิ่ม Props ที่จะรับเข้ามา
export const ByChannelTable: React.FC<{
  items: TableData;
  sortState: SortState | null;
  onSort: (columnKey: string) => void;
}> = ({ items, sortState, onSort }) => {
  const styles = useStyles();

  return (
    <Card className={styles.tableCard}>
      <Text weight="bold" size={400} className={styles.byChannelText}>
        By Channels
      </Text>
      <Table aria-label={items.title} className={styles.tableLayout}>
        <TableHeader>
          <TableRow>
            {/* ✨ 4. ปรับแก้ Header Cell แรก (Dimension) */}
            <TableHeaderCell
              key={items.dimension.key}
              sortDirection={
                sortState?.sortColumn === items.dimension.key ? sortState.sortDirection : undefined
              }
              onClick={() => onSort(items.dimension.key)}
              className={styles.sortableHeader}
            >
              <Text weight="semibold"> {items.dimension.label}</Text>
            </TableHeaderCell>

            {/* ✨ 5. ปรับแก้ Header Cell อื่นๆ (Columns) */}
            {items.columns.map((column) => (
              <TableHeaderCell
                key={column.key}
                sortDirection={
                  sortState?.sortColumn === column.key ? sortState.sortDirection : undefined
                }
                onClick={() => onSort(column.key)}
                className={styles.sortableHeader}
              >
                <Text weight="semibold">{column.label}</Text>
              </TableHeaderCell>
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
                <TableCell key={column.key}>{formatCell(row[column.key], column.format)}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
};
