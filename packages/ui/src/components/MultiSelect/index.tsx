// packages/ui/src/components/MultiSelect/index.tsx
import React, { useMemo, useState } from 'react';
import {
  Badge,
  Button,
  Input,
  Menu,
  MenuItem,
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
  CheckboxChecked16Regular,
  CheckboxUnchecked16Regular,
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
  nonClosingMenuItem: {
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap(tokens.spacingHorizontalS),
    ...shorthands.padding(tokens.spacingVerticalS, tokens.spacingHorizontalM),
    color: tokens.colorNeutralForeground1,
    backgroundColor: 'transparent',
    fontSize: tokens.fontSizeBase300,
    cursor: 'pointer',
    ':hover': {
      backgroundColor: tokens.colorNeutralBackground1Hover,
    },
    ':focus': {
      backgroundColor: tokens.colorNeutralBackground1Hover,
      outline: 'none',
    },
  },
  menuIcon: {
    width: '16px',
    height: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }
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

  const allChildren = useMemo(() => options.flatMap(group => group.children), [options]);

  const filteredGroups = useMemo(() => {
    if (!searchTerm) {
      return options;
    }
    return options
      .map(group => {
        const filteredChildren = group.children.filter(child =>
          child.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        return { ...group, children: filteredChildren };
      })
      .filter(group => group.children.length > 0);
  }, [options, searchTerm]);
  
  const allVisibleOptionIds = useMemo(
    () => filteredGroups.flatMap(group => group.children.map(child => child.id)),
    [filteredGroups]
  );

  const isAllSelected = useMemo(() => {
    if (allVisibleOptionIds.length === 0) return false;
    return allVisibleOptionIds.every(id => selectedOptions.includes(id));
  }, [allVisibleOptionIds, selectedOptions]);

  const uniqueMatchingNames = useMemo(() => {
    if (!searchTerm) {
        return [];
    }
    const allMatchingChildren = filteredGroups.flatMap(group => group.children);
    const uniqueNames = [...new Set(allMatchingChildren.map(child => child.name))];
    return uniqueNames;
  }, [searchTerm, filteredGroups]);
  
  const handleSelectAllToggle = () => {
    if (isAllSelected) {
      const newSelection = selectedOptions.filter(id => !allVisibleOptionIds.includes(id));
      onSelectionChange(newSelection);
    } else {
      onSelectionChange([...new Set([...selectedOptions, ...allVisibleOptionIds])]);
    }
  };

  const handleSelectAllByName = (name: string) => {
    const idsToToggle = allChildren
        .filter(child => child.name === name)
        .map(child => child.id);

    if (idsToToggle.length === 0) return;

    const areAllSelectedForThisName = idsToToggle.every(id => selectedOptions.includes(id));

    if (areAllSelectedForThisName) {
        const newSelection = selectedOptions.filter(id => !idsToToggle.includes(id));
        onSelectionChange(newSelection);
    } else {
        const newSelection = [...new Set([...selectedOptions, ...idsToToggle])];
        onSelectionChange(newSelection);
    }
  };

  const handleCheckedValueChange = (
    _ev: MenuCheckedValueChangeEvent,
    data: MenuCheckedValueChangeData
  ) => {
    onSelectionChange(data.checkedItems);
  };
  
  // ✨ FIX: ปรับปรุง Logic การแสดงผลบนปุ่มให้เหมือนกันทั้งหมด
  const triggerContent = useMemo(() => {
    const count = selectedOptions.length;
    let selectionText = 'Select';

    if (count > 0) {
      const firstSelectedId = selectedOptions[0];
      const firstSelectedChild = allChildren.find(c => c.id === firstSelectedId);
      
      // ถ้าหาชื่อเจอ ให้ใช้ชื่อนั้น ถ้าหาไม่เจอ (ซึ่งไม่ควรจะเกิดขึ้น) ให้ใช้ ID แทนไปเลย
      // แต่จะไม่มีการแสดง "X selected" อีกต่อไป
      const displayName = firstSelectedChild ? firstSelectedChild.name : firstSelectedId;

      selectionText = count === 1 ? displayName : `${displayName}, +${count - 1}`;
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
                <div
                    role="menuitem"
                    tabIndex={0}
                    className={styles.nonClosingMenuItem}
                    onClick={handleSelectAllToggle}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            handleSelectAllToggle();
                        }
                    }}
                >
                    <span className={styles.menuIcon}>
                        {isAllSelected ? <CheckboxChecked16Regular /> : <CheckboxUnchecked16Regular />}
                    </span>
                    Select All
                </div>
                <MenuDivider />
             </>
          )}

          {uniqueMatchingNames.length > 0 && (
            <>
                {uniqueMatchingNames.map(name => {
                    const idsForThisName = allChildren
                        .filter(child => child.name === name)
                        .map(child => child.id);
                    const isChecked = idsForThisName.length > 0 && idsForThisName.every(id => selectedOptions.includes(id));

                    return (
                        <div
                            key={name}
                            role="menuitem"
                            tabIndex={0}
                            className={styles.nonClosingMenuItem}
                            onClick={() => handleSelectAllByName(name)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    e.preventDefault();
                                    handleSelectAllByName(name);
                                }
                            }}
                        >
                            <span className={styles.menuIcon}>
                                {isChecked ? <CheckboxChecked16Regular /> : <CheckboxUnchecked16Regular />}
                            </span>
                            {name}
                        </div>
                    );
                })}
                <MenuDivider />
            </>
          )}

          {filteredGroups.map((group, index) => (
            <React.Fragment key={`${group.name}-${index}`}>
              {group.name && <div className={styles.groupTitle}>{group.name}</div>}
              {group.children.map(child => (
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