// remotes/stories/src/Stories.tsx
import React from 'react';
import { makeStyles, shorthands, tokens } from '@fluentui/react-components';

import { mockStories } from './data/mockData';
import { useGroupedStories } from './hooks/useGroupedStories';
import { StoryGroup } from './components/StoryGroup';

// Styles for the main page container
const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap('32px'),
    ...shorthands.padding('24px', '48px'),
    boxSizing: 'border-box',
    height: '100%',
    overflowY: 'auto',
  },
});

// The main component for the Stories page
export default function Stories() {
  const styles = useStyles();
  const groupedStories = useGroupedStories(mockStories);

  return (
    <div className={styles.root}>
      {groupedStories.map((group, index) => (
        <StoryGroup
          key={group.title}
          title={group.title}
          stories={group.stories}
          // The first group is always the latest date (Today)
          isLatestGroup={index === 0}
        />
      ))}
    </div>
  );
}
