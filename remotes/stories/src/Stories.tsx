// remotes/stories/src/Stories.tsx
import React, { useState } from 'react';
import { makeStyles, shorthands, Button } from '@fluentui/react-components';

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
  footer: {
    display: 'flex',
    justifyContent: 'center',
    paddingTop: '16px',
    paddingBottom: '32px',
  },
});

// The main component for the Stories page
export default function Stories() {
  const styles = useStyles();
  const allGroupedStories = useGroupedStories(mockStories); // State to track how many groups are visible, starting with 1 (latest group)

  const [visibleGroupCount, setVisibleGroupCount] = useState(1); // Slice the full array to get only the groups that should be visible

  const visibleGroups = allGroupedStories.slice(0, visibleGroupCount); // Check if there are more groups left to load

  const hasMoreGroups = visibleGroupCount < allGroupedStories.length; // Function to handle loading the next group

  const handleSeeMore = () => {
    if (hasMoreGroups) {
      setVisibleGroupCount((prevCount) => prevCount + 1);
    }
  };

  return (
    <div className={styles.root}>
      {/* Render only the visible groups */}
      {visibleGroups.map((group) => (
        <StoryGroup key={group.title} title={group.title} stories={group.stories} />
      ))}
      {/* Conditionally render the "See more" button if there are more groups to show */}
      {hasMoreGroups && (
        <div className={styles.footer}>
          <Button appearance="secondary" size="large" onClick={handleSeeMore}>
            See more
          </Button>
        </div>
      )}{' '}
    </div>
  );
}
