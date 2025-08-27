// hosts/knowesis/src/pages/AskAiPage.tsx

import React, { Suspense, useEffect, useState, useRef, useLayoutEffect, useCallback } from 'react';
import {
  Button,
  SplitButton,
  Menu,
  MenuItem,
  MenuList,
  MenuPopover,
  MenuTrigger,
  makeStyles,
  tokens,
  MenuButtonProps,
  Spinner,
} from '@fluentui/react-components';
import { Bookmark16Regular, ChevronDown24Filled } from '@fluentui/react-icons';
import { useTopbarStore } from '../stores/topbarStore';

const AskAi = React.lazy(() => import('ask_ai/AskAi'));

// --- Styles for Topbar Actions ---
const useTopbarStyles = makeStyles({
  buttonModel: {
    whiteSpace: 'nowrap',
  },
  container: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalS,
    overflow: 'hidden',
    minWidth: 0, // Important for Flexbox items to allow shrinking
    width: '100%',
  },
  // Used to hide the element used for measuring only
  hiddenMeasurer: {
    visibility: 'hidden',
    position: 'absolute',
    top: '-9999px',
    left: '-9999px',
    display: 'flex',
    gap: tokens.spacingHorizontalS, // Must match the gap of the real container
  },
  bookmarkText: {
    fontWeight: 'normal',
    whiteSpace: 'nowrap',
  },
});

// --- Data for Bookmarks ---
const bookmarks = [
  'Customer Segmentation Q3',
  'Weekly Performance Report',
  'Ad Creative Analysis',
  'Campaign Deep Dive',
  'Marketing Funnel Trends',
  'Audience Insights',
];

// --- Create the Actions component specifically for this page (final revised version) ---
const AskAiTopbarActions = () => {
  const styles = useTopbarStyles();
  const containerRef = useRef<HTMLDivElement>(null);
  const splitButtonRef = useRef<HTMLDivElement>(null);
  const overflowButtonRef = useRef<HTMLButtonElement>(null); // This ref is still needed for UI but not used in main calculation logic
  const measurerRef = useRef<HTMLDivElement>(null);

  const [visibleItemCount, setVisibleItemCount] = useState(bookmarks.length);
  const [itemWidths, setItemWidths] = useState<number[]>([]);

  // Step 1: Measure the widths of all buttons once after the first render
  useLayoutEffect(() => {
    if (measurerRef.current) {
      const measuredWidths = Array.from(measurerRef.current.children).map(
        (child) => (child as HTMLElement).offsetWidth
      );
      setItemWidths(measuredWidths);
    }
  }, []); // Run only once

  // Step 2: Calculation function called on every resize
  const calculateVisibleItems = useCallback(() => {
    if (!containerRef.current || itemWidths.length === 0) {
      return;
    }

    const containerWidth = containerRef.current.clientWidth;
    const splitButtonWidth = splitButtonRef.current?.offsetWidth || 0;
    const gapWidth = 8; // equals tokens.spacingHorizontalS

    // **[FIX 1]** Use a constant width for the Overflow button to avoid race conditions
    // 40px comes from (icon button width ~32px + 8px gap)
    const OVERFLOW_BUTTON_WIDTH = 40;

    const initialOffset = splitButtonWidth;
    let currentWidth = initialOffset;
    let newVisibleCount = 0;

    for (const itemWidth of itemWidths) {
      // Space required for the next button (including gap)
      const requiredWidthForItem = itemWidth + gapWidth;

      // **[FIX 2]** Check whether "current space + next button" would eat into the space reserved for the Overflow button
      if (currentWidth + requiredWidthForItem > containerWidth - OVERFLOW_BUTTON_WIDTH) {
        break; // if so, stop counting
      }

      currentWidth += requiredWidthForItem;
      newVisibleCount++;
    }

    // **[FIX 3]** Handle the case where all items fit exactly, so no reserved space remains unused
    let totalRealWidth = initialOffset;
    itemWidths.forEach((w) => {
      totalRealWidth += w + gapWidth;
    });

    if (totalRealWidth <= containerWidth) {
      newVisibleCount = bookmarks.length;
    }

    // Update state only when the value changes
    if (newVisibleCount !== visibleItemCount) {
      setVisibleItemCount(newVisibleCount);
    }
  }, [itemWidths, visibleItemCount]);

  // Step 3: Install ResizeObserver to trigger calculations
  useLayoutEffect(() => {
    calculateVisibleItems();

    const observer = new ResizeObserver(calculateVisibleItems);
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [calculateVisibleItems]);

  const visibleItems = bookmarks.slice(0, visibleItemCount);
  const overflowItems = bookmarks.slice(visibleItemCount);

  return (
    <>
      {/* Visible and interactive container */}
      <div ref={containerRef} className={styles.container}>
        {/* 1. SplitButton */}
        <div ref={splitButtonRef} style={{ flexShrink: 0 }}>
          <Menu positioning="below-end">
            <MenuTrigger disableButtonEnhancement>
              {(triggerProps: MenuButtonProps) => (
                <SplitButton menuButton={triggerProps} className={styles.buttonModel}>
                  Normal Model
                </SplitButton>
              )}
            </MenuTrigger>
            <MenuPopover>
              <MenuList>
                <MenuItem>Reasoning Model</MenuItem>
              </MenuList>
            </MenuPopover>
          </Menu>
        </div>

        {/* 2. Render visible bookmark buttons */}
        {visibleItems.map((bookmark, index) => (
          <Button
            key={index}
            appearance="transparent"
            className={styles.bookmarkText}
            icon={<Bookmark16Regular />}
          >
            {bookmark}
          </Button>
        ))}

        {/* 3. Render overflow menu button */}
        {overflowItems.length > 0 && (
          <Menu>
            <MenuTrigger>
              <Button
                ref={overflowButtonRef}
                appearance="transparent"
                icon={<ChevronDown24Filled />}
                style={{ flexShrink: 0 }}
              />
            </MenuTrigger>
            <MenuPopover>
              <MenuList>
                {overflowItems.map((item, index) => (
                  <MenuItem key={index} icon={<Bookmark16Regular />}>
                    {item}
                  </MenuItem>
                ))}
              </MenuList>
            </MenuPopover>
          </Menu>
        )}
      </div>

      {/* **[FIX 4]** Hidden container for measuring (must be identical to the real buttons) */}
      <div ref={measurerRef} className={styles.hiddenMeasurer} aria-hidden="true">
        {bookmarks.map((bookmark, index) => (
          <Button
            key={index}
            appearance="transparent"
            className={styles.bookmarkText}
            icon={<Bookmark16Regular />}
          >
            {bookmark}
          </Button>
        ))}
      </div>
    </>
  );
};

// --- The rest of AskAiPage.tsx requires no changes ---
export function AskAiPage() {
  const { setActions } = useTopbarStore();

  useEffect(() => {
    setActions({ left: <AskAiTopbarActions />, right: null });
    return () => setActions({});
  }, [setActions]);

  return (
    <Suspense fallback={<Spinner size="huge" />}>
      <AskAi />
    </Suspense>
  );
}
