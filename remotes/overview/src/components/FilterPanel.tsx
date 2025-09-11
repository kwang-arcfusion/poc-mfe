// remotes/overview/src/components/FilterPanel.tsx
import React from 'react';
import {
  makeStyles,
  shorthands,
  tokens,
  Tab,
  TabList,
  Text,
  Button,
} from '@fluentui/react-components';
import { Dismiss24Regular } from '@fluentui/react-icons';

const useStyles = makeStyles({
  panelRoot: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    backgroundColor: tokens.colorNeutralBackground1,
    overflow: 'hidden', // ซ่อน scrollbar ของ root
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    ...shorthands.padding(tokens.spacingVerticalXS, tokens.spacingHorizontalM),
    ...shorthands.borderBottom('1px', 'solid', tokens.colorNeutralStroke2),
    flexShrink: 0,
  },
  title: {
    fontWeight: tokens.fontWeightSemibold,
  },
  content: {
    overflowY: 'auto', // ทำให้เนื้อหาสกอร์ได้
    flexGrow: 1,
    ...shorthands.padding(tokens.spacingVerticalM, tokens.spacingHorizontalL),
  },
});

interface FilterPanelProps {
  onClose: () => void;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({ onClose }) => {
  const styles = useStyles();
  const [selectedTab, setSelectedTab] = React.useState('offers');

  return (
    <div className={styles.panelRoot}>
      <TabList
        selectedValue={selectedTab}
        onTabSelect={(_, data) => setSelectedTab(data.value as string)}
      >
        <Tab value="offers">Offers</Tab>
        <Tab value="campaigns">Campaigns</Tab>
      </TabList>
      <div className={styles.content}>
        {selectedTab === 'offers' && (
          <div>
            <Text as="h3">Offers Content</Text>
          </div>
        )}
        {selectedTab === 'campaigns' && (
          <div>
            <Text as="h3">Campaigns Content</Text>
          </div>
        )}
      </div>
    </div>
  );
};
