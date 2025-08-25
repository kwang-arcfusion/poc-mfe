import React from 'react';
import {
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerHeaderTitle,
  Button,
  Label,
  Checkbox,
  makeStyles,
  shorthands,
} from '@fluentui/react-components';
import { Dismiss24Regular } from '@fluentui/react-icons';
import { FilterValues } from '../types';

const useStyles = makeStyles({
  body: {
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap('20px'),
  },
  filterGroup: {
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap('8px'),
  },
});

interface FilterPanelProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  filters: FilterValues;
  onFiltersChange: (newFilters: FilterValues) => void;
}

const mockChannels = ['Facebook', 'Google', 'TikTok'];

export const FilterPanel: React.FC<FilterPanelProps> = ({
  isOpen,
  onOpenChange,
  filters,
  onFiltersChange,
}) => {
  const styles = useStyles();

  const handleChannelChange = (channel: string, checked: boolean) => {
    const currentChannels = filters.channels || [];
    const newChannels = checked
      ? [...currentChannels, channel]
      : currentChannels.filter((c) => c !== channel);
    onFiltersChange({ ...filters, channels: newChannels });
  };

  return (
    <Drawer
      type="overlay"
      separator
      open={isOpen}
      onOpenChange={(_, { open }) => onOpenChange(open)}
      position="start"
    >
      <DrawerHeader>
        <DrawerHeaderTitle
          action={
            <Button
              appearance="subtle"
              aria-label="Close"
              icon={<Dismiss24Regular />}
              onClick={() => onOpenChange(false)}
            />
          }
        >
          Filters
        </DrawerHeaderTitle>
      </DrawerHeader>
      <DrawerBody className={styles.body}>
        <div className={styles.filterGroup}>
          <Label weight="semibold">Channels</Label>
          {mockChannels.map((channel) => (
            <Checkbox
              key={channel}
              label={channel}
              checked={filters.channels?.includes(channel)}
              onChange={(_, data) => handleChannelChange(channel, data.checked as boolean)}
            />
          ))}
        </div>
        {/* สามารถเพิ่ม Filter Group อื่นๆ ที่นี่ได้ */}
      </DrawerBody>
    </Drawer>
  );
};
