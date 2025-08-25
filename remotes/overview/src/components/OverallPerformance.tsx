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

// -- 1. กำหนดค่าคงที่เพื่อการคำนวณที่แม่นยำ --
const CARD_MIN_WIDTH = 200; // ความกว้างขั้นต่ำของการ์ดแต่ละใบ (px)
const GAP_WIDTH = 16; // ระยะห่างระหว่างการ์ด (px)

const useStyles = makeStyles({
  grid: {
    display: 'grid',
    ...shorthands.gap(`${GAP_WIDTH}px`),
    gridTemplateColumns: `repeat(auto-fill, minmax(${CARD_MIN_WIDTH}px, 1fr))`,
  },
  // ใช้ flexbox สำหรับ container ที่เราจะวัดขนาด
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
    minWidth: '150px', // กำหนดความกว้างขั้นต่ำให้ปุ่ม See All
    height: '120px',
    cursor: 'pointer',
    flexShrink: 0, // ไม่ให้ปุ่ม See All ย่อขนาดลง
    ':hover': {
      backgroundColor: tokens.colorNeutralBackground3Hover,
    },
  },
  dialogSurface: {
    maxWidth: '80vw',
    width: '1200px',
  },
});

export const OverallPerformance: React.FC<{ metrics: Metric[] }> = ({ metrics }) => {
  const styles = useStyles();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // -- 2. State และ Ref สำหรับการคำนวณ --
  const [visibleCount, setVisibleCount] = useState(0); // State เก็บจำนวนการ์ดที่จะแสดง
  const containerRef = useRef<HTMLDivElement>(null); // Ref ชี้ไปยัง container หลัก
  const seeAllRef = useRef<HTMLDivElement>(null); // Ref ชี้ไปยังปุ่ม See All เพื่อวัดขนาด

  // -- 3. Logic หลัก: ใช้ ResizeObserver เพื่อติดตามขนาด Container --
  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // สร้าง Observer
    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;

      const containerWidth = entry.contentRect.width;
      const seeAllWidth = seeAllRef.current?.offsetWidth || 0;

      // พื้นที่ที่เหลือสำหรับแสดง Metric Cards
      const availableWidth = containerWidth - (seeAllWidth + GAP_WIDTH);

      // คำนวณจำนวนการ์ดที่สามารถแสดงได้
      const newVisibleCount = Math.floor(availableWidth / (CARD_MIN_WIDTH + GAP_WIDTH));

      // ป้องกันการแสดงการ์ดเกินจำนวนที่มี
      const cappedVisibleCount = Math.max(0, Math.min(newVisibleCount, metrics.length));

      // อัปเดต state ต่อเมื่อค่ามีการเปลี่ยนแปลงจริงๆ เพื่อลด re-render
      setVisibleCount((currentCount) =>
        cappedVisibleCount !== currentCount ? cappedVisibleCount : currentCount
      );
    });

    // เริ่ม παρακολουθ container
    observer.observe(container);

    // Cleanup: หยุด παρακολουθเมื่อ component ถูก unmount
    return () => observer.disconnect();
  }, [metrics.length]); // dependency คือ metrics.length เพื่อให้คำนวณใหม่หากจำนวนการ์ดทั้งหมดเปลี่ยนไป

  // -- 4. เตรียมข้อมูลสำหรับ Render --
  const visibleMetrics = metrics.slice(0, visibleCount);
  const hiddenCount = metrics.length - visibleCount;

  return (
    <section>
      <div ref={containerRef} className={styles.dynamicContainer}>
        {/* Render การ์ดที่คำนวณแล้วว่าแสดงได้ */}
        {visibleMetrics.map((metric) => (
          <MetricCard key={metric.id} metric={metric} />
        ))}

        {/* Dialog และปุ่ม See All */}
        <Dialog open={isDialogOpen} onOpenChange={(_, data) => setIsDialogOpen(data.open)}>
          <DialogTrigger>
            {/* แก้ไขโดยใช้ Ternary Operator */}
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
            <DialogBody>
              <DialogTitle
                action={
                  <DialogTrigger action="close">
                    <Button appearance="subtle" aria-label="close" icon={<Dismiss24Regular />} />
                  </DialogTrigger>
                }
              >
                Overall Performance
              </DialogTitle>
              {/* ใน Dialog แสดงทุกการ์ด */}
              <div className={styles.grid} style={{ marginTop: '20px' }}>
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
