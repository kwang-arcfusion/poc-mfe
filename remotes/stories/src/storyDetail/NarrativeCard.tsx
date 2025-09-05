import * as React from 'react';
import { Card, Text, Body1, makeStyles, shorthands, tokens } from '@fluentui/react-components';
import { Document24Color } from '@fluentui/react-icons';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { Story } from '@arcfusion/types';

const useStyles = makeStyles({
  card: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    lineHeight: 1.6,
  },
  title: {
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForeground3,
    fontSize: '18px',
  },
  narrativeTitle: {
    display: 'flex',
    gap: '6px',
    alignItems: 'center',
  },
  narrativeText: {
    '& p': { margin: 0 },
    '& strong': { color: tokens.colorNeutralForeground1 },
    '& ul, & ol': { 
        ...shorthands.margin(0), 
        paddingLeft: tokens.spacingHorizontalL 
    },
  },
  tldr: {
    ...shorthands.borderLeft('4px', 'solid', tokens.colorBrandBackground),
    backgroundColor: tokens.colorNeutralBackground3,
    ...shorthands.padding('10px', '14px'),
    ...shorthands.borderRadius(tokens.borderRadiusXLarge),
    lineHeight: 1.6,
  },
});

interface NarrativeCardProps {
    story: Story;
}

export const NarrativeCard: React.FC<NarrativeCardProps> = ({ story }) => {
  const s = useStyles();
  return (
    <div className={s.card}>
      <div className={s.narrativeTitle}>
        <Document24Color />
        <Text className={s.title}>Narrative</Text>
      </div>
      
      {story.narrative_markdown && (
        <div className={s.tldr}>
            <div className={s.narrativeText}>
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {story.narrative_markdown}
                </ReactMarkdown>
            </div>
        </div>
      )}
    </div>
  );
};