// remotes/overview/src/components/OverallPerformance.tsx
import React, { useState, useRef, useLayoutEffect } from 'react';
import {
  Button,
  Dialog,
  DialogBody,
  DialogSurface,
  DialogTitle,
  DialogTrigger,
  makeStyles,
  shorthands,
  tokens,
  Text,
} from '@fluentui/react-components';
import { Dismiss24Regular } from '@fluentui/react-icons';
import { Metric } from '../types';
import { MetricCard } from './MetricCard';

const CARD_MIN_WIDTH = 200;
const GAP_WIDTH = 16;

// --- ⬇️ [1] Update all styles related to Dialog ⬇️ ---
const useStyles = makeStyles({
  dynamicContainer: {
    display: 'flex',
    ...shorthands.gap(`${GAP_WIDTH}px`),
    width: '100%',
  },
  seeAllCard: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    ...shorthands.border('2px', 'dashed', tokens.colorNeutralStroke2),
    ...shorthands.borderRadius(tokens.borderRadiusMedium),
    backgroundColor: tokens.colorNeutralBackground3,
    minWidth: '150px',
    height: '120px',
    cursor: 'pointer',
    flexShrink: 0,
    ':hover': {
      backgroundColor: tokens.colorNeutralBackground3Hover,
    },
  },
  dialogSurface: {
    maxWidth: '80vw',
    width: '1200px',
    maxHeight: '85vh',
    // Make the Surface a flex container
    display: 'flex',
    padding: 0,
  },

  dialogBody: {
    // Make the Body expand to fill the Surface
    flexGrow: 1,
    // Make the Body a flex container (for Title and Grid)
    display: 'flex',
    flexDirection: 'column',
    // Keep scroll behavior the same
    overflowY: 'auto',
    // Move padding here for better appearance
    ...shorthands.padding(tokens.spacingVerticalL, tokens.spacingHorizontalL),
  },
  grid: {
    display: 'grid',
    ...shorthands.gap(`${GAP_WIDTH}px`),
    gridTemplateColumns: `repeat(auto-fill, minmax(${CARD_MIN_WIDTH}px, 1fr))`,
    // Make the Grid expand to fill the remaining space in the Body
    flexGrow: 1,
    marginTop: '24px',
  },
});
// --- ⬆️ End of style updates ⬆️ ---

export const OverallPerformance: React.FC<{ metrics: Metric[] }> = ({ metrics }) => {
  const styles = useStyles();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const seeAllRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;

      const containerWidth = entry.contentRect.width;
      const seeAllWidth = seeAllRef.current?.offsetWidth || 0;
      const availableWidth = containerWidth - (seeAllWidth + GAP_WIDTH);
      const newVisibleCount = Math.floor(availableWidth / (CARD_MIN_WIDTH + GAP_WIDTH));
      const cappedVisibleCount = Math.max(0, Math.min(newVisibleCount, metrics.length));

      setVisibleCount((currentCount) =>
        cappedVisibleCount !== currentCount ? cappedVisibleCount : currentCount
      );
    });

    observer.observe(container);
    return () => observer.disconnect();
  }, [metrics.length]);

  const visibleMetrics = metrics.slice(0, visibleCount);
  const hiddenCount = metrics.length - visibleCount;

  return (
    <section>
      <div ref={containerRef} className={styles.dynamicContainer}>
        {visibleMetrics.map((metric) => (
          <MetricCard key={metric.id} metric={metric} />
        ))}
        <Dialog open={isDialogOpen} onOpenChange={(_, data) => setIsDialogOpen(data.open)}>
          <DialogTrigger>
            {hiddenCount > 0 ? (
              <div ref={seeAllRef} className={styles.seeAllCard}>
                <Text size={800} weight="bold">
                  +{hiddenCount}
                </Text>
                <Text>See All</Text>
              </div>
            ) : null}
          </DialogTrigger>
          <DialogSurface className={styles.dialogSurface}>
            <DialogBody className={styles.dialogBody}>
              <DialogTitle>
                <Text size={700} weight="semibold">
                  Overall Performance
                </Text>
              </DialogTitle>
              <div className={styles.grid}>
                {metrics.map((metric) => (
                  <MetricCard key={metric.id} metric={metric} />
                ))}
              </div>
            </DialogBody>
          </DialogSurface>
        </Dialog>
      </div>
    </section>
  );
};
