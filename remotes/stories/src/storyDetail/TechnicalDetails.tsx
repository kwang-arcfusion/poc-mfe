// remotes/stories/src/storyDetail/TechnicalDetails.tsx
import * as React from 'react';
import { useState, useRef, useEffect } from 'react';
import {
  makeStyles,
  shorthands,
  tokens,
  Tab,
  TabList,
  Text,
  Button,
} from '@fluentui/react-components';
import { Copy24Regular, Checkmark24Regular, CalendarDataBar24Color } from '@fluentui/react-icons';
import type { Story } from '@arcfusion/types';

const useStyles = makeStyles({
  root: {
    padding: '20px',
    borderRadius: tokens.borderRadiusXLarge,
    backgroundColor: tokens.colorNeutralBackground3,
    boxShadow: tokens.shadow4,
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
  codeContainer: {
    position: 'relative',
  },
  copyButton: {
    position: 'absolute',
    right: '12px',
    top: '12px',
  },
  codeBox: {
    ...shorthands.border('1px', 'solid', tokens.colorNeutralStroke2),
    ...shorthands.borderRadius(tokens.borderRadiusMedium),
    ...shorthands.padding(tokens.spacingVerticalM, tokens.spacingHorizontalM),
    backgroundColor: tokens.colorNeutralBackground1,
    fontFamily: 'monospace',
    fontSize: '14px',
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

  const [copyState, setCopyState] = useState<'idle' | 'copied'>('idle');
  const timeoutRef = useRef<number | null>(null);

  const handleCopy = async (textToCopy: string) => {
    if (copyState === 'copied') return;
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopyState('copied');
      timeoutRef.current = window.setTimeout(() => {
        setCopyState('idle');
      }, 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const metadataString = React.useMemo(
    () =>
      JSON.stringify(
        {
          trigger_point: story.trigger_point,
          metadata_info: story.metadata_info,
        },
        null,
        2
      ),
    [story.trigger_point, story.metadata_info]
  );

  return (
    <section className={s.root}>
      <div className={s.titleWrap}>
        <CalendarDataBar24Color /> <Text className={s.title}>Technical Details</Text>
      </div>
      <TabList
        selectedValue={selectedValue}
        onTabSelect={(_, data) => setSelectedValue(data.value as string)}
      >
        <Tab value="notes">Notes</Tab> <Tab value="sql">SQL Query</Tab>
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
        {selectedValue === 'sql' && (
          <div className={s.codeContainer}>
            <Button
              appearance="subtle"
              className={s.copyButton}
              size="small"
              icon={copyState === 'idle' ? <Copy24Regular /> : <Checkmark24Regular />}
              onClick={() => handleCopy(story.sql_query)}
            >
              {copyState === 'idle' ? 'Copy SQL' : 'Copied!'}
            </Button>
            <pre className={s.codeBox}>{story.sql_query}</pre>
          </div>
        )}
        {selectedValue === 'metadata' && (
          <div className={s.codeContainer}>
            <Button
              className={s.copyButton}
              appearance="subtle"
              size="small"
              icon={copyState === 'idle' ? <Copy24Regular /> : <Checkmark24Regular />}
              onClick={() => handleCopy(metadataString)}
            >
              {copyState === 'idle' ? 'Copy JSON' : 'Copied!'}
            </Button>
            <pre className={s.codeBox}>{metadataString}</pre>
          </div>
        )}
      </div>
    </section>
  );
};
