// remotes/overview/src/components/FilterGroupSelect.tsx
import React, { useMemo, useState } from 'react';
import {
  Badge,
  Button,
  Input,
  Menu,
  MenuItemCheckbox,
  MenuList,
  MenuPopover,
  MenuTrigger,
  makeStyles,
  shorthands,
  tokens,
  type MenuCheckedValueChangeEvent,
  type MenuCheckedValueChangeData,
} from '@fluentui/react-components';
import { ChevronDown20Regular, Search20Regular, Dismiss20Regular } from '@fluentui/react-icons';

const useStyles = makeStyles({
  popoverSurface: {
    width: '280px',
  },
  searchContainer: {
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap('8px'),
    ...shorthands.padding('8px'),
  },
  menuList: {
    maxHeight: '250px',
    overflowY: 'auto',
  },
  triggerButton: {
    width: 'fit-content',
    justifyContent: 'space-between',
  },
  triggerButtonContents: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalS,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
});

interface FilterGroupSelectProps {
  label: string;
  options: string[];
  selectedOptions: string[];
  onSelectionChange: (newSelection: string[]) => void;
}

export const FilterGroupSelect: React.FC<FilterGroupSelectProps> = ({
  label,
  options,
  selectedOptions,
  onSelectionChange,
}) => {
  const styles = useStyles();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredOptions = useMemo(
    () => options.filter((opt) => opt.toLowerCase().includes(searchTerm.toLowerCase())),
    [options, searchTerm]
  );

  const handleCheckedValueChange = (
    _ev: MenuCheckedValueChangeEvent,
    data: MenuCheckedValueChangeData
  ) => {
    onSelectionChange(data.checkedItems);
  };

  // --- [✨] ปรับ Logic ตรงนี้ให้ Clean ขึ้น ---
  const triggerContent = useMemo(() => {
    const count = selectedOptions.length;

    // 1. เตรียมข้อความที่จะแสดงตามเงื่อนไขก่อน
    const selectionText =
      count === 0
        ? 'All' // ถ้ายังไม่เลือก ให้ใช้คำว่า 'All'
        : count === 1
          ? selectedOptions[0]
          : `${selectedOptions[0]}, +${count - 1}`;

    // 2. Return โครงสร้าง JSX แบบเดียวเสมอ
    return (
      <span className={styles.triggerButtonContents}>
        <Badge appearance="tint" size="large">
          {label}
        </Badge>
        <span>{selectionText}</span>
      </span>
    );
  }, [selectedOptions, label, styles]);

  return (
    <Menu>
      <MenuTrigger disableButtonEnhancement>
        <Button
          className={styles.triggerButton}
          appearance="outline"
          iconPosition="after"
          icon={<ChevronDown20Regular />}
        >
          {triggerContent}
        </Button>
      </MenuTrigger>

      <MenuPopover className={styles.popoverSurface}>
        <div className={styles.searchContainer}>
          <Input
            placeholder={`Search ${label}...`}
            value={searchTerm}
            onChange={(_, data) => setSearchTerm(data.value)}
            contentBefore={<Search20Regular />}
            contentAfter={
              searchTerm && (
                <Button
                  appearance="transparent"
                  icon={<Dismiss20Regular />}
                  onClick={() => setSearchTerm('')}
                />
              )
            }
          />
        </div>

        <MenuList
          className={styles.menuList}
          checkedValues={{ [label]: selectedOptions }}
          onCheckedValueChange={handleCheckedValueChange}
        >
          {filteredOptions.map((option) => (
            <MenuItemCheckbox key={option} name={label} value={option}>
              {option}
            </MenuItemCheckbox>
          ))}
        </MenuList>
      </MenuPopover>
    </Menu>
  );
};
