// remotes/overview/src/components/FilterGroup.tsx
import React from 'react';
import {
  makeStyles,
  shorthands,
  tokens,
  Accordion,
  AccordionHeader,
  AccordionItem,
  AccordionPanel,
  Button,
  Checkbox,
  Label,
} from '@fluentui/react-components';
import { Search24Regular } from '@fluentui/react-icons';

const useStyles = makeStyles({
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  checkboxGroup: {
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap('8px'),
    paddingTop: tokens.spacingVerticalS,
  },
});

interface FilterGroupProps {
  title: string;
  options: string[];
  selectedOptions: string[];
  onSelectionChange: (selected: string[]) => void;
}

export const FilterGroup: React.FC<FilterGroupProps> = ({
  title,
  options,
  selectedOptions,
  onSelectionChange,
}) => {
  const styles = useStyles();

  const handleCheckboxChange = (option: string, checked: boolean) => {
    const newSelection = checked
      ? [...selectedOptions, option]
      : selectedOptions.filter((o) => o !== option);
    onSelectionChange(newSelection);
  };

  return (
    <div>
      <Accordion collapsible>
        <AccordionItem value={title}>
          <AccordionHeader>
            <div className={styles.header}>
              <Label size="large" weight="semibold">
                {title}
              </Label>
              <Button appearance="transparent" icon={<Search24Regular />} />
            </div>
          </AccordionHeader>
          <AccordionPanel>
            <div className={styles.checkboxGroup}>
              {options.map((option) => (
                <Checkbox
                  key={option}
                  label={option}
                  checked={selectedOptions.includes(option)}
                  onChange={(_, data) => handleCheckboxChange(option, data.checked as boolean)}
                />
              ))}
            </div>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </div>
  );
};
