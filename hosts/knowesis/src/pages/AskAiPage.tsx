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

// --- Styles สำหรับ Topbar Actions ---
const useTopbarStyles = makeStyles({
  buttonModel: {
    whiteSpace: 'nowrap',
  },
  container: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalS,
    overflow: 'hidden',
    minWidth: 0, // สำคัญมากสำหรับ Flexbox item เพื่อให้สามารถย่อขนาดได้
    width: '100%',
  },
  // ใช้สำหรับซ่อน element ที่ใช้ในการวัดขนาดเท่านั้น
  hiddenMeasurer: {
    visibility: 'hidden',
    position: 'absolute',
    top: '-9999px',
    left: '-9999px',
    display: 'flex',
    gap: tokens.spacingHorizontalS, // ต้องมี gap เหมือน container จริง
  },
  bookmarkText: {
    fontWeight: 'normal',
    whiteSpace: 'nowrap',
  },
});

// --- Data สำหรับ Bookmarks ---
const bookmarks = [
  'Customer Segmentation Q3',
  'Weekly Performance Report',
  'Ad Creative Analysis',
  'Campaign Deep Dive',
  'Marketing Funnel Trends',
  'Audience Insights',
];

// --- สร้าง Component ของ Actions สำหรับหน้านี้โดยเฉพาะ (เวอร์ชันแก้ไขสมบูรณ์) ---
const AskAiTopbarActions = () => {
  const styles = useTopbarStyles();
  const containerRef = useRef<HTMLDivElement>(null);
  const splitButtonRef = useRef<HTMLDivElement>(null);
  const overflowButtonRef = useRef<HTMLButtonElement>(null); // Ref นี้ยังจำเป็นสำหรับ UI แต่ไม่ใช้ใน logic คำนวณหลัก
  const measurerRef = useRef<HTMLDivElement>(null);

  const [visibleItemCount, setVisibleItemCount] = useState(bookmarks.length);
  const [itemWidths, setItemWidths] = useState<number[]>([]);

  // Step 1: วัดขนาดของปุ่มทั้งหมดเพียงครั้งเดียวหลังจาก Render ครั้งแรก
  useLayoutEffect(() => {
    if (measurerRef.current) {
      const measuredWidths = Array.from(measurerRef.current.children).map(
        (child) => (child as HTMLElement).offsetWidth
      );
      setItemWidths(measuredWidths);
    }
  }, []); // ทำงานแค่ครั้งเดียว

  // Step 2: ฟังก์ชันคำนวณที่ถูกเรียกใช้ทุกครั้งที่มีการ Resize
  const calculateVisibleItems = useCallback(() => {
    if (!containerRef.current || itemWidths.length === 0) {
      return;
    }

    const containerWidth = containerRef.current.clientWidth;
    const splitButtonWidth = splitButtonRef.current?.offsetWidth || 0;
    const gapWidth = 8; // คือค่า tokens.spacingHorizontalS

    // **[FIX 1]** ใช้ค่าคงที่สำหรับปุ่ม Overflow เพื่อป้องกัน Race Condition
    // ค่า 40px มาจาก (ความกว้างปุ่มไอคอนประมาณ 32px + gap 8px)
    const OVERFLOW_BUTTON_WIDTH = 40;

    const initialOffset = splitButtonWidth;
    let currentWidth = initialOffset;
    let newVisibleCount = 0;

    for (const itemWidth of itemWidths) {
      // พื้นที่ที่ต้องใช้สำหรับปุ่มถัดไป (รวม gap)
      const requiredWidthForItem = itemWidth + gapWidth;

      // **[FIX 2]** ตรวจสอบว่า "พื้นที่ปัจจุบัน + ปุ่มถัดไป" จะไปกินที่ "ที่จองไว้ให้ปุ่ม Overflow" หรือไม่
      if (currentWidth + requiredWidthForItem > containerWidth - OVERFLOW_BUTTON_WIDTH) {
        break; // ถ้าใช่ ให้หยุดนับ
      }

      currentWidth += requiredWidthForItem;
      newVisibleCount++;
    }

    // **[FIX 3]** จัดการกรณีที่ทุกรายการแสดงได้พอดี เพื่อไม่ให้เหลือที่จองไว้ว่างๆ
    let totalRealWidth = initialOffset;
    itemWidths.forEach((w) => {
      totalRealWidth += w + gapWidth;
    });

    if (totalRealWidth <= containerWidth) {
      newVisibleCount = bookmarks.length;
    }

    // อัปเดต state เฉพาะเมื่อค่ามีการเปลี่ยนแปลง
    if (newVisibleCount !== visibleItemCount) {
      setVisibleItemCount(newVisibleCount);
    }
  }, [itemWidths, visibleItemCount]);

  // Step 3: ติดตั้ง ResizeObserver เพื่อเรียกใช้การคำนวณ
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
      {/* Container ที่มองเห็นและใช้งานจริง */}
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

        {/* 2. Render Visible Bookmark Buttons */}
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

        {/* 3. Render Overflow Menu Button */}
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

      {/* **[FIX 4]** Container ที่ซ่อนไว้สำหรับวัดขนาด (ต้องเหมือนกับปุ่มจริงทุกประการ) */}
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

// --- ส่วนที่เหลือของไฟล์ AskAiPage.tsx ไม่ต้องแก้ไข ---
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
