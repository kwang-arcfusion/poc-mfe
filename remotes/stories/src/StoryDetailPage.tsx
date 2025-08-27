// remotes/stories/src/StoryDetailPage.tsx

import * as React from 'react';
import {
  Badge,
  Button,
  Title1,
  Text,
  Card,
  makeStyles,
  shorthands,
  tokens,
} from '@fluentui/react-components';
import { Sparkle24Regular } from '@fluentui/react-icons';
import { useLayoutStore } from '@arcfusion/store';

import { WrapupKpis } from './storyDetail/WrapupKpis';
import { NarrativeCard } from './storyDetail/NarrativeCard';
import { ActionsCard } from './storyDetail/ActionsCard';
import { EvidenceSection } from './storyDetail/EvidenceSection';

// mock for evidence (สอดคล้องกับ narrative)
import {
  trendCurrent,
  trendPrior,
  funnelRows,
  breakdownDevice,
  breakdownRegion,
} from './storyDetail/mock';

/* =============================
   Styles (Fluent UI tokens only)
============================= */
const useStyles = makeStyles({
  /** ─────────────── NEW: split wrapper + panes ─────────────── **/
  outer: {
    // wrapper นอกสุดต้อง hidden เพื่อกัน body/parent scroll
    overflow: 'hidden',
    // ให้เต็ม viewport ยกเว้น topbar 60px
    height: 'calc(100vh - 60px)',
    backgroundColor: tokens.colorNeutralBackground2,
  },
  askAiButton: {
    position: 'fixed',
    top: '62px',
    right: '36px',
    zIndex: 10,
  },
  singleGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    height: '100%',
  },
  splitGrid: {
    display: 'grid',
    // ซ้ายใหญ่กว่า: 2 ส่วน : 1 ส่วน
    gridTemplateColumns: '2fr 1fr',
    columnGap: '12px',
    height: '100%',
    // padding ขอบรวมทั้งสองฝั่ง
    paddingLeft: '12px',
    paddingRight: '12px',
    paddingTop: '0px',
    paddingBottom: '0px',
    boxSizing: 'border-box',
  },
  leftPane: {
    height: '100%',
    overflow: 'auto', // สกอของฝั่งซ้าย
  },
  rightPane: {
    height: '100%',
    overflow: 'auto', // สกอของฝั่งขวา
    ...shorthands.border('1px', 'solid', tokens.colorNeutralStroke2),
    ...shorthands.borderRadius(tokens.borderRadiusLarge),
    backgroundColor: tokens.colorNeutralBackground1,
  },
  rightInner: {
    display: 'flex',
    flexDirection: 'column',
    rowGap: '12px',
    ...shorthands.padding('16px'),
  },
  rightHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  /** ─────────────── existing page styles (ซ้าย) ─────────────── **/
  page: {
    display: 'flex',
    flexDirection: 'column',
    rowGap: '20px',
    paddingLeft: '24px',
    paddingRight: '24px',
    paddingBottom: '48px',
    backgroundColor: tokens.colorNeutralBackground2,
    boxSizing: 'border-box',
  },

  // hero + title area
  hero: {
    position: 'relative',
    ...shorthands.padding('18px'),
    ...shorthands.borderRadius(tokens.borderRadiusLarge),
    backgroundImage: `linear-gradient(180deg, ${tokens.colorNeutralBackground1}, ${tokens.colorNeutralBackground2})`,
    ...shorthands.border('1px', 'solid', tokens.colorNeutralStroke2),
    display: 'flex',
    flexDirection: 'column',
    rowGap: '8px',
  },
  /** NEW: toolbar บนหัวเรื่องสำหรับปุ่ม Ask AI **/
  heroToolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },

  heroTitleRow: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    rowGap: '6px',
  },
  detailRow: {
    display: 'flex',
    gap: '12px',
    alignItems: 'center',
  },
  deltaPill: {
    display: 'inline-flex',
    alignItems: 'center',
    columnGap: '8px',
    ...shorthands.padding('8px', '12px'),
    ...shorthands.border('1px', 'solid', tokens.colorPaletteRedBorder2),
    ...shorthands.borderRadius('12px'),
    backgroundColor: tokens.colorPaletteRedBackground2,
    color: tokens.colorPaletteRedForeground2,
    fontWeight: tokens.fontWeightSemibold,
  },
  chips: {
    display: 'flex',
    flexWrap: 'wrap',
    columnGap: '8px',
    rowGap: '8px',
  },

  // main two columns (Narrative | Actions)
  mainGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    rowGap: '20px',
    '@media (min-width: 1024px)': {
      gridTemplateColumns: '1fr 1fr',
      columnGap: '20px',
    },
    borderBottom: `1px solid ${tokens.colorNeutralStroke1}`,
    paddingBottom: '24px',
  },
});

