// remotes/stories/src/components/StoryGroup.tsx
import React from 'react';
import { makeStyles, shorthands, tokens, Badge } from '@fluentui/react-components';
import { Story } from '../types';
import { InsightCard } from './InsightCard';

const useStyles = makeStyles({
  groupContainer: {
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap('16px'),
  },
  groupHeader: {
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap('12px'),
  },
  groupTitle: {
    fontSize: tokens.fontSizeHero800,
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForeground1,
  },
  storyBadge: {
    marginTop: '8px',
  },
  cardGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))',
    ...shorthands.gap('24px'),
  },
});

interface StoryGroupProps {
  title: string;
  stories: Story[];
  navigate: (path: string) => void;
}
export const StoryGroup: React.FC<StoryGroupProps> = ({ title, stories, navigate }) => {
  const styles = useStyles();
  return (
    <section className={styles.groupContainer}>
      <div className={styles.groupHeader}>
        <h2 className={styles.groupTitle}>{title}</h2>
        <Badge className={styles.storyBadge} appearance="tint" size="extra-large">
          {stories.length} Stories
        </Badge>
      </div>

      <div className={styles.cardGrid}>
        {stories.map((story) => (
          <InsightCard
            key={story.id}
            story={story}
            onClick={() => navigate(`/stories/${story.id}`)}
          />
        ))}
      </div>
    </section>
  );
};
