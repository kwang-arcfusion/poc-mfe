// AskAIPage.tsx

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
  Divider,
  MenuButtonProps,
} from '@fluentui/react-components';
import { ChevronDown24Filled } from '@fluentui/react-icons';
import { useTopbarStore } from '../stores/topbarStore';

const AskAi = React.lazy(() => import('ask_ai/AskAi'));

// --- Styles สำหรับ Topbar Actions ---
const useTopbarStyles = makeStyles({
  container: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalS,
    overflow: 'hidden',
    minWidth: 0, // สำคัญมากสำหรับ Flexbox item เพื่อให้สามารถย่อขนาดได้
    width: '100%',
  },
  divider: {
    height: '20px',
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

// --- สร้าง Component ของ Actions สำหรับหน้านี้โดยเฉพาะ (เวอร์ชันแก้ไข) ---
const AskAiTopbarActions = () => {
  const styles = useTopbarStyles();
  const containerRef = useRef<HTMLDivElement>(null);

  // Refs สำหรับวัดขนาด element ที่สำคัญ
  const splitButtonRef = useRef<HTMLDivElement>(null);
  const overflowButtonRef = useRef<HTMLButtonElement>(null);
  const measurerRef = useRef<HTMLDivElement>(null); // Ref สำหรับ container ที่ซ่อนไว้

  // State เพื่อเก็บจำนวน item ที่จะแสดงผล
  const [visibleItemCount, setVisibleItemCount] = useState(bookmarks.length);
  // State เพื่อเก็บขนาดของปุ่ม bookmark ที่วัดได้จริง
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

  // Step 2: ฟังก์ชันคำนวณที่จะถูกเรียกใช้ทุกครั้งที่มีการ Resize
  const calculateVisibleItems = useCallback(() => {
    if (!containerRef.current || itemWidths.length === 0) {
      // ยังไม่พร้อมคำนวณถ้า container หรือขนาดปุ่มยังไม่มี
      return;
    }

    const containerWidth = containerRef.current.clientWidth;

    // วัดขนาดของ Element ที่อยู่นิ่ง (SplitButton, Divider, OverflowButton)
    // ใช้ offsetWidth จาก ref เพื่อความแม่นยำ
    const splitButtonWidth = splitButtonRef.current?.offsetWidth || 0;
    const dividerWidth = 8; // ความกว้างของ Divider + gap
    const overflowButtonWidth =
      overflowItems.length > 0 ? (overflowButtonRef.current?.offsetWidth || 0) + 8 : 0;

    const initialOffset = splitButtonWidth + dividerWidth;
    let currentWidth = initialOffset;
    let newVisibleCount = 0;

    for (const itemWidth of itemWidths) {
      // + dividerWidth เพราะทุกปุ่มจะมี Divider ตามหลัง
      const totalItemWidth = itemWidth + dividerWidth;

      // ตรวจสอบว่าถ้าเพิ่มปุ่มนี้เข้าไป จะเกินพื้นที่ที่ใช้ได้หรือไม่
      // พื้นที่ที่ใช้ได้คือความกว้างทั้งหมด ลบด้วยปุ่ม Overflow
      if (currentWidth + totalItemWidth > containerWidth - overflowButtonWidth) {
        break; // ถ้าเกิน ให้หยุดนับ
      }

      currentWidth += totalItemWidth;
      newVisibleCount++;
    }

    // อัปเดต state เฉพาะเมื่อค่ามีการเปลี่ยนแปลงเพื่อลด re-render ที่ไม่จำเป็น
    if (newVisibleCount !== visibleItemCount) {
      setVisibleItemCount(newVisibleCount);
    }
  }, [itemWidths, visibleItemCount]); // Dependencies: ขนาดของปุ่ม และจำนวนที่แสดงผลอยู่

  // Step 3: ติดตั้ง ResizeObserver เพื่อเรียกใช้การคำนวณ
  useLayoutEffect(() => {
    // คำนวณครั้งแรกเมื่อพร้อม
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
        <div ref={splitButtonRef}>
          <Menu positioning="below-end">
            <MenuTrigger disableButtonEnhancement>
              {(triggerProps: MenuButtonProps) => (
                <SplitButton menuButton={triggerProps}>Normal Model</SplitButton>
              )}
            </MenuTrigger>
            <MenuPopover>
              <MenuList>
                <MenuItem>Reasoning Model</MenuItem>
              </MenuList>
            </MenuPopover>
          </Menu>
        </div>

        <Divider vertical className={styles.divider} />

        {/* 2. Render Visible Bookmark Buttons */}
        {visibleItems.map((bookmark, index) => (
          <React.Fragment key={index}>
            <Button appearance="transparent" style={{ flexShrink: 0 }}>
              {bookmark}
            </Button>
            <Divider vertical className={styles.divider} />
          </React.Fragment>
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
                  <MenuItem key={index}>{item}</MenuItem>
                ))}
              </MenuList>
            </MenuPopover>
          </Menu>
        )}
      </div>

      {/* Container ที่ซ่อนไว้สำหรับวัดขนาดเท่านั้น */}
      <div ref={measurerRef} className={styles.hiddenMeasurer} aria-hidden="true">
        {bookmarks.map((bookmark, index) => (
          <Button key={index} appearance="transparent">
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
    <Suspense fallback={<div>Loading AskAI Component...</div>}>
      <AskAi />
    </Suspense>
  );
}