export default function StoryDetailPage() {
  const s = useStyles();
  // 2. ดึง action `setMainOverflow` มาจาก store
  const { setMainOverflow } = useLayoutStore();
  // 3. ใช้ useEffect เพื่อจัดการ overflow ของ AppShell
  React.useEffect(() => {
    // เมื่อ component นี้ mount (ถูกเปิดขึ้นมา)
    // ให้เปลี่ยน overflow ของ <main> เป็น 'visible'
    // เพื่อให้ scrollbar ของ AppShell หายไป และให้หน้านี้ควบคุม scroll เอง
    setMainOverflow('visible');

    // *** สำคัญที่สุด ***
    // เมื่อ component นี้ unmount (ผู้ใช้เปลี่ยนไปหน้าอื่น)
    // ให้คืนค่า overflow กลับเป็น 'auto' เหมือนเดิม
    return () => {
      setMainOverflow('auto');
    };
  }, [setMainOverflow]);
  const [aiOpen, setAiOpen] = React.useState(false);

  return (
    <div className={s.outer}>
      {!aiOpen && (
        <Button
          className={s.askAiButton}
          icon={<Sparkle24Regular />}
          onClick={() => setAiOpen((v) => !v)}
        >
          Ask AI
        </Button>
      )}

      <div className={aiOpen ? s.splitGrid : s.singleGrid}>
        {/* LEFT (content) */}
        <section className={s.leftPane}>
          <div className={s.page}>
            {/* Hero / Alert */}
            {/* Toolbar ด้านบนหัวเรื่อง: ปุ่ม Ask AI */}

            <div className={s.heroTitleRow}>
              <Title1 as="h1">Conversions ร่วงแรงที่ขั้นชำระเงิน</Title1>
              <div className={s.detailRow}>
                <span className={s.deltaPill}>▼ −88% vs prior 7 days</span>
                {/* Context chips */}
                <div className={s.chips} role="toolbar" aria-label="page context">
                  <Badge appearance="outline">
                    <strong>Facebook</strong>
                  </Badge>
                  <Badge appearance="outline">ช่วง: 3–9 ส.ค. 2025</Badge>
                  <Badge appearance="outline">เทียบกับ: 27 ก.ค.–2 ส.ค. 2025</Badge>
                  <Badge appearance="outline">Metric: Conversions</Badge>
                  <Badge appearance="outline">ประเทศ: TH</Badge>
                </div>
              </div>
            </div>

            {/* Narrative + Recommended Actions */}
            <section className={s.mainGrid}>
              <NarrativeCard />
              <ActionsCard />
            </section>

            {/* Evidence (Trend + Funnel + Breakdown) */}
            <EvidenceSection
              trend={{ current: trendCurrent, prior: trendPrior }}
              funnel={funnelRows}
              deviceRows={breakdownDevice}
              regionRows={breakdownRegion}
            />

            {/* Wrap-up KPIs (4 ใบ) */}
            <WrapupKpis />
          </div>
        </section>

        {/* RIGHT (Chat AI) — พื้นที่เปล่า ๆ ตามสเปค */}
        {aiOpen && (
          <aside className={s.rightPane} aria-label="AI Chat Panel">
            <div className={s.rightInner}>
              <div className={s.rightHeader}>
                <Text weight="semibold">Chat AI</Text>
                <Button size="small" onClick={() => setAiOpen(false)}>
                  Close
                </Button>
              </div>
              {/* เว้นว่างไว้ก่อนตามที่ระบุ */}
              <Card appearance="filled-alternative">
                <Text>พื้นที่สำหรับ Chat AI (จงใจเว้นเปล่า/placeholder)</Text>
              </Card>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
