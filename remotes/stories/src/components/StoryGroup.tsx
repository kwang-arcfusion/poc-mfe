// remotes/stories/src/components/StoryGroup.tsx
import React, { useState, useLayoutEffect, useRef } from 'react';
import { makeStyles, shorthands, tokens, Badge, Button } from '@fluentui/react-components';
import { Story } from '../types';
import { InsightCard } from './InsightCard';

// --- Component Styles ---
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
    display: 'flex',
    flexWrap: 'wrap',
    ...shorthands.gap('24px'),
    // This class will be toggled to limit the height to one row
    '&.collapsed': {
      maxHeight: '480px', // Adjust this value based on your card height + gap
      overflow: 'hidden',
    },
  },
  seeAllButton: {
    alignSelf: 'center',
    marginTop: '16px',
  },
});

interface StoryGroupProps {
  title: string;
  stories: Story[];
  isLatestGroup: boolean;
}

// --- StoryGroup Component ---
// Renders a single date-based group of story cards.
// Handles the "See less" / "See all" logic.
export const StoryGroup: React.FC<StoryGroupProps> = ({ title, stories, isLatestGroup }) => {
  const styles = useStyles();
  // State to control if all cards are shown. For the latest group, it's always false (collapsed).
  const [isExpanded, setIsExpanded] = useState(false);

  const gridRef = useRef<HTMLDivElement>(null);
  const [isOverflowing, setIsOverflowing] = useState(false);

  // This effect checks if the content of the grid is taller than its container.
  // If it is, we know we need to show the "See all" button.
  useLayoutEffect(() => {
    const checkOverflow = () => {
      if (gridRef.current) {
        // If scrollHeight is greater than clientHeight, it means content is overflowing.
        setIsOverflowing(gridRef.current.scrollHeight > gridRef.current.clientHeight);
      }
    };

    // We check on initial render and whenever the window is resized.
    checkOverflow();
    window.addEventListener('resize', checkOverflow);
    return () => window.removeEventListener('resize', checkOverflow);
  }, [stories]); // Rerun if the stories change

  // Determine if the grid should be collapsed.
  // The latest group is always collapsed ("See less").
  // Other groups are collapsed unless the user has expanded them.
  const isCollapsed = isLatestGroup || !isExpanded;

  // We should show a toggle button if the group is not the latest AND
  // either the content is overflowing, or the user has already expanded it.
  const showToggleButton = !isLatestGroup && (isOverflowing || isExpanded);

  // The "See less" button for the latest group should only show if it's actually overflowing.
  const showLatestSeeLess = isLatestGroup && isOverflowing;

  return (
    <section className={styles.groupContainer}>
      <div className={styles.groupHeader}>
        <h2 className={styles.groupTitle}>{title}</h2>
        <Badge className={styles.storyBadge} appearance="tint" size="extra-large">
          {stories.length} Stories
        </Badge>
      </div>

      <div ref={gridRef} className={`${styles.cardGrid} ${isCollapsed ? 'collapsed' : ''}`}>
        {stories.map((story) => (
          <InsightCard key={story.id} story={story} />
        ))}
      </div>

      {showToggleButton && (
        <Button
          appearance="transparent"
          className={styles.seeAllButton}
          onClick={() => setIsExpanded((prev) => !prev)}
        >
          {isExpanded ? 'See less' : 'See all'}
        </Button>
      )}
      {showLatestSeeLess && (
        <Button
          appearance="transparent"
          disabled // It's just a label in this case
          className={styles.seeAllButton}
        >
          See less
        </Button>
      )}
    </section>
  );
};
