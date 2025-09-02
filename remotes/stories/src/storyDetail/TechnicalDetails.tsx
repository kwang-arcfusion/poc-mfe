// remotes/stories/src/storyDetail/TechnicalDetails.tsx
import * as React from 'react';
import { makeStyles, shorthands, tokens, Tab, TabList, Text } from '@fluentui/react-components';
import { Code24Filled, DataUsage24Filled } from '@fluentui/react-icons';
import type { Story } from '@arcfusion/types';

const useStyles = makeStyles({
  root: {
    paddingTop: '20px',
  },
  titleWrap: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    marginBottom: '12px',
  },
  title: {
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForeground3,
    fontSize: '18px',
  },
  tabPanel: {
    ...shorthands.padding(tokens.spacingVerticalM, 0),
  },
  codeBox: {
    ...shorthands.border('1px', 'solid', tokens.colorNeutralStroke2),
    ...shorthands.borderRadius(tokens.borderRadiusMedium),
    ...shorthands.padding(tokens.spacingVerticalM, tokens.spacingHorizontalM),
    backgroundColor: tokens.colorNeutralBackground1,
    fontFamily: 'monospace',
    fontSize: '13px',
    maxHeight: '400px',
    overflow: 'auto',
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-all',
  },
  notesList: {
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap(tokens.spacingVerticalS),
    paddingLeft: tokens.spacingHorizontalL,
    ...shorthands.margin(0),
  },
});

interface TechnicalDetailsProps {
  story: Story;
}

export const TechnicalDetails: React.FC<TechnicalDetailsProps> = ({ story }) => {
  const s = useStyles();
  const [selectedValue, setSelectedValue] = React.useState('notes');

  return (
    <section className={s.root}>
      <div className={s.titleWrap}>
        <DataUsage24Filled />
        <Text className={s.title}>Technical Details</Text>
      </div>

      <TabList
        selectedValue={selectedValue}
        onTabSelect={(_, data) => setSelectedValue(data.value as string)}
      >
        <Tab value="notes">Notes</Tab>
        <Tab value="sql">SQL Query</Tab>
        <Tab value="metadata">Metadata</Tab>
      </TabList>

      <div className={s.tabPanel}>
        {selectedValue === 'notes' && (
          <ul className={s.notesList}>
            {story.notes?.map((note, index) => (
              <li key={index}>{note}</li>
            ))}
          </ul>
        )}
        {selectedValue === 'sql' && <pre className={s.codeBox}>{story.sql_query}</pre>}
        {selectedValue === 'metadata' && (
          <pre className={s.codeBox}>
            {JSON.stringify(
              {
                trigger_point: story.trigger_point,
                metadata_info: story.metadata_info,
              },
              null,
              2
            )}
          </pre>
        )}
      </div>
    </section>
  );
};
