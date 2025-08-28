// remotes/stories/src/storyDetail/NarrativeCard.tsx
import * as React from 'react';
import { Card, Text, Body1, makeStyles, shorthands, tokens } from '@fluentui/react-components';
import {
  Document20Color,
  Document28Color,
  TextBulletListSquareSparkle24Color,
} from '@fluentui/react-icons';

const useStyles = makeStyles({
  card: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    lineHeight: 1.6,
  },
  title: {
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForeground3,
    fontSize: '18px',
  },
  narrativeText: {},
  narrativeTitle: {
    display: 'flex',
    gap: '6px',
    alignItems: 'center',
  },
  tldr: {
    ...shorthands.borderLeft('4px', 'solid', tokens.colorBrandBackground),
    backgroundColor: tokens.colorNeutralBackground3,
    ...shorthands.padding('10px', '14px'),
    ...shorthands.borderRadius(tokens.borderRadiusXLarge),
    lineHeight: 1.6,
  },
  bullet: {
    display: 'flex',
    columnGap: '10px',
    ...shorthands.padding('10px', '12px'),
    backgroundColor: tokens.colorNeutralBackground3,
    ...shorthands.border('1px', 'solid', tokens.colorNeutralStroke2),
    ...shorthands.borderRadius(tokens.borderRadiusXLarge),
  },
  dot: {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    backgroundColor: tokens.colorBrandBackground,
    marginTop: '8px',
    flexShrink: 0,
  },
  stack: { display: 'flex', flexDirection: 'column', rowGap: '12px' },
});

export const NarrativeCard: React.FC = () => {
  const s = useStyles();
  return (
    <div className={s.card}>
      <div className={s.narrativeTitle}>
        <Document20Color />
        <Text className={s.title}>Narrative</Text>
      </div>

      <div className={s.tldr}>
        <Body1>
          <strong>TL;DR</strong> — การซื้อหล่น <strong>−88%</strong> สัมพันธ์กับ{' '}
          <strong>Phone Verification (OTP)</strong> และเหตุการณ์ <strong>payment timeout</strong>{' '}
          ช่วง 5 ส.ค. โดยเฉพาะบนมือถือ ขณะที่ตัวชี้วัด (impr/click/spend) ใกล้เคียงเดิม
        </Body1>
      </div>

      <div className={s.stack}>
        <div className={s.bullet}>
          <span className={s.dot} />
          <span className={s.narrativeText}>
            <strong>Top-funnel แข็งแรง</strong>: Impressions +3%, CTR −7%, Spend −2% →
            ไม่ใช่ปัญหาการหาทราฟฟิก
          </span>
        </div>
        <div className={s.bullet}>
          <span className={s.dot} />
          <Body1>
            <strong>คอขวดอยู่ที่ขั้นจ่ายเงิน</strong>: Purchases/1k clicks จาก 6.86 →{' '}
            <strong>0.82</strong>; จุดเปลี่ยนเริ่ม 4–5 ส.ค.
          </Body1>
        </div>
        <div className={s.bullet}>
          <span className={s.dot} />
          <Body1>
            <strong>Mobile เจ็บสุด</strong>: drop-off หลัง OTP เพิ่ม +27%, TTI เพิ่ม +0.6s
            จากสคริปต์ heatmap
          </Body1>
        </div>
        <div className={s.bullet}>
          <span className={s.dot} />
          <Body1>
            <strong>เหตุการณ์สนับสนุน</strong>: payment provider timeout <em>5 ส.ค. 01:10–03:20</em>{' '}
            (error 8%); เปิด OTP 4 ส.ค.
          </Body1>
        </div>
        <div className={s.bullet}>
          <span className={s.dot} />
          <Body1>
            <strong>การแข่งขัน/ราคาโฆษณา</strong> ไม่เปลี่ยนมาก (CPM/CPC ใกล้เดิม) →
            ตัดข้อสงสัยเรื่อง auction
          </Body1>
        </div>
      </div>
    </div>
  );
};
