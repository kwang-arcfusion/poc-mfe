// packages/ui/src/components/MultiSelect/index.tsx
import React, { useMemo, useState } from 'react';
import {
  Badge,
  Button,
  Input,
  Menu,
  MenuItem, // ✨ FIX: เปลี่ยนมาใช้ MenuItem ธรรมดา
  MenuItemCheckbox,
  MenuList,
  MenuPopover,
  MenuTrigger,
  makeStyles,
  shorthands,
  tokens,
  MenuDivider,
  type MenuCheckedValueChangeEvent,
  type MenuCheckedValueChangeData,
} from '@fluentui/react-components';
import {
  ChevronDown20Regular,
  Search20Regular,
  Dismiss20Regular,
  CheckboxChecked16Regular, // ✨ FIX: Import ไอคอนสำหรับ Checkbox
  CheckboxUnchecked16Regular, // ✨ FIX: Import ไอคอนสำหรับ Checkbox
} from '@fluentui/react-icons';

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
  groupTitle: {
    paddingLeft: '12px',
    paddingTop: '8px',
    paddingBottom: '4px',
    color: tokens.colorNeutralForeground3,
    fontWeight: tokens.fontWeightSemibold,
    fontSize: tokens.fontSizeBase200,
  },
});

interface OptionItem {
  id: string;
  name: string;
}

export interface OptionGroup {
  name: string;
  children: OptionItem[];
}

export interface MultiSelectProps {
  label: string;
  options: OptionGroup[];
  selectedOptions: string[];
  onSelectionChange: (newSelection: string[]) => void;
}

export const MultiSelect: React.FC<MultiSelectProps> = ({
  label,
  options,
  selectedOptions,
  onSelectionChange,
}) => {
  const styles = useStyles();
  const [searchTerm, setSearchTerm] = useState('');

  const allChildren = useMemo(() => options.flatMap((group) => group.children), [options]);

  const filteredGroups = useMemo(() => {
    if (!searchTerm) {
      return options;
    }
    return options
      .map((group) => {
        const filteredChildren = group.children.filter((child) =>
          child.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        return { ...group, children: filteredChildren };
      })
      .filter((group) => group.children.length > 0);
  }, [options, searchTerm]);

  const allVisibleOptionIds = useMemo(
    () => filteredGroups.flatMap((group) => group.children.map((child) => child.id)),
    [filteredGroups]
  );

  const isAllSelected = useMemo(() => {
    if (allVisibleOptionIds.length === 0) return false;
    return allVisibleOptionIds.every((id) => selectedOptions.includes(id));
  }, [allVisibleOptionIds, selectedOptions]);

  // ✨ FIX: สร้าง handler แยกสำหรับ "Select All" โดยเฉพาะ
  const handleSelectAllToggle = () => {
    if (isAllSelected) {
      const newSelection = selectedOptions.filter((id) => !allVisibleOptionIds.includes(id));
      onSelectionChange(newSelection);
    } else {
      onSelectionChange([...new Set([...selectedOptions, ...allVisibleOptionIds])]);
    }
  };

  const handleCheckedValueChange = (
    _ev: MenuCheckedValueChangeEvent,
    data: MenuCheckedValueChangeData
  ) => {
    onSelectionChange(data.checkedItems);
  };

  const triggerContent = useMemo(() => {
    const count = selectedOptions.length;
    let selectionText = 'Select';
    if (count === 1) {
      const selectedChild = allChildren.find((c) => c.id === selectedOptions[0]);
      selectionText = selectedChild ? selectedChild.name : '1 selected';
    } else if (count > 1) {
      const firstSelectedChild = allChildren.find((c) => c.id === selectedOptions[0]);
      selectionText = firstSelectedChild
        ? `${firstSelectedChild.name}, +${count - 1}`
        : `${count} selected`;
    }

    return (
      <span className={styles.triggerButtonContents}>
        <Badge appearance="tint" size="large">
          {label}
        </Badge>
        <span>{selectionText}</span>
      </span>
    );
  }, [selectedOptions, label, styles, allChildren]);

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
          checkedValues={{ [label]: selectedOptions }}
          onCheckedValueChange={handleCheckedValueChange}
        >
          {allVisibleOptionIds.length > 0 && (
            <>
              {/* ✨ FIX: ใช้ MenuItem ธรรมดาพร้อม onClick และแสดงไอคอน Checkbox เอง */}
              <MenuItem
                icon={isAllSelected ? <CheckboxChecked16Regular /> : <CheckboxUnchecked16Regular />}
                onClick={handleSelectAllToggle}
              >
                Select All
              </MenuItem>
              <MenuDivider />
            </>
          )}

          {filteredGroups.map((group, index) => (
            <React.Fragment key={`${group.name}-${index}`}>
              {group.name && <div className={styles.groupTitle}>{group.name}</div>}
              {group.children.map((child) => (
                <MenuItemCheckbox key={child.id} name={label} value={child.id}>
                  {child.name}
                </MenuItemCheckbox>
              ))}
            </React.Fragment>
          ))}
        </MenuList>
      </MenuPopover>
    </Menu>
  );
};
